"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { venueAPI } from "../services/api"

const VenueDetails = () => {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [availability, setAvailability] = useState(null)

  useEffect(() => {
    fetchVenueDetails()
    checkAvailability()
  }, [id])

  const fetchVenueDetails = async () => {
    try {
      setLoading(true)
      const data = await venueAPI.getById(id)
      setVenue(data)
    } catch (err) {
      setError("Failed to fetch venue details")
      console.error("Error fetching venue:", err)
    } finally {
      setLoading(false)
    }
  }

  const checkAvailability = async () => {
    try {
      const startDate = new Date().toISOString().split("T")[0]
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      const availabilityData = await venueAPI.checkAvailability(id, startDate, endDate)
      setAvailability(availabilityData)
    } catch (err) {
      console.error("Error checking availability:", err)
    }
  }

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes("wifi") || amenityLower.includes("internet")) return "📶"
    if (amenityLower.includes("parking") || amenityLower.includes("car")) return "🚗"
    if (amenityLower.includes("coffee") || amenityLower.includes("catering")) return "☕"
    if (amenityLower.includes("audio") || amenityLower.includes("music") || amenityLower.includes("sound")) return "🎵"
    return "✅"
  }

  if (loading) {
    return (
      <motion.div className="loading-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="loading-spinner"></div>
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          Loading venue details...
        </motion.p>
      </motion.div>
    )
  }

  if (error || !venue) {
    return (
      <motion.div
        className="error-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="error-message">{error || "Venue not found"}</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/" className="btn btn-primary">
            ← Back to Venues
          </Link>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="venue-details-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      <motion.div
        className="venue-details-header"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "2rem" }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="back-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "1.1rem",
            }}
          >
            ← Back to Venues
          </Link>
        </motion.div>
      </motion.div>

      <div
        className="venue-details-content"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        <motion.div
          className="venue-images"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ position: "sticky", top: "2rem" }}
        >
          <motion.img
            src={venue.images[0] || "https://images.unsplash.com/photo-1519167758481-83f29c8a4e0a?w=600&h=400&fit=crop"}
            alt={venue.name}
            className="main-image glass"
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "25px",
              border: "1px solid var(--glass-border)",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1519167758481-83f29c8a4e0a?w=600&h=400&fit=crop"
            }}
          />
        </motion.div>

        <motion.div
          className="venue-info-detailed"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ padding: "1rem 0" }}
        >
          <motion.h1
            className="venue-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              color: "var(--text-primary)",
              fontFamily: "'Playfair Display', serif",
              fontWeight: "700",
            }}
          >
            {venue.name}
          </motion.h1>

          <motion.p
            className="venue-location-detailed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.2rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: "500",
            }}
          >
            📍{venue.location}
          </motion.p>

          <motion.div
            className="venue-stats glass"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "2rem",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <div className="stat" style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                👥 Capacity
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "var(--primary)",
                }}
              >
                {venue.capacity} guests
              </div>
            </div>
            <div className="stat" style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.95rem",
                }}
              >
                💰 Price
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "var(--accent-rose)",
                }}
              >
                ${venue.pricePerDay}/day
              </div>
            </div>
          </motion.div>

          <motion.div
            className="venue-description-detailed glass"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              marginBottom: "2rem",
              padding: "2rem",
              borderRadius: "20px",
              border: "1px solid var(--glass-border)",
            }}
          >
            <h3
              style={{
                marginBottom: "1rem",
                color: "var(--text-primary)",
                fontSize: "1.5rem",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              About This Venue
            </h3>
            <p
              style={{
                lineHeight: "1.7",
                color: "var(--text-secondary)",
                fontSize: "1.05rem",
              }}
            >
              {venue.description}
            </p>
          </motion.div>

          {venue.amenities && venue.amenities.length > 0 && (
            <motion.div
              className="amenities-detailed glass"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              style={{
                marginBottom: "2rem",
                padding: "2rem",
                borderRadius: "20px",
                border: "1px solid var(--glass-border)",
              }}
            >
              <h3
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--text-primary)",
                  fontSize: "1.5rem",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Amenities
              </h3>
              <div
                className="amenities-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                {venue.amenities.map((amenity, index) => (
                  <motion.div
                    key={index}
                    className="amenity-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      background: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "12px",
                      color: "#059669",
                      fontWeight: "500",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    {getAmenityIcon(amenity)} {amenity}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {availability && (
            <motion.div
              className="availability-info glass"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              style={{
                marginBottom: "2rem",
                padding: "2rem",
                borderRadius: "20px",
                border: "1px solid var(--glass-border)",
              }}
            >
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "var(--text-primary)",
                  fontSize: "1.5rem",
                  fontFamily: "'Playfair Display', serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                📅 Availability (Next 30 Days)
              </h3>
              {availability.totalUnavailable.length > 0 ? (
                <div className="unavailable-dates">
                  <p style={{ marginBottom: "1rem", color: "var(--text-secondary)" }}>Unavailable dates:</p>
                  <div
                    className="date-list"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    {availability.totalUnavailable.slice(0, 5).map((date, index) => (
                      <motion.span
                        key={index}
                        className="unavailable-date"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        style={{
                          background: "rgba(239, 71, 111, 0.1)",
                          color: "var(--accent-rose)",
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          border: "1px solid rgba(239, 71, 111, 0.2)",
                        }}
                      >
                        {new Date(date).toLocaleDateString()}
                      </motion.span>
                    ))}
                    {availability.totalUnavailable.length > 5 && (
                      <motion.span
                        className="more-dates"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.7 }}
                        style={{
                          background: "var(--glass-white)",
                          color: "var(--text-secondary)",
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          border: "1px solid var(--glass-border)",
                        }}
                      >
                        +{availability.totalUnavailable.length - 5} more
                      </motion.span>
                    )}
                  </div>
                </div>
              ) : (
                <motion.p
                  className="available-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  style={{
                    color: "#059669",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  ✅ Available for the next 30 days
                </motion.p>
              )}
            </motion.div>
          )}

          <motion.div
            className="booking-actions"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={{ marginTop: "2rem" }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/book/${venue._id}`}
                className="btn btn-primary btn-large"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  padding: "1.25rem 2rem",
                }}
              >
                📅 Book This Venue
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default VenueDetails
