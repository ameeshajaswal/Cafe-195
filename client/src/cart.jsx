import React, { useState } from "react";
import { apiFetch } from "./api";

const nameMapDrink = {
    icedLatte: "Iced Latte",
    icedChocolate: "Iced Chocolate",
    icedCappuccino: "Iced Cappuccino",
    strawberrySmoothie: "Smoothie",
};

const nameMapFood = {
    croissant: "Croissant",
    clubSandwich: "Club Sandwich",
    spaghetti: "Spaghetti",
    kuyteav: "Kuyteav",
};

const drinkPrices = {
    icedLatte: 4.25,
    icedChocolate: 4.25,
    icedCappuccino: 4.25,
    strawberrySmoothie: 4.25,
};

const foodPrices = {
    croissant: 12.25,
    clubSandwich: 12.25,
    spaghetti: 12.25,
    kuyteav: 12.25,
};

function Cart({ drinkCart, foodCart, resetCart }) {
    const [orderStatus, setOrderStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const drinkList = Object.entries(drinkCart)
        .filter(([, quantity]) => quantity > 0)
        .map(([key, quantity]) => ({
            key,
            name: nameMapDrink[key] ?? key,
            quantity,
            unitPrice: drinkPrices[key] ?? 0,
            subtotal: (drinkPrices[key] ?? 0) * quantity,
        }));

    const foodList = Object.entries(foodCart)
        .filter(([, quantity]) => quantity > 0)
        .map(([key, quantity]) => ({
            key,
            name: nameMapFood[key] ?? key,
            quantity,
            unitPrice: foodPrices[key] ?? 0,
            subtotal: (foodPrices[key] ?? 0) * quantity,
        }));

    const totalPrice = [...drinkList, ...foodList]
        .reduce((total, item) => total + item.subtotal, 0);

    const isAuthed = () => {
        if (typeof window === "undefined") return false;
        return !!(window.localStorage.getItem("authToken") || window.localStorage.getItem("authUser"));
    };

    const getAuthUser = () => {
        if (typeof window === "undefined") return null;
        try {
            const raw = window.localStorage.getItem("authUser");
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            console.error("Failed to parse auth user", err);
            return null;
        }
    };

    const clearCart = () => resetCart();

    const handleOrderClick = async () => {
        const authed = isAuthed();
        const hasItems = drinkList.length > 0 || foodList.length > 0;
        setOrderStatus(null);

        if (!authed) {
            alert("Please sign up or log in before placing an order.");
            clearCart();
            return;
        }

        if (!hasItems) {
            alert("Add something to your cart before placing an order.");
            clearCart();
            return;
        }

        const authUser = getAuthUser();
        if (!authUser?._id) {
            alert("User session invalid. Please log in again.");
            clearCart();
            return;
        }

        const payload = {
            drinkItems: drinkList.map(({ key, quantity }) => ({
                productId: key,
                quantity,
            })),
            foodItems: foodList.map(({ key, quantity }) => ({
                productId: key,
                quantity,
            })),
        };

        try {
            setIsSubmitting(true);
            await apiFetch("/api/orders", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            setOrderStatus({ type: "success", text: "Your order has been submitted successfully." });
            clearCart();
        } catch (err) {
            console.error("Failed to place order", err);
            setOrderStatus({ type: "error", text: err.message || "Failed to place order." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="cartPage">
            <div id="checkOutContainer">
                <h2>CHECK OUT</h2>
                <div id="checkOutSection">
                    <h3>DRINKS</h3>
                    <div id="drinkCheckOut">
                        {drinkList.map((item) => (
                            <div key={item.key} className="cartItem">
                                <span>{item.name}</span>
                                <span>-{item.quantity}-</span>
                                <span>Price: ${item.subtotal.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <h3>FOOD</h3>
                    <div id="foodCheckOut">
                        {foodList.map((item) => (
                            <div key={item.key} className="cartItem">
                                <span>{item.name}</span>
                                <span>-{item.quantity}-</span>
                                <span>Price: ${item.subtotal.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <h4>Total: ${totalPrice.toFixed(2)}</h4>
                </div>

                {orderStatus && (
                    <p
                        style={{
                            color: orderStatus.type === "success" ? "#8de27f" : "#f75b5b",
                            textAlign: "center",
                            marginTop: "12px",
                        }}
                    >
                        {orderStatus.text}
                    </p>
                )}

                <button id="checkOutOrderBtn" onClick={handleOrderClick} disabled={isSubmitting}>
                    {isSubmitting ? "Placing Order..." : "ORDER"}
                </button>
            </div>
        </section>
    );
}

export default Cart;
