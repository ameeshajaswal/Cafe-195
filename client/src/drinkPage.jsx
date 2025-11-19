import React, { useState } from "react";
import 'primeicons/primeicons.css';



        

function drinkPage(){

    const [icedLatteNum, setIcedLatteNum] = useState(0);
    const [icedChocolateNum, setIcedChocolateNum] = useState(0);
    const [icedCappuccinoNum, setIcedCappucinoNum] = useState(0);
    const [strawberrySmoothieNum, setstrawberrySmoothieNum] = useState(0);

    const addIceLatte = () =>{
        setIcedLatteNum(icedLatteNum + 1);
    }

    const removeIceLatte = () => {
        if(icedLatteNum > 0){
            setIcedLatteNum(icedLatteNum - 1);
        }
    }
    const addIcedChocolate = () => {
        setIcedChocolateNum(icedChocolateNum + 1);
    }

    const removeIcedChocolate = () => {
        if (icedChocolateNum > 0) {
            setIcedChocolateNum(icedChocolateNum - 1);
        }
    }

    const addIcedCappuccino = () => {
        setIcedCappucinoNum(icedCappuccinoNum + 1);
    }

    const removeIcedCappuccino = () => {
        if (icedCappuccinoNum > 0) {
            setIcedCappucinoNum(icedCappuccinoNum - 1);
        }
    }

    const addStrawberrySmoothie = () => {
        setstrawberrySmoothieNum(strawberrySmoothieNum + 1);
    }

    const removeStrawberrySmoothie = () => {
        if (strawberrySmoothieNum > 0) {
            setstrawberrySmoothieNum(strawberrySmoothieNum - 1);
        }
    }

    return(
        <section id="drinkPage">
            <h2>DRINKS</h2>
            <div id="drinksMenu"> 
                <div className="drinksItem">
                    <img src="../public/coffee pic 2.png" alt="" />
                    <h3 id="drinkItemName">Iced Latte</h3> 
                    <div className="orderingSection">
                        <button id="icedLatteAddBtn" onClick={addIceLatte}>Add</button>
                        <button id="icedLatteRemoveBtn" onClick={removeIceLatte}>Remove</button>
                        <button id="icedLatteQuantity">Quantity: {icedLatteNum}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="../public/chocolate drink.png" alt="" /> 
                    <h3 id="drinkItemName">Iced Chocolate</h3> 
                    <div className="orderingSection">
                        <button id="icedChocolateAddBtn" onClick={addIcedChocolate}>Add</button>
                        <button id="icedChocolateRemoveBtn" onClick={removeIcedChocolate}>Remove</button>
                        <button id="icedChocolateQuantity">Quantity: {icedChocolateNum}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="../public/icedCappuccino.png" alt="" /> 
                    <h3 id="drinkItemName">Iced Cappuccino</h3> 
                    <div className="orderingSection">
                        <button id="iceCapuAddBtn" onClick={addIcedCappuccino}>Add</button>
                        <button id="iceCapuRemoveBtn" onClick={removeIcedCappuccino}>Remove</button>
                        <button id="iceCapuQuantity">Quantity: {icedCappuccinoNum}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="../public/strawberrySmoothie.png" alt="" />
                    <h3 id="drinkItemName">Strawberry Smoothie</h3> 
                    <div className="orderingSection">
                        <button id="strawberrySmoothieAddBtn" onClick={addStrawberrySmoothie}>Add</button>
                        <button id="strawberrySmoothieRemoveBtn" onClick={removeStrawberrySmoothie}>Remove</button>
                        <button id="strawberrySmoothieQuantity">Quantity: {strawberrySmoothieNum}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>

                



            </div>

        </section>

    )
}

export default drinkPage;