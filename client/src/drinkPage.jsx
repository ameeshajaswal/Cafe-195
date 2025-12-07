import React, { useState } from "react";
import 'primeicons/primeicons.css';
import { API_BASE } from "./config";  // Added import

function DrinkPage() {
    const [icedLatteNum, setIcedLatteNum] = useState(0);
    const [icedChocolateNum, setIcedChocolateNum] = useState(0);
    const [icedCappuccinoNum, setIcedCappucinoNum] = useState(0);
    const [strawberrySmoothieNum, setstrawberrySmoothieNum] = useState(0);

    const syncCart = async () => {
        const res = await fetch(`${API_BASE}/api/drinkCart`);  // Fixed
        const data = await res.json();

        setIcedLatteNum(data.icedLatte);
        setIcedChocolateNum(data.icedChocolate);
        setIcedCappucinoNum(data.icedCappuccino);
        setstrawberrySmoothieNum(data.strawberrySmoothie);
    };

    const addIceLatte = async () => {
        setIcedLatteNum(icedLatteNum + 1);

        await fetch(`${API_BASE}/api/drinkCart/icedLatte/add`, {  // Fixed
            method: "POST"
        });

        syncCart();
    }

    const removeIceLatte = async () => {
        if(icedLatteNum > 0) {
            setIcedLatteNum(icedLatteNum - 1);

            await fetch(`${API_BASE}/api/drinkCart/icedLatte/remove`, {  // Fixed
                method: "POST"
            });

            syncCart();
        }
    }

    const addIcedChocolate = async () => {
        setIcedChocolateNum(icedChocolateNum + 1);

        await fetch(`${API_BASE}/api/drinkCart/icedChocolate/add`, {  // Fixed
            method: "POST"
        });

        syncCart();
    }

    const removeIcedChocolate = async () => {
        if (icedChocolateNum > 0) {
            setIcedChocolateNum(icedChocolateNum - 1);

            await fetch(`${API_BASE}/api/drinkCart/icedChocolate/remove`, {  // Fixed
                method: "POST"
            });

            syncCart();
        }
    }

    const addIcedCappuccino = async () => {
        setIcedCappucinoNum(icedCappuccinoNum + 1);

        await fetch(`${API_BASE}/api/drinkCart/icedCappuccino/add`, {  // Fixed
            method: "POST"
        });

        syncCart();
    }

    const removeIcedCappuccino = async () => {
        if (icedCappuccinoNum > 0) {
            setIcedCappucinoNum(icedCappuccinoNum - 1);

            await fetch(`${API_BASE}/api/drinkCart/icedCappuccino/remove`, {  // Fixed
                method: "POST"
            });

            syncCart();
        }
    }

    const addStrawberrySmoothie = async () => {
        setstrawberrySmoothieNum(strawberrySmoothieNum + 1);

        await fetch(`${API_BASE}/api/drinkCart/strawberrySmoothie/add`, {  // Fixed
            method: "POST"
        });

        syncCart();
    }

    const removeStrawberrySmoothie = async () => {
        if (strawberrySmoothieNum > 0) {
            setstrawberrySmoothieNum(strawberrySmoothieNum - 1);

            await fetch(`${API_BASE}/api/drinkCart/strawberrySmoothie/remove`, {  // Fixed
                method: "POST"
            });

            syncCart();
        }
    }

    return(
        <section id="drinkPage">
            <h2>DRINKS</h2>
            <div id="drinksMenu"> 
                <div className="drinksItem">
                    <img src="/coffee pic 2.png" alt="Iced Latte" />  {/* Fixed image path */}
                    <h3 id="drinkItemName">Iced Latte</h3> 
                    <div className="orderingSection">
                        <button className="order-glass add" id="icedLatteAddBtn" onClick={addIceLatte}>Add</button>
                        <button className="order-glass remove" id="icedLatteRemoveBtn" onClick={removeIceLatte}>Remove</button>
                        <button className="order-glass quantity" id="icedLatteQuantity">Quantity: {icedLatteNum}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="/chocolate drink.png" alt="Iced Chocolate" />  {/* Fixed image path */}
                    <h3 id="drinkItemName">Iced Chocolate</h3> 
                    <div className="orderingSection">
                        <button className="order-glass add" id="icedChocolateAddBtn" onClick={addIcedChocolate}>Add</button>
                        <button className="order-glass remove" id="icedChocolateRemoveBtn" onClick={removeIcedChocolate}>Remove</button>
                        <button className="order-glass quantity" id="icedChocolateQuantity">Quantity: {icedChocolateNum}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="/icedCappuccino.png" alt="Iced Cappuccino" />  {/* Fixed image path */}
                    <h3 id="drinkItemName">Iced Cappuccino</h3> 
                    <div className="orderingSection">
                        <button className="order-glass add" id="iceCapuAddBtn" onClick={addIcedCappuccino}>Add</button>
                        <button className="order-glass remove" id="iceCapuRemoveBtn" onClick={removeIcedCappuccino}>Remove</button>
                        <button className="order-glass quantity" id="iceCapuQuantity">Quantity: {icedCappuccinoNum}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="/strawberrySmoothie.png" alt="Strawberry Smoothie" />  {/* Fixed image path */}
                    <h3 id="drinkItemName">Strawberry Smoothie</h3> 
                    <div className="orderingSection">
                        <button className="order-glass add" id="strawberrySmoothieAddBtn" onClick={addStrawberrySmoothie}>Add</button>
                        <button className="order-glass remove" id="strawberrySmoothieRemoveBtn" onClick={removeStrawberrySmoothie}>Remove</button>
                        <button className="order-glass quantity" id="strawberrySmoothieQuantity">Quantity: {strawberrySmoothieNum}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
            </div>
        </section>
    );
}

export default DrinkPage;