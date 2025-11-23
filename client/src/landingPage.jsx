import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function LandingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [banner, setBanner] = useState(null);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const state = location?.state;
        if (!state) return;

        if (state.signupSuccess || state.loginSuccess) {
            const text = state.message
                || (state.signupSuccess ? "Account created! You can now log in."
                : "Welcome back!");
            setBanner({ type: "success", text });
        }

        // auto dismiss after 2 seconds
        const t = setTimeout(() => setBanner(null), 2000);
        return () => clearTimeout(t);
    }, [location]);

    // read auth user from localStorage so nav can reflect login state
    useEffect(() => {
        const raw = localStorage.getItem("authUser");
        setAuthUser(raw ? JSON.parse(raw) : null);
    }, [location]);

    function handleSignOut() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setAuthUser(null);
        // stay on landing page but ensure URL and state are clean
        navigate("/", { replace: true });
    }

    return (
        <header>
            {banner && (
                <div style={{ background: "#e6ffed", color: "#0a662a", padding: "10px 16px", textAlign: "center" }}>
                    {banner.text}
                </div>
            )}
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
                {authUser ? (
                    <>
                        <a href="#" onClick={(e) => { e.preventDefault(); handleSignOut(); }}>SIGN OUT</a>
                        <a href="#" style={{ textTransform: 'uppercase' }}>{authUser.name}</a>
                    </>
                ) : (
                    <>
                        <Link to="/signup">SIGN UP</Link>
                        <Link to="/login">LOGIN</Link>
                    </>
                )}
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
    );
}

export default LandingPage;
