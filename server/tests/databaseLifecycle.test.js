import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import express from "express";
import mongoose from "mongoose";
import connectDB from "../config/config.js";

test("database lifecycle across concurrent cold requests, failure, and warm reuse", { timeout: 10000 }, async (t) => {
  const originalEnv = { ...process.env };
  t.after(() => {
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    Object.assign(process.env, originalEnv);
  });

  // All database connections are mocked; this suite never contacts Atlas.
  process.env.VERCEL = "1";
  process.env.MONGO_URI = "mongodb://database.invalid/test";
  process.env.JWT_SECRET = "database-lifecycle-test-secret";
  process.env.CLIENT_URL = "https://frontend.example.test";
  let readyState = 0;
  const originalState = Object.getOwnPropertyDescriptor(mongoose.connection, "readyState");
  Object.defineProperty(mongoose.connection, "readyState", {
    configurable: true,
    get: () => readyState
  });
  t.after(() => {
    if (originalState) Object.defineProperty(mongoose.connection, "readyState", originalState);
    else delete mongoose.connection.readyState;
  });
  let resolveConnection;
  let rejectConnection;
  let onConnect = () => {};
  const connect = t.mock.method(mongoose, "connect", () => new Promise((resolve, reject) => {
    resolveConnection = () => { readyState = 1; resolve(mongoose); };
    rejectConnection = reject;
    onConnect();
  }));
  const disconnect = t.mock.method(mongoose, "disconnect", async () => {});
  t.mock.method(console, "log", () => {});
  t.mock.method(console, "error", () => {});

  let server;
  const listen = express.application.listen;
  t.mock.method(express.application, "listen", function () {
    server = listen.call(this, 0, "127.0.0.1");
    return server;
  });
  t.after(async () => {
    if (server) {
      server.closeAllConnections();
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
  await import("../server.js");
  if (!server.listening) await once(server, "listening");
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  assert.equal(connect.mock.callCount(), 0, "Vercel initialization must not connect or seed");
  assert.equal(process.env.MONGO_URI, "mongodb://database.invalid/test", "dotenv must preserve injected variables");
  assert.equal(process.env.JWT_SECRET, "database-lifecycle-test-secret");

  await t.test("health and bearer CORS preflight work without a database", async () => {
    const health = await fetch(`${baseUrl}/api/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "healthy" });
    for (const origin of [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"]) {
      const preflight = await fetch(`${baseUrl}/api/orders`, {
        method: "OPTIONS",
        headers: {
          Origin: origin,
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "authorization,content-type"
        }
      });
      assert.equal(preflight.status, 204);
      assert.equal(preflight.headers.get("access-control-allow-origin"), origin);
      assert.equal(preflight.headers.get("access-control-allow-credentials"), "true");
      assert.match(preflight.headers.get("access-control-allow-headers"), /authorization/i);
    }
    const denied = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://unapproved.example.test" } });
    assert.equal(denied.headers.get("access-control-allow-origin"), null);
    await denied.text();
    assert.equal(connect.mock.callCount(), 0);
  });

  await t.test("concurrent failed connections reject together and can retry", async () => {
    const attempts = Array.from({ length: 8 }, () => connectDB());
    const settled = Promise.allSettled(attempts);
    assert.equal(connect.mock.callCount(), 1);
    rejectConnection(new Error("simulated private database detail"));
    assert.ok((await settled).every((result) => result.status === "rejected"));

    const connectionStarted = new Promise((resolve) => { onConnect = resolve; });
    const pendingRequest = fetch(`${baseUrl}/api/users/me`);
    await connectionStarted;
    rejectConnection(new Error("simulated private database detail"));
    const failed = await pendingRequest;
    assert.equal(failed.status, 503);
    assert.deepEqual(await failed.json(), { message: "Database temporarily unavailable" });
    const health = await fetch(`${baseUrl}/api/health`);
    assert.deepEqual(await health.json(), { status: "healthy" });
  });

  await t.test("recovered cold requests share a connection and warm requests reuse it", async () => {
    const attempts = Array.from({ length: 8 }, () => connectDB());
    assert.equal(connect.mock.callCount(), 3);
    resolveConnection();
    assert.ok((await Promise.all(attempts)).every((value) => value === mongoose));
    for (const path of ["users/me", "orders", "foods", "drinks"]) {
      const response = await fetch(`${baseUrl}/api/${path}`);
      assert.equal(response.status, 401, "normal authentication resumes after recovery");
      await response.json();
    }
    assert.equal(connect.mock.callCount(), 3);
    assert.equal(disconnect.mock.callCount(), 0);
  });

  await t.test("a disconnected runtime can reconnect, and missing configuration fails safely", async () => {
    readyState = 0;
    delete process.env.MONGO_URI;
    await assert.rejects(connectDB(), /MONGO_URI must be configured/);
    assert.equal(connect.mock.callCount(), 3);
    process.env.MONGO_URI = "mongodb://database.invalid/test";
    const connection = connectDB();
    assert.equal(connect.mock.callCount(), 4);
    resolveConnection();
    await connection;
  });
});
