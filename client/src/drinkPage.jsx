import React from "react";
import 'primeicons/primeicons.css';

function DrinkPage({ cart, changeQuantity }) {
    const addIceLatte = () => {
        changeQuantity("icedLatte", 1);
    };

    const removeIceLatte = () => {
        changeQuantity("icedLatte", -1);
    };

    const addIcedChocolate = () => {
        changeQuantity("icedChocolate", 1);
    };

    const removeIcedChocolate = () => {
        changeQuantity("icedChocolate", -1);
    };

    const addIcedCappuccino = () => {
        changeQuantity("icedCappuccino", 1);
    };

    const removeIcedCappuccino = () => {
        changeQuantity("icedCappuccino", -1);
    };

    const addStrawberrySmoothie = () => {
        changeQuantity("strawberrySmoothie", 1);
    };

    const removeStrawberrySmoothie = () => {
        changeQuantity("strawberrySmoothie", -1);
    };

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
                        <button className="order-glass quantity" id="icedLatteQuantity">Quantity: {cart.icedLatte}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="/chocolate drink.png" alt="Iced Chocolate" />  {/* Fixed image path */}
                    <h3 id="drinkItemName">Iced Chocolate</h3> 
                    <div className="orderingSection">
                        <button className="order-glass add" id="icedChocolateAddBtn" onClick={addIcedChocolate}>Add</button>
                        <button className="order-glass remove" id="icedChocolateRemoveBtn" onClick={removeIcedChocolate}>Remove</button>
                        <button className="order-glass quantity" id="icedChocolateQuantity">Quantity: {cart.icedChocolate}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="/icedCappuccino.png" alt="Iced Cappuccino" />  {/* Fixed image path */}
                    <h3 id="drinkItemName">Iced Cappuccino</h3> 
                    <div className="orderingSection">
                        <button className="order-glass add" id="iceCapuAddBtn" onClick={addIcedCappuccino}>Add</button>
                        <button className="order-glass remove" id="iceCapuRemoveBtn" onClick={removeIcedCappuccino}>Remove</button>
                        <button className="order-glass quantity" id="iceCapuQuantity">Quantity: {cart.icedCappuccino}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
                <div className="drinksItem">
                    <img src="/strawberrySmoothie.png" alt="Strawberry Smoothie" />  {/* Fixed image path */}
                    <h3 id="drinkItemName">Strawberry Smoothie</h3> 
                    <div className="orderingSection">
                        <button className="order-glass add" id="strawberrySmoothieAddBtn" onClick={addStrawberrySmoothie}>Add</button>
                        <button className="order-glass remove" id="strawberrySmoothieRemoveBtn" onClick={removeStrawberrySmoothie}>Remove</button>
                        <button className="order-glass quantity" id="strawberrySmoothieQuantity">Quantity: {cart.strawberrySmoothie}</button>
                    </div>
                    <p>A refreshing iced latte made with 100% Arabica beans, blending smooth espresso and creamy milk for a naturally sweet, chilled coffee experience.</p>
                </div>
            </div>
        </section>
    );
}

export default DrinkPage;
