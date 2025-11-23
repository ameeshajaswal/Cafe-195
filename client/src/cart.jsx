import React, { useEffect, useState } from "react";
import { apiFetch } from "./api";

function Cart() {
    const [drinkList, setDrinkList] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderStatus, setOrderStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const clearCart = async () => {
        try {
            await Promise.all([
                fetch("http://localhost:5000/api/drinkCart/reset", { method: "POST" }),
                fetch("http://localhost:5000/api/foodCart/reset", { method: "POST" })
            ]);
        } catch (err) {
            console.error("Failed to clear cart", err);
        } finally {
            setDrinkList([]);
            setFoodList([]);
            setTotalPrice(0);
        }
    };

    const handleOrderClick = async () => {
        const authed = isAuthed();
        const hasItems = drinkList.length > 0 || foodList.length > 0;
        setOrderStatus(null);

        if (!authed) {
            alert("Please sign up or log in before placing an order.");
            await clearCart();
            return;
        }

        if (!hasItems) {
            alert("Add something to your cart before placing an order.");
            await clearCart();
            return;
        }

        const authUser = getAuthUser();
        if (!authUser?._id) {
            alert("User session invalid. Please log in again.");
            await clearCart();
            return;
        }

        const totalDrinkPrice = drinkList.reduce((sum, item) => sum + item.subtotal, 0);
        const totalFoodPrice = foodList.reduce((sum, item) => sum + item.subtotal, 0);
        const payload = {
            drinkItems: drinkList.map(({ name, quantity, unitPrice, subtotal }) => ({
                name,
                quantity,
                unitPrice,
                subtotal,
            })),
            foodItems: foodList.map(({ name, quantity, unitPrice, subtotal }) => ({
                name,
                quantity,
                unitPrice,
                subtotal,
            })),
            total_drink_price: Number(totalDrinkPrice.toFixed(2)),
            total_food_price: Number(totalFoodPrice.toFixed(2)),
            total_price: Number((totalDrinkPrice + totalFoodPrice).toFixed(2)),
            UserID: authUser._id,
        };

        try {
            setIsSubmitting(true);
            await apiFetch("/api/orders", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            setOrderStatus({ type: "success", text: "Your order has been submitted successfully." });
            await clearCart();
        } catch (err) {
            console.error("Failed to place order", err);
            setOrderStatus({ type: "error", text: err.message || "Failed to place order." });
        } finally {
            setIsSubmitting(false);
        }
    };

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

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:5000/api/drinkCart")
                .then((res) => res.json())
                .then((data) => {
                    const arr = Object.entries(data)
                        .filter(([, qty]) => qty > 0)
                        .map(([key, qty]) => ({
                            key,
                            name: nameMapDrink[key] ?? key,
                            quantity: qty,
                            unitPrice: drinkPrices[key] ?? 0,
                            subtotal: (drinkPrices[key] ?? 0) * qty,
                        }));
                    setDrinkList(arr);
                })
                .catch((err) => console.error(err));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:5000/api/foodCart")
                .then((res) => res.json())
                .then((data) => {
                    const arr = Object.entries(data)
                        .filter(([, qty]) => qty > 0)
                        .map(([key, qty]) => ({
                            key,
                            name: nameMapFood[key] ?? key,
                            quantity: qty,
                            unitPrice: foodPrices[key] ?? 0,
                            subtotal: (foodPrices[key] ?? 0) * qty,
                        }));
                    setFoodList(arr);
                })
                .catch((err) => console.error(err));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const drinkTotal = drinkList.reduce((acc, item) => acc + item.subtotal, 0);
        const foodTotal = foodList.reduce((acc, item) => acc + item.subtotal, 0);
        setTotalPrice(drinkTotal + foodTotal);
    }, [drinkList, foodList]);

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
