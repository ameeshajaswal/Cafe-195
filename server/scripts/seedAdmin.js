import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

class SeedError extends Error {}

const requiredVariables = [
  "MONGO_URI",
  "ADMIN_NAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

const missingVariables = requiredVariables.filter(
  (name) => !process.env[name] || process.env[name].trim().length === 0
);

const seedAdmin = async () => {
  if (missingVariables.length > 0) {
    throw new SeedError(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }

  const name = process.env.ADMIN_NAME.trim();
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  await mongoose.connect(process.env.MONGO_URI);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.role !== "admin") {
      throw new SeedError(
        "ADMIN_EMAIL belongs to a non-admin account; no changes were made."
      );
    }

    const existingPasswordIsHashed = existingUser.password !== password;
    const existingPasswordMatches = await existingUser.matchPassword(password);
    if (!existingPasswordIsHashed || !existingPasswordMatches) {
      throw new SeedError(
        "Existing administrator credentials could not be verified; no changes were made."
      );
    }

    console.log("Administrator already exists and is verified; no changes were made.");
    return;
  }

  const administrator = await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  const passwordIsHashed = administrator.password !== password;
  const passwordMatches = await administrator.matchPassword(password);
  const desiredStateConfirmed =
    administrator.role === "admin" &&
    administrator.email === email &&
    passwordIsHashed &&
    passwordMatches;

  if (!desiredStateConfirmed) {
    throw new SeedError("Administrator creation could not be verified.");
  }

  console.log("Administrator created and verified successfully.");
};

try {
  await seedAdmin();
} catch (error) {
  const message =
    error instanceof SeedError
      ? error.message
      : "Administrator initialization failed during a database operation.";
  console.error(`Admin seed failed: ${message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
