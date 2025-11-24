import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "HOME", target: "header" },
  { label: "DRINKS", target: "drinkPage" },
  { label: "FOODS", target: "foodPage" },
  { label: "CART", target: "cartPage" },
  { label: "CONTACT", target: "contact" },
];

function Navbar() {
  const [authUser, setAuthUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminLikePage =
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/customer");

  useEffect(() => {
    const raw = localStorage.getItem("authUser");
    setAuthUser(raw ? JSON.parse(raw) : null);
  }, [location]);

  function handleSignOut(event) {
    event.preventDefault();
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setAuthUser(null);
    navigate("/", { replace: true });
  }

  function handleNavClick(target) {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: target } });
      return;
    }

    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  const content = (
    <>
      <nav>
        {navLinks.map((link) => (
          <a key={link.label} href={`/#${link.target}`} onClick={(e) => { e.preventDefault(); handleNavClick(link.target); }}>
            {link.label}
          </a>
        ))}
      </nav>
      <div id="userInformationSectionLandingPage">
        {authUser ? (
          <>
            <a href="#" onClick={handleSignOut}>
              SIGN OUT
            </a>
            <Link to={authUser.role === "admin" ? "/admin" : "/customer"} style={{ textTransform: "uppercase" }}>
              {authUser.name}
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup">SIGN UP</Link>
            <Link to="/login">LOGIN</Link>
          </>
        )}
      </div>
    </>
  );

  return isAdminLikePage ? <div className="navbar-admin-wrap">{content}</div> : content;
}

export default Navbar;
