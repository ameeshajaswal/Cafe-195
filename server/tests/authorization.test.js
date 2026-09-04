import assert from "node:assert/strict";
import { after, test } from "node:test";

import User from "../models/User.js";
import Order from "../models/order.js";
import Counter from "../models/counter.js";
import userRoutes from "../routes/userRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";
import foodRoutes from "../routes/foodRoutes.js";
import drinkRoutes from "../routes/drinkRoute.js";
import { registerUser } from "../controllers/userController.js";
import {
  createOrder,
  deleteMyOrder,
  getOrderById,
  updateMyOrder
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const originalJwtSecret = process.env.JWT_SECRET;
process.env.JWT_SECRET = "authorization-test-secret";

after(() => {
  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }
});

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

function middlewareNames(router, method, path) {
  const layer = router.stack.find(
    (candidate) => candidate.route?.path === path && candidate.route.methods[method]
  );

  assert.ok(layer, `${method.toUpperCase()} ${path} route must exist`);
  return layer.route.stack.map((candidate) => candidate.handle.name);
}

test("public registration always creates a customer", async (t) => {
  let createInput;
  t.mock.method(User, "findOne", async () => null);
  t.mock.method(User, "create", async (input) => {
    createInput = input;
    return { _id: "new-user", ...input };
  });

  const req = {
    body: {
      name: "Malicious Registrant",
      email: "customer@example.com",
      password: "password",
      role: "admin"
    }
  };
  const res = createResponse();

  await registerUser(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(createInput.role, "customer");
  assert.equal(res.body.role, "customer");
});

test("the public bootstrap-admin route is unavailable", () => {
  const bootstrapRoute = userRoutes.stack.find(
    (layer) => layer.route?.path === "/bootstrap-admin"
  );

  assert.equal(bootstrapRoute, undefined);
});

test("unauthenticated requests are rejected by order authentication", async () => {
  assert.deepEqual(middlewareNames(orderRoutes, "post", "/"), [
    "protect",
    "createOrder"
  ]);

  const res = createResponse();
  let nextCalled = false;

  await protect({ headers: {} }, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("order creation ignores a supplied UserID and uses the authenticated user", async (t) => {
  let createInput;
  t.mock.method(Counter, "findOneAndUpdate", async () => ({ seq: 1 }));
  t.mock.method(Order, "create", async (input) => {
    createInput = input;
    return input;
  });

  const req = {
    user: { _id: "authenticated-user" },
    body: {
      UserID: "different-user",
      drinkItems: [
        { productId: "icedLatte", quantity: 1 }
      ],
      foodItems: [],
      total_drink_price: 4.25,
      total_food_price: 0,
      total_price: 4.25
    }
  };
  const res = createResponse();

  await createOrder(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(createInput.UserID, "authenticated-user");
  assert.notEqual(createInput.UserID, req.body.UserID);
});

test("a customer cannot inspect another customer's order", async (t) => {
  t.mock.method(Order, "findById", async () => ({
    _id: "private-order",
    UserID: "customer-b"
  }));

  const req = {
    params: { id: "private-order" },
    user: { _id: "customer-a", role: "customer" }
  };
  const res = createResponse();

  await getOrderById(req, res);

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, { message: "Order not found" });
});

test("a customer cannot update or delete another customer's order", async (t) => {
  t.mock.method(Order, "findById", async () => ({
    _id: "private-order",
    UserID: "customer-b"
  }));

  const request = {
    params: { id: "private-order" },
    user: { _id: "customer-a", role: "customer" },
    body: {}
  };

  const updateResponse = createResponse();
  await updateMyOrder(request, updateResponse);
  assert.equal(updateResponse.statusCode, 403);

  const deleteResponse = createResponse();
  await deleteMyOrder(request, deleteResponse);
  assert.equal(deleteResponse.statusCode, 403);
});

test("generic order administration routes require admin authorization", () => {
  assert.deepEqual(middlewareNames(orderRoutes, "get", "/"), [
    "protect",
    "admin",
    "getOrders"
  ]);
  assert.deepEqual(middlewareNames(orderRoutes, "put", "/:id"), [
    "protect",
    "admin",
    "updateOrder"
  ]);
  assert.deepEqual(middlewareNames(orderRoutes, "delete", "/:id"), [
    "protect",
    "admin",
    "deleteOrder"
  ]);
});

test("admin middleware rejects customers and permits admins", () => {
  const customerResponse = createResponse();
  let customerNextCalled = false;
  admin({ user: { role: "customer" } }, customerResponse, () => {
    customerNextCalled = true;
  });

  assert.equal(customerResponse.statusCode, 403);
  assert.equal(customerNextCalled, false);

  const adminResponse = createResponse();
  let adminNextCalled = false;
  admin({ user: { role: "admin" } }, adminResponse, () => {
    adminNextCalled = true;
  });

  assert.equal(adminResponse.statusCode, 200);
  assert.equal(adminNextCalled, true);
});

test("an admin can inspect any individual order", async (t) => {
  const order = { _id: "customer-order", UserID: "customer-b" };
  t.mock.method(Order, "findById", async () => order);

  const req = {
    params: { id: "customer-order" },
    user: { _id: "admin-user", role: "admin" }
  };
  const res = createResponse();

  await getOrderById(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body, order);
});

test("food and drink mutations require admin authorization", () => {
  for (const router of [foodRoutes, drinkRoutes]) {
    assert.ok(middlewareNames(router, "post", "/").includes("admin"));
    assert.ok(middlewareNames(router, "put", "/:id").includes("admin"));
    assert.ok(middlewareNames(router, "delete", "/:id").includes("admin"));
  }
});
