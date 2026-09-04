import assert from "node:assert/strict";
import { test } from "node:test";

import Order from "../models/order.js";
import Counter from "../models/counter.js";
import {
  createOrder,
  updateMyOrder,
  updateOrder
} from "../controllers/orderController.js";
import {
  calculateOrderPricing,
  OrderPricingError
} from "../services/orderPricing.js";

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

function createStoredOrder(overrides = {}) {
  return {
    _id: "order-id",
    UserID: "customer-a",
    foodItems: [],
    drinkItems: [],
    total_food_price: 0,
    total_drink_price: 0,
    total_price: 0,
    async save() {
      return this;
    },
    ...overrides
  };
}

test("creation stores only server-authoritative prices, totals, and owner", async (t) => {
  let createInput;
  t.mock.method(Counter, "findOneAndUpdate", async () => ({ seq: 7 }));
  t.mock.method(Order, "create", async (input) => {
    createInput = input;
    return input;
  });

  const req = {
    user: { _id: "authenticated-user" },
    body: {
      UserID: "attacker-selected-user",
      foodItems: [
        {
          productId: "croissant",
          quantity: 2,
          name: "Fake food",
          unitPrice: 0.01,
          subtotal: 0.01
        }
      ],
      drinkItems: [
        {
          productId: "icedLatte",
          quantity: 1,
          name: "Fake drink",
          unitPrice: 0.01,
          subtotal: 0.01
        }
      ],
      total_food_price: 0.01,
      total_drink_price: 0.01,
      total_price: 0.01
    }
  };
  const res = createResponse();

  await createOrder(req, res);

  assert.equal(res.statusCode, 201);
  assert.deepEqual(createInput.foodItems, [
    {
      productId: "croissant",
      name: "Croissant",
      quantity: 2,
      unitPrice: 12.25,
      subtotal: 24.5
    }
  ]);
  assert.deepEqual(createInput.drinkItems, [
    {
      productId: "icedLatte",
      name: "Iced Latte",
      quantity: 1,
      unitPrice: 4.25,
      subtotal: 4.25
    }
  ]);
  assert.equal(createInput.total_food_price, 24.5);
  assert.equal(createInput.total_drink_price, 4.25);
  assert.equal(createInput.total_price, 28.75);
  assert.equal(createInput.UserID, "authenticated-user");
  assert.notEqual(createInput.UserID, req.body.UserID);
});

test("catalog pricing produces deterministic line snapshots and totals", () => {
  const result = calculateOrderPricing({
    foodItems: [
      { productId: "clubSandwich", quantity: 3 },
      { productId: "kuyteav", quantity: 1 }
    ],
    drinkItems: [{ productId: "strawberrySmoothie", quantity: 2 }]
  });

  assert.deepEqual(result.foodItems[0], {
    productId: "clubSandwich",
    name: "Club Sandwich",
    quantity: 3,
    unitPrice: 12.25,
    subtotal: 36.75
  });
  assert.deepEqual(result.drinkItems[0], {
    productId: "strawberrySmoothie",
    name: "Strawberry Smoothie",
    quantity: 2,
    unitPrice: 4.25,
    subtotal: 8.5
  });
  assert.equal(result.total_food_price, 49);
  assert.equal(result.total_drink_price, 8.5);
  assert.equal(result.total_price, 57.5);
});

test("invalid quantities are rejected", () => {
  const invalidQuantities = [-1, 0, 1.5, "2", Number.NaN, 101];

  for (const quantity of invalidQuantities) {
    assert.throws(
      () => calculateOrderPricing({
        foodItems: [{ productId: "croissant", quantity }]
      }),
      OrderPricingError
    );
  }
});

test("unknown, missing, and wrong-type product IDs are rejected", () => {
  assert.throws(
    () => calculateOrderPricing({
      foodItems: [{ productId: "notOnTheMenu", quantity: 1 }]
    }),
    /Unknown food productId/
  );
  assert.throws(
    () => calculateOrderPricing({
      foodItems: [{ quantity: 1 }]
    }),
    /productId is required/
  );
  assert.throws(
    () => calculateOrderPricing({
      foodItems: [{ productId: "icedLatte", quantity: 1 }]
    }),
    /is not a food product/
  );
  assert.throws(
    () => calculateOrderPricing({
      foodItems: [{ productId: "toString", quantity: 1 }]
    }),
    /Unknown food productId/
  );
});

test("empty and malformed orders are rejected", () => {
  assert.throws(() => calculateOrderPricing({}), /at least one item/);
  assert.throws(
    () => calculateOrderPricing({ foodItems: "croissant" }),
    /foodItems must be an array/
  );
  assert.throws(
    () => calculateOrderPricing(null),
    /Order payload must be an object/
  );
});

test("invalid product input returns HTTP 400 before order numbering", async (t) => {
  let counterCalled = false;
  t.mock.method(Counter, "findOneAndUpdate", async () => {
    counterCalled = true;
    return { seq: 1 };
  });

  const res = createResponse();
  await createOrder(
    {
      user: { _id: "customer-a" },
      body: {
        foodItems: [{ productId: "notOnTheMenu", quantity: 1 }]
      }
    },
    res
  );

  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /Unknown food productId/);
  assert.equal(counterCalled, false);
});

test("customer item updates recalculate every monetary field", async (t) => {
  const order = createStoredOrder({
    foodItems: [
      {
        productId: "croissant",
        name: "Croissant",
        quantity: 1,
        unitPrice: 12.25,
        subtotal: 12.25
      }
    ],
    total_food_price: 12.25,
    total_price: 12.25
  });
  t.mock.method(Order, "findById", async () => order);

  const req = {
    params: { id: "order-id" },
    user: { _id: "customer-a", role: "customer" },
    body: {
      foodItems: [
        {
          productId: "croissant",
          quantity: 3,
          unitPrice: 0.01,
          subtotal: 0.01
        }
      ],
      drinkItems: [],
      total_food_price: 0.01,
      total_drink_price: 999,
      total_price: 0.01
    }
  };
  const res = createResponse();

  await updateMyOrder(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(order.foodItems[0].unitPrice, 12.25);
  assert.equal(order.foodItems[0].subtotal, 36.75);
  assert.equal(order.total_food_price, 36.75);
  assert.equal(order.total_drink_price, 0);
  assert.equal(order.total_price, 36.75);
});

test("admin item updates also recalculate rather than override totals", async (t) => {
  const order = createStoredOrder();
  t.mock.method(Order, "findById", async () => order);

  const req = {
    params: { id: "order-id" },
    body: {
      foodItems: [],
      drinkItems: [{ productId: "icedCappuccino", quantity: 4, unitPrice: 0 }],
      total_drink_price: 0,
      total_price: 0
    }
  };
  const res = createResponse();

  await updateOrder(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(order.drinkItems[0].unitPrice, 4.25);
  assert.equal(order.drinkItems[0].subtotal, 17);
  assert.equal(order.total_food_price, 0);
  assert.equal(order.total_drink_price, 17);
  assert.equal(order.total_price, 17);
});

test("updates reject an empty resulting order", async (t) => {
  const order = createStoredOrder({
    foodItems: [
      {
        productId: "croissant",
        name: "Croissant",
        quantity: 1,
        unitPrice: 12.25,
        subtotal: 12.25
      }
    ]
  });
  t.mock.method(Order, "findById", async () => order);

  const res = createResponse();
  await updateMyOrder(
    {
      params: { id: "order-id" },
      user: { _id: "customer-a", role: "customer" },
      body: { foodItems: [], drinkItems: [] }
    },
    res
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { message: "Order must contain at least one item" });
});
