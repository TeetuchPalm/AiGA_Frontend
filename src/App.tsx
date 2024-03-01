import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Link, Navigate, Route } from 'react-router-dom'
import NavBar from './components/navbar/navbar'
import './App.css'
import Router from './Router'

function App() {


  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter basename={'/'}>
        <NavBar />
        <Router />
      </BrowserRouter>
    </>
  )
}

export default App
