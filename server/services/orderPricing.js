import {
  DRINK_CATALOG,
  FOOD_CATALOG,
  MAX_ITEM_QUANTITY
} from "../config/menuCatalog.js";

export class OrderPricingError extends Error {}

const dollarsFromCents = (cents) => cents / 100;
const catalogHasProduct = (catalog, productId) =>
  Object.prototype.hasOwnProperty.call(catalog, productId);

function priceItems(items, itemType, catalog, otherCatalog) {
  if (!Array.isArray(items)) {
    throw new OrderPricingError(`${itemType}Items must be an array`);
  }

  const seenProductIds = new Set();

  return items.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new OrderPricingError(`${itemType}Items[${index}] must be an object`);
    }

    const { productId, quantity } = item;

    if (typeof productId !== "string" || productId.length === 0) {
      throw new OrderPricingError(
        `${itemType}Items[${index}].productId is required and must be a string`
      );
    }

    const product = catalogHasProduct(catalog, productId)
      ? catalog[productId]
      : null;
    if (!product) {
      if (catalogHasProduct(otherCatalog, productId)) {
        throw new OrderPricingError(
          `Product "${productId}" is not a ${itemType} product`
        );
      }
      throw new OrderPricingError(`Unknown ${itemType} productId: ${productId}`);
    }

    if (seenProductIds.has(productId)) {
      throw new OrderPricingError(`Duplicate ${itemType} productId: ${productId}`);
    }
    seenProductIds.add(productId);

    if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
      throw new OrderPricingError(
        `${itemType}Items[${index}].quantity must be a number`
      );
    }
    if (!Number.isInteger(quantity)) {
      throw new OrderPricingError(
        `${itemType}Items[${index}].quantity must be an integer`
      );
    }
    if (quantity <= 0) {
      throw new OrderPricingError(
        `${itemType}Items[${index}].quantity must be greater than zero`
      );
    }
    if (quantity > MAX_ITEM_QUANTITY) {
      throw new OrderPricingError(
        `${itemType}Items[${index}].quantity cannot exceed ${MAX_ITEM_QUANTITY}`
      );
    }

    const subtotalCents = product.unitPriceCents * quantity;

    return {
      productId,
      name: product.name,
      quantity,
      unitPrice: dollarsFromCents(product.unitPriceCents),
      subtotal: dollarsFromCents(subtotalCents)
    };
  });
}

export function calculateOrderPricing(input = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new OrderPricingError("Order payload must be an object");
  }

  const { foodItems = [], drinkItems = [] } = input;
  const pricedFoodItems = priceItems(
    foodItems,
    "food",
    FOOD_CATALOG,
    DRINK_CATALOG
  );
  const pricedDrinkItems = priceItems(
    drinkItems,
    "drink",
    DRINK_CATALOG,
    FOOD_CATALOG
  );

  if (pricedFoodItems.length === 0 && pricedDrinkItems.length === 0) {
    throw new OrderPricingError("Order must contain at least one item");
  }

  const totalFoodCents = pricedFoodItems.reduce(
    (total, item) =>
      total + FOOD_CATALOG[item.productId].unitPriceCents * item.quantity,
    0
  );
  const totalDrinkCents = pricedDrinkItems.reduce(
    (total, item) =>
      total + DRINK_CATALOG[item.productId].unitPriceCents * item.quantity,
    0
  );

  return {
    foodItems: pricedFoodItems,
    drinkItems: pricedDrinkItems,
    total_food_price: dollarsFromCents(totalFoodCents),
    total_drink_price: dollarsFromCents(totalDrinkCents),
    total_price: dollarsFromCents(totalFoodCents + totalDrinkCents)
  };
}
