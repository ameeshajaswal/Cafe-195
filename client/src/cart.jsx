import React, { useState, useEffect } from "react";

function Cart(){
    
    const [drinkList, setDrinkList] = useState([]);
    const [foodList, setFoodList] = useState([]);

    const nameMapDrink = {
        icedLatte: "Iced Latte",
        icedChocolate: "Iced Chocolate",
        icedCappuccino: "Iced Cappuccino",
        strawberrySmoothie: "Strawberry Smoothie"
    };

    const nameMapFood = {
        croissant: "Croissant",
        clubSandwich: "Club Sandwich",
        spaghetti: "Spaghetti",
        kuyteav: "Kuyteav"
    }

    // Always stay synced with API
    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:5000/api/drinkCart")
                .then(res => res.json())
                .then(data => {
                    const arr = Object.entries(data).map(([key, qty]) => {
                        if(qty > 0){
                            return [nameMapDrink[key], [' - '], qty];
                        }
                        else{
                            return [];
                        }
                        
                    });
                    setDrinkList(arr);
                })
                .catch(err => console.log(err));
        }, 1000); // 1 second refresh

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:5000/api/foodCart")
                .then(res => res.json())
                .then(data => {
                    const arr = Object.entries(data).map(([key, qty]) => {
                        if(qty > 0){
                            return [nameMapFood[key], [' - '], qty];
                        }
                        else{
                            return [];
                        }
                        
                    });
                    setFoodList(arr);
                })
                .catch(err => console.log(err));
        }, 1000); 

        return () => clearInterval(interval);
    }, []);



    return(
        <section id="cartPage">

            <div id="checkOutContainer">
                <h2>CHECK OUT</h2>
                <div id="checkOutSection">
                    <h3>DRINKS</h3>
                    <div id="drinkCheckOut">{drinkList.map(([name, space ,qty]) => (
                            <p key={name}>
                                {name} {space} {qty}
                            </p>
                        ))}

                    </div>

                    <h3>FOOD</h3>
                    <div id="foodCheckOut">{foodList.map(([name, space, qty]) =>(
                        <p key={name}>
                            {name} {space} {qty}
                        </p>
                    
                    ))}


                    </div>
                    <h4>Total: $</h4>

                </div>

                <div id="checkOutAction">
                    <button id="checkOutMoreItemBtn">MORE-ITEM</button>
                    <button id="checkOutOrderBtn">ORDER</button>

                </div>


            </div>



            
        </section>


    )
}

export default Cart;