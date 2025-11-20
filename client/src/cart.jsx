import React, { useState } from "react";

function Cart(){

    



    return(
        <section id="cartPage">

            <div id="checkOutContainer">
                <h2>CHECK OUT</h2>
                <div id="checkOutSection">
                    <h3>DRINKS</h3>
                    <div id="drinkCheckOut">

                    </div>

                    <h3>FOOD</h3>
                    <div id="foodCheckOut">


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