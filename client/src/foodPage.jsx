import React from "react";
import 'primeicons/primeicons.css';

function FoodPage({ cart, changeQuantity }) {
    const addCroissant = () => {
        changeQuantity("croissant", 1);
    };

    const removeCroissant = () => {
        changeQuantity("croissant", -1);
    };

    const addClubSandwich = () => {
        changeQuantity("clubSandwich", 1);
    };

    const removeClubSandwich = () => {
        changeQuantity("clubSandwich", -1);
    };

    const addSpaghetti = () => {
        changeQuantity("spaghetti", 1);
    };

    const removeSpaghetti = () => {
        changeQuantity("spaghetti", -1);
    };

    const addKuyteav = () => {
        changeQuantity("kuyteav", 1);
    };

    const removeKuyteav = () => {
        changeQuantity("kuyteav", -1);
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
                        <button className="order-glass quantity" id="croissantQuantity">Quantity: {cart.croissant}</button>
                    </div>
                    <p>A buttery, flaky croissant baked fresh daily, offering a crisp texture and rich flavor.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="/clubSandwich.jpg" alt="Club Sandwich" />
                    <h3 id="drinkItemName">Club Sandwich</h3>
                    <div className="orderingSection">
                        <button className="order-glass add" id="clubSandwichAddBtn" onClick={addClubSandwich}>Add</button>
                        <button className="order-glass remove" id="clubSandwichRemoveBtn" onClick={removeClubSandwich}>Remove</button>
                        <button className="order-glass quantity" id="clubSandwichQuantity">Quantity: {cart.clubSandwich}</button>
                    </div>
                    <p>A hearty triple-layer sandwich filled with chicken, vegetables, crispy bacon, and creamy mayo.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="/Spaghetti.png" alt="Spaghetti" />
                    <h3 id="drinkItemName">Spaghetti</h3>
                    <div className="orderingSection">
                        <button className="order-glass add" id="spaghettiAddBtn" onClick={addSpaghetti}>Add</button>
                        <button className="order-glass remove" id="spaghettiRemoveBtn" onClick={removeSpaghetti}>Remove</button>
                        <button className="order-glass quantity" id="spaghettiQuantity">Quantity: {cart.spaghetti}</button>
                    </div>
                    <p>Classic spaghetti served with savory tomato sauce, herbs, and perfectly cooked pasta for comfort.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="/kuyteav.jpg" alt="Kuyteav" />
                    <h3 id="drinkItemName">Kuyteav</h3>
                    <div className="orderingSection">
                        <button className="order-glass add" id="kuyteavAddBtn" onClick={addKuyteav}>Add</button>
                        <button className="order-glass remove" id="kuyteavRemoveBtn" onClick={removeKuyteav}>Remove</button>
                        <button className="order-glass quantity" id="kuyteavQuantity">Quantity: {cart.kuyteav}</button>
                    </div>
                    <p>A traditional Cambodian noodle soup with seasoned broth, rice noodles, tender meat, and fresh herbs.</p>
                </div>
            </div>
        </section>
    );
}

export default FoodPage;
