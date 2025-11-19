import React from "react";
import 'primeicons/primeicons.css';
        

function drinkPage(){
    return(
        <section id="drinkPage">
            <h2>DRINKS</h2>
            <div id="drinksMenu"> 
                <div className="drinksItem">
                    <img src="../public/coffee pic 2.png" alt="" />
                    <h3 id="drinkItemName">Iced Latte</h3> 
                    <div className="orderingSection">
                        <button id="icedLatteAddBtn">Add</button>
                        <button id="icedLatteRemoveBtn">Remove</button>
                        <button id="icedLatteQuantity">Quantity: 1</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="../public/chocolate drink.png" alt="" />
                    <h3 id="drinkItemName">Iced Chocolate</h3> 
                    <div className="orderingSection">
                        <button id="icedChocolateAddBtn">Add</button>
                        <button id="icedChocolateRemoveBtn">Remove</button>
                        <button id="icedChocolateQuantity">Quantity: 1</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="../public/coffee pic 2.png" alt="" />
                    <h3 id="drinkItemName">Iced Cappuccino</h3> 
                    <div className="orderingSection">
                        <button id="iceLatteAddBtn">Add</button>
                        <button id="iceLatteRemoveBtn">Remove</button>
                        <button id="iceLatteQuantity">Quantity: 1</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="../public/coffee pic 2.png" alt="" />
                    <h3 id="drinkItemName">Iced Latte</h3> 
                    <div className="orderingSection">
                        <button id="iceLatteAddBtn">Add</button>
                        <button id="iceLatteRemoveBtn">Remove</button>
                        <button id="iceLatteQuantity">Quantity: 1</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>

                



            </div>

        </section>

    )
}

export default drinkPage;