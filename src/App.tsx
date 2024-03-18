import { BrowserRouter } from 'react-router-dom'
import NavBar from './components/navbar/navbar'
import './App.css'
import Router from './Router'

function App() {
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
