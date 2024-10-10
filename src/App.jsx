import { BrowserRouter as Router , Routes , Route , Navigate } from 'react-router-dom'
import React, { Children } from 'react'

import Home from './pages/Home/Home'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/home" element={<PrivateRoot><Home /></PrivateRoot>} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}



const Root=() => {
  const isAuthenticted = localStorage.getItem('token')
  return isAuthenticted ? (<Navigate to={"/home"}/>): <Navigate to={"/login"} />
}

const PrivateRoot = ({children }) => {
  const isAuthenticted = localStorage.getItem('token');

  return isAuthenticted ? children  : <Navigate to={"/login"} />
}

export default App
