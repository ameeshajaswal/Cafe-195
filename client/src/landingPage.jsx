import React, { useState } from "react";

function LandingPage(){
    const [iceLatte, setIceLatte] = useState(0);
    const [croissant, setCroissant] = useState(0);
    const iceLattePrice = 4.25;
    const croissantPrice = 5;

    function addCroissant(){
        setCroissant(croissant + 1);
    }

    function removeCroissant(){
        if(croissant > 0){
            setCroissant(croissant - 1);
        }
    }

    function addIceLatte(){
        setIceLatte(iceLatte + 1);
    }

    function removeIceLatte(){
        if(iceLatte > 0){
            setIceLatte(iceLatte - 1);
        }
    }

    function submitOrder(){

        if(croissant == 0 && iceLatte == 0){
            window.alert('Please select an item before ordering');
        }
        else{
            window.alert("Order submitted");
            window.location.reload();
        }
    }

    return(
        <header>
            <div>
                <h1>Welcome to Cafe 195</h1>
                <img src="../public/logo.png" alt="" style={{width: 100}}/>

                <label style={{display: 'block'}} htmlFor="">Ice latte</label>
                <button onClick={addIceLatte}>Add</button>
                <button onClick={removeIceLatte}>Remove</button>

                <p>Drinks: Ice Latte - {iceLatte} - ${(iceLatte * iceLattePrice).toFixed(2)}</p>


                <label style={{display: 'block'}} htmlFor="">Croissant</label>
                <button onClick={addCroissant}>Add</button>
                <button onClick={removeCroissant}>Remove</button>

                <p>Food: Croissant - {croissant} - ${(croissant * croissantPrice).toFixed(2)}</p>



                

                <button onClick={submitOrder}>Order Now</button>
            </div>
        </header>
    )
}

export default LandingPage;