import { useEffect } from 'react'
import './App.css'
import LandingPage from './landingPage'
import DrinkPage from './drinkPage'
import FoodPage from './foodPage'
import Cart from './cart'

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
    <>
      <LandingPage/>
      <DrinkPage/>
      <FoodPage/>
      <Cart/>
    </>
  )
}

export default App
