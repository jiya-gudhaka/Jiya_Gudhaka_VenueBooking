"use client"

import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const Navbar = ({ userRole, setUserRole }) => {
  const location = useLocation()

  const toggleRole = () => {
    setUserRole(userRole === "user" ? "admin" : "user")
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="nav-container">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="nav-logo">
            🏢 VenueBook
          </Link>
        </motion.div>

        <div className="nav-menu">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/VenueList" className={`nav-link ${location.pathname === "/VenueList" ? "active" : ""}`}>
              Browse Venues
            </Link>
          </motion.div>

          {userRole === "admin" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/admin" className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}>
                Admin Dashboard
              </Link>
            </motion.div>
          )}

          <motion.button
            onClick={toggleRole}
            className={`role-toggle ${userRole}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {userRole === "user" ? "👤 User" : "🛡️ Admin"}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
