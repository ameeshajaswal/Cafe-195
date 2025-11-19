import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './landingPage'
import DrinkPage from './drinkPage'
import FoodPage from './foodPage'



function App() {

  return (
    <>
      <LandingPage/>
      <DrinkPage/>
      <FoodPage/>
    </>
  )
}

export default App
