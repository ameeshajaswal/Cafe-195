import React, { useState, useEffect } from "react";

function Cart(){
    
    const [drinkList, setDrinkList] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const nameMapDrink = {
        icedLatte: "Iced Latte",
        icedChocolate: "Iced Chocolate",
        icedCappuccino: "Iced Cappuccino",
        strawberrySmoothie: "Smoothie"
    };

    const nameMapFood = {
        croissant: "Croissant",
        clubSandwich: "Club Sandwich",
        spaghetti: "Spaghetti",
        kuyteav: "Kuyteav"
    }

    const drinkPrices = {
        icedLatte: 4.25,
        icedChocolate: 4.25,
        icedCappuccino: 4.25,
        strawberrySmoothie: 4.25
    };

    const foodPrices = {
        croissant: 12.25,
        clubSandwich: 12.25,
        spaghetti: 12.25,
        kuyteav: 12.25
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:5000/api/drinkCart")
                .then(res => res.json())
                .then(data => {
                    const arr = Object.entries(data)
                        .filter(([key, qty]) => qty > 0)
                        .map(([key, qty]) => [nameMapDrink[key], `-${qty}-`, `Price: $${(qty * drinkPrices[key]).toFixed(2)}`]);
                    setDrinkList(arr);
                })
                .catch(err => console.log(err));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:5000/api/foodCart")
                .then(res => res.json())
                .then(data => {
                    const arr = Object.entries(data)
                        .filter(([key, qty]) => qty > 0)
                        .map(([key, qty]) => [nameMapFood[key], `-${qty}-`, `Price: $${(qty * foodPrices[key]).toFixed(2)}`]);
                    setFoodList(arr);
                })
                .catch(err => console.log(err));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const total = drinkList.reduce((acc, [, , price]) => {
            const amount = parseFloat(price.replace('Price: $', ''));
            return acc + amount;
        }, 0) + foodList.reduce((acc, [, , price]) => {
            const amount = parseFloat(price.replace('Price: $', ''));
            return acc + amount;
        }, 0);
        setTotalPrice(total.toFixed(2));
    }, [drinkList, foodList]);

    return(
        <section id="cartPage">
            <div id="checkOutContainer">
                <h2>CHECK OUT</h2>
                <div id="checkOutSection">
                    <h3>DRINKS</h3>
                    <div id="drinkCheckOut">
                        {drinkList.map(([name, qty, price]) => (
                            <div key={name} className="cartItem">
                                <span>{name}</span>
                                <span>{qty}</span>
                                <span>{price}</span>
                            </div>
                        ))}
                    </div>

                    <h3>FOOD</h3>
                    <div id="foodCheckOut">
                        {foodList.map(([name, qty, price]) => (
                            <div key={name} className="cartItem">
                                <span>{name}</span>
                                <span>{qty}</span>
                                <span>{price}</span>
                            </div>
                        ))}
                    </div>
                    <h4>Total: ${totalPrice}</h4>
                </div>
                
                <button id="checkOutOrderBtn">ORDER</button>
                
            </div>
        </section>
    )
}

export default Cart;