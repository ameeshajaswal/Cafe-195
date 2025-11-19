import React, { useState } from "react";

function LandingPage(){
    
    return(
        <header>
            <nav>
                <a href="">HOME</a>
                <a href="">DRINKS</a>
                <a href="">FOODS</a>
                <a href="">ABOUT</a>
                <a href="">CONTACT</a>
            </nav>

            <div id="userInformationSectionLandingPage">
                    <a href="">CART</a>
                    <a href="">SIGN UP</a>
                    <a href="">LOGIN</a>

                </div>

            <div id="landPageMainDisplay">
                <img src="../public/coffee.png" alt="" id="landingPageCoffeePicBack" />
                <img src="../public/coffee pic 2.png" alt=""  id="landingPageCoffeePicFront"/>
                

                <h1>195°F</h1>
                <div id="designLineLandingPage"></div>
                <p>Perfect Shot</p>

                <button id="startOrderingBtn">Start Ordering</button>

            </div>
            
        </header>
    )
}

export default LandingPage;