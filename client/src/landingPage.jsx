import React, { useState } from "react";
import { Link } from "react-router-dom";



function LandingPage() {



    return (
        <header>
            <video autoPlay muted loop id="backgroundVideo">
                <source src="../public/landingPageVideo.mp4" type="video/mp4" />
            </video>
            <nav>
                <a href="#header">HOME</a>
                <a href="#drinkPage">DRINKS</a>
                <a href="#foodPage">FOODS</a>
                <a href="#cartPage">CART</a>
                <a href="">CONTACT</a>
            </nav>
            <div id="userInformationSectionLandingPage">

                <Link to="/signup">SIGN UP</Link>
                <Link to="/login">LOGIN</Link>
            </div>
            <div id="landPageMainDisplay">
                <div id="introductionContainer">
                    <h1>195°F</h1>
                    <div id="designLineLandingPage"></div>
                    <p>Perfect Shot</p>
                    <button id="startOrderingBtn">Start Ordering</button>
                </div>
            </div>

        </header>
    )
}

export default LandingPage;
