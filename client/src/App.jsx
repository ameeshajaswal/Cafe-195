import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './landingPage'
import DrinkPage from './drinkPage'
import FoodPage from './foodPage'
import Cart from './cart'
import Login from './login'
import Signup from './signup'

function App() {

  // Reset API cart when the user closes or refreshes the website
  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon("http://localhost:5000/api/drinkCart/reset");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);


  useEffect(() => {
    const handleUnload = () => {
      navigator.sendBeacon("http://localhost:5000/api/foodCart/reset");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <LandingPage />
            <DrinkPage />
            <FoodPage />
            <Cart />
          </>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
