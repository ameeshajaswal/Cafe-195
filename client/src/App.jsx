import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './landingPage'
import DrinkPage from './drinkPage'
import FoodPage from './foodPage'
import Cart from './cart'
import Login from './login'
import Signup from './signup'
import Admin from './Admin'
import Customer from './Customer'

const INITIAL_DRINK_CART = {
  icedLatte: 0,
  icedChocolate: 0,
  icedCappuccino: 0,
  strawberrySmoothie: 0,
}

const INITIAL_FOOD_CART = {
  croissant: 0,
  clubSandwich: 0,
  spaghetti: 0,
  kuyteav: 0,
}

function App() {
  const [drinkCart, setDrinkCart] = useState(INITIAL_DRINK_CART)
  const [foodCart, setFoodCart] = useState(INITIAL_FOOD_CART)

  const changeQuantity = (setCart, productId, amount) => {
    setCart((currentCart) => {
      if (!Object.prototype.hasOwnProperty.call(currentCart, productId)) {
        return currentCart
      }

      return {
        ...currentCart,
        [productId]: Math.max(0, currentCart[productId] + amount),
      }
    })
  }

  const resetCart = () => {
    setDrinkCart({ ...INITIAL_DRINK_CART })
    setFoodCart({ ...INITIAL_FOOD_CART })
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <LandingPage />
            <DrinkPage
              cart={drinkCart}
              changeQuantity={(productId, amount) =>
                changeQuantity(setDrinkCart, productId, amount)
              }
            />
            <FoodPage
              cart={foodCart}
              changeQuantity={(productId, amount) =>
                changeQuantity(setFoodCart, productId, amount)
              }
            />
            <Cart
              drinkCart={drinkCart}
              foodCart={foodCart}
              resetCart={resetCart}
            />
          </>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/customer" element={<Customer />} />
    </Routes>
  )
}

export default App
