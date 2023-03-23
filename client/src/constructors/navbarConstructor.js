import config from "config"
import { Link } from "react-router-dom"
import React from "react"

function navbarConstructor(category) {
  return config.navItems[category].map((item, index) => {
    return (
      <li key={index}>
        <Link to={item.linksTo}>
          <i className={item.icon}></i>
          <span className="hide-sm"> {item.text}</span>
        </Link>
      </li>
    )
  })
}

export default navbarConstructor()
