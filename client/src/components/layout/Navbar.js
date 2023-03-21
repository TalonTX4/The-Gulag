import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { logout } from "../../actions/auth"

const Navbar = ({ auth: { isAuthenticated }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fa-solid fa-book" />{" "}
          <span className="hide-sm">Personnel File </span>
        </Link>
      </li>
      <li>
        <a onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm"> Logout</span>
        </a>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          <i className="fa-solid fa-person-military-rifle"></i>
          <span className="hide-sm"> Convicts</span>
        </Link>
      </li>
      <li>
        <Link to="/register">
          <i className="fa-solid fa-user-plus"></i>
          <span className="hide-sm"> Register</span>
        </Link>
      </li>
      <li>
        <Link to="/login">
          <i className="fa-solid fa-right-to-bracket"></i>
          <span className="hide-sm"> Login</span>
        </Link>
      </li>
    </ul>
  )

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
