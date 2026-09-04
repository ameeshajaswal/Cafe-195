import React from "react";
import "@testing-library/jest-dom";
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { apiFetch } from "./api";
import App from "./App";

jest.mock("./api", () => ({
  apiFetch: jest.fn(),
}));

const renderApp = () => render(
  <MemoryRouter>
    <App />
  </MemoryRouter>
);

describe("browser-local cart state", () => {
  afterEach(() => {
    window.localStorage.clear();
    apiFetch.mockReset();
  });

  test("menu changes update checkout immediately without cart API requests", () => {
    renderApp();

    fireEvent.click(document.getElementById("icedLatteAddBtn"));

    expect(document.getElementById("icedLatteQuantity")).toHaveTextContent("Quantity: 1");
    expect(within(document.getElementById("drinkCheckOut")).getByText("Iced Latte")).toBeInTheDocument();
    expect(within(document.getElementById("drinkCheckOut")).getByText("Price: $4.25")).toBeInTheDocument();
    expect(apiFetch).not.toHaveBeenCalled();

    fireEvent.click(document.getElementById("icedLatteRemoveBtn"));

    expect(document.getElementById("icedLatteQuantity")).toHaveTextContent("Quantity: 0");
    expect(within(document.getElementById("drinkCheckOut")).queryByText("Iced Latte")).not.toBeInTheDocument();

    fireEvent.click(document.getElementById("croissantAddBtn"));
    expect(document.getElementById("croissantQuantity")).toHaveTextContent("Quantity: 1");
    expect(within(document.getElementById("foodCheckOut")).getByText("Croissant")).toBeInTheDocument();

    fireEvent.click(document.getElementById("croissantRemoveBtn"));
    expect(document.getElementById("croissantQuantity")).toHaveTextContent("Quantity: 0");
    expect(within(document.getElementById("foodCheckOut")).queryByText("Croissant")).not.toBeInTheDocument();
  });

  test("checkout sends only product identifiers and quantities, then resets local state", async () => {
    window.localStorage.setItem("authToken", "test-token");
    window.localStorage.setItem("authUser", JSON.stringify({ _id: "authenticated-user" }));
    apiFetch.mockResolvedValue({ message: "Order created" });
    renderApp();

    fireEvent.click(document.getElementById("icedLatteAddBtn"));
    fireEvent.click(document.getElementById("croissantAddBtn"));
    fireEvent.click(document.getElementById("checkOutOrderBtn"));

    await waitFor(() => expect(apiFetch).toHaveBeenCalledTimes(1));

    const [url, options] = apiFetch.mock.calls[0];
    expect(url).toBe("/api/orders");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({
      drinkItems: [{ productId: "icedLatte", quantity: 1 }],
      foodItems: [{ productId: "croissant", quantity: 1 }],
    });

    await waitFor(() => {
      expect(document.getElementById("icedLatteQuantity")).toHaveTextContent("Quantity: 0");
      expect(document.getElementById("croissantQuantity")).toHaveTextContent("Quantity: 0");
    });
  });
});
