import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { logout } from "../../actions/auth"
import navbarConstructor from "../../constructors/navbarConstructor"

let guestList = navbarConstructor("guest")
let authList = navbarConstructor("auth")

const Navbar = ({ auth: { isAuthenticated }, logout }) => {
  const authLinks = (
    <ul>
      {authList}
      <li>
        <Link to={"/"} onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm"> Logout</span>
        </Link>
      </li>
    </ul>
  )

  const guestLinks = <ul>{guestList}</ul>

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fa-solid fa-handcuffs"></i> The Gulag
        </Link>
      </h1>
      <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
    </nav>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { logout })(Navbar)
