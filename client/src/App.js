import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Alert from "./components/layout/Alert"
// Redux
import { Provider } from "react-redux"
import store from "./store"

import "./App.css"

const App = () => (
  <Provider store={store}>
    <Router>
      <Navbar />
      <section className="container">
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </section>
    </Router>
  </Provider>
)

export default App
