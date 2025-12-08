import React, { useState } from "react";
import 'primeicons/primeicons.css';
import { API_BASE } from "./config";

function FoodPage() {
    const [croissantNum, setCroissantNum] = useState(0);
    const [clubSandwichNum, setClubSandwichNum] = useState(0);
    const [spaghettiNum, setSpaghettiNum] = useState(0);
    const [kuyteavNum, setKuyteavNum] = useState(0);

    const syncCart = async () => {
        const res = await fetch(`${API_BASE}/api/foodCart`);
        const data = await res.json();

        setCroissantNum(data.croissant);
        setClubSandwichNum(data.clubSandwich);
        setSpaghettiNum(data.spaghetti);
        setKuyteavNum(data.kuyteav);
    };

    const addCroissant = async () => {
        setCroissantNum(croissantNum + 1);

        await fetch(`${API_BASE}/api/foodCart/croissant/add`, {
            method: "POST"
        });

        syncCart();
    };

    const removeCroissant = async () => {
        if (croissantNum > 0) {
            setCroissantNum(croissantNum - 1);

            await fetch(`${API_BASE}/api/foodCart/croissant/remove`, {
                method: "POST"
            });

            syncCart();
        }
    };

    const addClubSandwich = async () => {
        setClubSandwichNum(clubSandwichNum + 1);

        await fetch(`${API_BASE}/api/foodCart/clubSandwich/add`, {
            method: "POST"
        });

        syncCart();
    };

    const removeClubSandwich = async () => {
        if (clubSandwichNum > 0) {
            setClubSandwichNum(clubSandwichNum - 1);

            await fetch(`${API_BASE}/api/foodCart/clubSandwich/remove`, {
                method: "POST"
            });

            syncCart();
        }
    };

    const addSpaghetti = async () => {
        setSpaghettiNum(spaghettiNum + 1);

        await fetch(`${API_BASE}/api/foodCart/spaghetti/add`, {
            method: "POST"
        });

        syncCart();
    };

    const removeSpaghetti = async () => {
        if (spaghettiNum > 0) {
            setSpaghettiNum(spaghettiNum - 1);

            await fetch(`${API_BASE}/api/foodCart/spaghetti/remove`, {
                method: "POST"
            });

            syncCart();
        }
    };

    const addKuyteav = async () => {
        setKuyteavNum(kuyteavNum + 1);

        await fetch(`${API_BASE}/api/foodCart/kuyteav/add`, {
            method: "POST"
        });

        syncCart();
    };

    const removeKuyteav = async () => {
        if (kuyteavNum > 0) {
            setKuyteavNum(kuyteavNum - 1);

            await fetch(`${API_BASE}/api/foodCart/kuyteav/remove`, {
                method: "POST"
            });

            syncCart();
        }
    };

    return (
        <section id="foodPage">
            <h2>FOOD</h2>
            <div id="foodMenu">
                <div className="drinksItem">
                    <img className="foodItemImage" src="/croissant.jpg" alt="Croissant" />
                    <h3 id="drinkItemName">Croissant</h3>
                    <div className="orderingSection">
                        <button className="order-glass add" id="croissantAddBtn" onClick={addCroissant}>Add</button>
                        <button className="order-glass remove" id="croissantRemoveBtn" onClick={removeCroissant}>Remove</button>
                        <button className="order-glass quantity" id="croissantQuantity">Quantity: {croissantNum}</button>
                    </div>
                    <p>A buttery, flaky croissant baked fresh daily, offering a crisp texture and rich flavor.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="/clubSandwich.jpg" alt="Club Sandwich" />
                    <h3 id="drinkItemName">Club Sandwich</h3>
                    <div className="orderingSection">
                        <button className="order-glass add" id="clubSandwichAddBtn" onClick={addClubSandwich}>Add</button>
                        <button className="order-glass remove" id="clubSandwichRemoveBtn" onClick={removeClubSandwich}>Remove</button>
                        <button className="order-glass quantity" id="clubSandwichQuantity">Quantity: {clubSandwichNum}</button>
                    </div>
                    <p>A hearty triple-layer sandwich filled with chicken, vegetables, crispy bacon, and creamy mayo.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="/Spaghetti.png" alt="Spaghetti" />
                    <h3 id="drinkItemName">Spaghetti</h3>
                    <div className="orderingSection">
                        <button className="order-glass add" id="spaghettiAddBtn" onClick={addSpaghetti}>Add</button>
                        <button className="order-glass remove" id="spaghettiRemoveBtn" onClick={removeSpaghetti}>Remove</button>
                        <button className="order-glass quantity" id="spaghettiQuantity">Quantity: {spaghettiNum}</button>
                    </div>
                    <p>Classic spaghetti served with savory tomato sauce, herbs, and perfectly cooked pasta for comfort.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="/kuyteav.jpg" alt="Kuyteav" />
                    <h3 id="drinkItemName">Kuyteav</h3>
                    <div className="orderingSection">
                        <button className="order-glass add" id="kuyteavAddBtn" onClick={addKuyteav}>Add</button>
                        <button className="order-glass remove" id="kuyteavRemoveBtn" onClick={removeKuyteav}>Remove</button>
                        <button className="order-glass quantity" id="kuyteavQuantity">Quantity: {kuyteavNum}</button>
                    </div>
                    <p>A traditional Cambodian noodle soup with seasoned broth, rice noodles, tender meat, and fresh herbs.</p>
                </div>
            </div>
        </section>
    );
}

export default FoodPage;