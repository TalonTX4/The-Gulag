import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import "./App.css"

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
)

export default App
