import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function LandingPage() {
    const location = useLocation();
    const [banner, setBanner] = useState(null);

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

    useEffect(() => {
        const target =
            location.state?.scrollTo ||
            (location.hash ? location.hash.replace("#", "") : null);
        if (!target) return;

        const t = setTimeout(() => {
            const el = document.getElementById(target);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }, 50);

        return () => clearTimeout(t);
    }, [location]);

    return (
        <header>
            {banner && (
                <div style={{ background: "#e6ffed", color: "#0a662a", padding: "10px 16px", textAlign: "center" }}>
                    {banner.text}
                </div>
            )}
            <video autoPlay muted loop id="backgroundVideo">
                <source src="/landingPageVideo.mp4" type="video/mp4" />
            </video>
            <Navbar />
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
