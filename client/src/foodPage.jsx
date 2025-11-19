import React, { useState } from "react";
import 'primeicons/primeicons.css';

function foodPage() {

    const [croissantNum, setCroissantNum] = useState(0);
    const [clubSandwichNum, setClubSandwichNum] = useState(0);
    const [spaghettiNum, setSpaghettiNum] = useState(0);
    const [kuyteavNum, setKuyteavNum] = useState(0);

    const addCroissant = () => {
        setCroissantNum(croissantNum + 1);
    };

    const removeCroissant = () => {
        if (croissantNum > 0) {
            setCroissantNum(croissantNum - 1);
        }
    };

    const addClubSandwich = () => {
        setClubSandwichNum(clubSandwichNum + 1);
    };

    const removeClubSandwich = () => {
        if (clubSandwichNum > 0) {
            setClubSandwichNum(clubSandwichNum - 1);
        }
    };

    const addSpaghetti = () => {
        setSpaghettiNum(spaghettiNum + 1);
    };

    const removeSpaghetti = () => {
        if (spaghettiNum > 0) {
            setSpaghettiNum(spaghettiNum - 1);
        }
    };

    const addKuyteav = () => {
        setKuyteavNum(kuyteavNum + 1);
    };

    const removeKuyteav = () => {
        if (kuyteavNum > 0) {
            setKuyteavNum(kuyteavNum - 1);
        }
    };

    return (
        <section id="foodPage">
            <h2>FOOD</h2>
            <div id="foodMenu">

                <div className="drinksItem">
                    <img className="foodItemImage" src="../public/croissant.jpg" alt="" /> 
                    <h3 id="drinkItemName">Croissant</h3>
                    <div className="orderingSection">
                        <button id="croissantAddBtn" onClick={addCroissant}>Add</button>
                        <button id="croissantRemoveBtn" onClick={removeCroissant}>Remove</button>
                        <button id="croissantQuantity">Quantity: {croissantNum}</button>
                    </div>
                    <p>A buttery, flaky croissant baked fresh daily, offering a crisp texture and rich flavor.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="../public/clubsandwich.jpg" alt="" /> 
                    <h3 id="drinkItemName">Club Sandwich</h3>
                    <div className="orderingSection">
                        <button id="clubSandwichAddBtn" onClick={addClubSandwich}>Add</button>
                        <button id="clubSandwichRemoveBtn" onClick={removeClubSandwich}>Remove</button>
                        <button id="clubSandwichQuantity">Quantity: {clubSandwichNum}</button>
                    </div>
                    <p>A hearty triple-layer sandwich filled with chicken, vegetables, crispy bacon, and creamy mayo.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="../public/spegattiSeafood.png" alt="" /> 
                    <h3 id="drinkItemName">Spaghetti</h3>
                    <div className="orderingSection">
                        <button id="spaghettiAddBtn" onClick={addSpaghetti}>Add</button>
                        <button id="spaghettiRemoveBtn" onClick={removeSpaghetti}>Remove</button> 
                        <button id="spaghettiQuantity">Quantity: {spaghettiNum}</button>
                    </div>
                    <p>Classic spaghetti served with savory tomato sauce, herbs, and perfectly cooked pasta for comfort.</p>
                </div>

                <div className="drinksItem">
                    <img className="foodItemImage" src="../public/kuyteav.jpg" alt="" />
                    <h3 id="drinkItemName">Kuyteav</h3>
                    <div className="orderingSection">
                        <button id="kuyteavAddBtn" onClick={addKuyteav}>Add</button>
                        <button id="kuyteavRemoveBtn" onClick={removeKuyteav}>Remove</button>
                        <button id="kuyteavQuantity">Quantity: {kuyteavNum}</button>
                    </div>
                    <p>A traditional Cambodian noodle soup with seasoned broth, rice noodles, tender meat, and fresh herbs.</p>
                </div>

            </div>
        </section>
    );
}

export default foodPage;
