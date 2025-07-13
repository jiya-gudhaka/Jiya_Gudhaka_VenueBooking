"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { venueAPI } from "../services/api"

const VenueList = () => {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCapacity, setFilterCapacity] = useState("")

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      const data = await venueAPI.getAll()
      setVenues(data)
    } catch (err) {
      setError("Failed to fetch venues")
      console.error("Error fetching venues:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCapacity = !filterCapacity || venue.capacity >= Number.parseInt(filterCapacity)
    return matchesSearch && matchesCapacity
  })

  if (loading) {
    return (
      <motion.div className="loading-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="loading-spinner"></div>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          Loading venues...
        </motion.p>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        className="error-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="error-message">{error}</p>
        <motion.button
          onClick={fetchVenues}
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="venue-list-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="venue-list-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1>Available Venues</h1>
        <p>Find the perfect venue for your event</p>
      </motion.div>

      <motion.div
        className="filters"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="search-box">
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
                fontSize: "1.25rem",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search venues by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </div>

        <div className="filter-box">
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-secondary)",
                fontSize: "1.25rem",
              }}
            >
              ⚙️
            </span>
            <select
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              className="filter-select"
              style={{ paddingLeft: "3rem" }}
            >
              <option value="">Any Capacity</option>
              <option value="50">50+ guests</option>
              <option value="100">100+ guests</option>
              <option value="150">150+ guests</option>
              <option value="200">200+ guests</option>
            </select>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredVenues.length === 0 ? (
          <motion.div
            className="no-venues"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <p>No venues found matching your criteria.</p>
          </motion.div>
        ) : (
          <motion.div
            className="venue-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredVenues.map((venue, index) => (
              <motion.div
                key={venue._id}
                className="venue-card glass-hover"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 },
                }}
              >
                <div className="venue-image">
                  <img
                    src={
                      venue.images[0] ||
                      "https://images.unsplash.com/photo-1519167758481-83f29c8a4e0a?w=400&h=250&fit=crop" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={venue.name}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1519167758481-83f29c8a4e0a?w=400&h=250&fit=crop"
                    }}
                  />
                </div>

                <div className="venue-info">
                  <h3 className="venue-name">{venue.name}</h3>
                  <p className="venue-location">📍 {venue.location}</p>
                  <p className="venue-description">{venue.description}</p>

                  <div className="venue-details">
                    <span className="capacity">👥 {venue.capacity} guests</span>
                    <span className="price">💰 ${venue.pricePerDay}/day</span>
                  </div>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <motion.div
                      className="amenities"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <motion.span
                          key={index}
                          className="amenity-tag"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          {amenity}
                        </motion.span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <motion.span
                          className="amenity-tag"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          +{venue.amenities.length - 3} more
                        </motion.span>
                      )}
                    </motion.div>
                  )}

                  <div className="venue-actions">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to={`/venues/${venue._id}`} className="btn btn-secondary">
                        👁️ View Details
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to={`/BookingForm/${venue._id}`} className="btn btn-primary">
                        📅 Book Now
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default VenueList
