"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { venueAPI } from "../services/api"

const VenueManagement = ({ venues = [], onVenueUpdated }) => {
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [blockDates, setBlockDates] = useState({
    dates: "",
    reason: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  // Filter venues to only show active ones in the management list
  const activeVenues = venues.filter((venue) => venue.isActive)

  const handleBlockDates = async (e) => {
    e.preventDefault()

    if (!selectedVenue || !blockDates.dates) {
      setMessage({ type: "error", text: "Please select a venue and enter dates" })
      return
    }

    try {
      setLoading(true)
      const dates = blockDates.dates.split(",").map((date) => date.trim())

      await venueAPI.blockDates(selectedVenue._id, {
        dates,
        reason: blockDates.reason || "Blocked by admin",
      })

      setMessage({ type: "success", text: "Dates blocked successfully" })
      setBlockDates({ dates: "", reason: "" })
      onVenueUpdated() // Re-fetch data to update the list
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to block dates" })
    } finally {
      setLoading(false)
    }
  }

  const handleUnblockDates = async (venueId, date) => {
    try {
      setLoading(true)
      await venueAPI.unblockDates(venueId, { dates: [date] })
      setMessage({ type: "success", text: "Date unblocked successfully" })
      onVenueUpdated() // Re-fetch data to update the list
    } catch (error) {
      setMessage({ type: "error", text: "Failed to unblock date" })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue? This will mark it as inactive.")) {
      return
    }

    try {
      setLoading(true)
      await venueAPI.delete(venueId) // This performs a soft delete (sets isActive: false)
      setMessage({ type: "success", text: "Venue marked as inactive successfully" })
      onVenueUpdated() // Re-fetch data to update the list (it will now disappear from activeVenues)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete venue" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="venue-management"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Manage Venues
      </motion.h2>

      <AnimatePresence>
        {message && (
          <motion.div
            className={`message ${message.type}`}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {message.type === "success" ? "✅" : "❌"} {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="management-section glass"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          padding: "2rem",
          borderRadius: "25px",
          marginBottom: "2rem",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            color: "var(--text-primary)",
          }}
        >
          🔒 Block/Unblock Dates
        </h3>

        <form onSubmit={handleBlockDates} className="block-dates-form">
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="venue-select" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Select Venue
            </label>
            <select
              id="venue-select"
              value={selectedVenue?._id || ""}
              onChange={(e) => {
                const venue = venues.find((v) => v._id === e.target.value)
                setSelectedVenue(venue)
              }}
              required
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "15px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                fontSize: "1rem",
              }}
            >
              <option value="">Choose a venue...</option>
              {activeVenues.map(
                (
                  venue, // Use activeVenues here
                ) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name}
                  </option>
                ),
              )}
            </select>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="dates" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Dates to Block
            </label>
            <input
              type="text"
              id="dates"
              value={blockDates.dates}
              onChange={(e) => setBlockDates((prev) => ({ ...prev, dates: e.target.value }))}
              placeholder="YYYY-MM-DD, YYYY-MM-DD (comma-separated)"
              required
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "15px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                fontSize: "1rem",
              }}
            />
            <small className="form-help" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Enter dates in YYYY-MM-DD format, separated by commas
            </small>
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="reason" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Reason (Optional)
            </label>
            <input
              type="text"
              id="reason"
              value={blockDates.reason}
              onChange={(e) => setBlockDates((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Reason for blocking dates"
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "15px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                fontSize: "1rem",
              }}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            🔒{loading ? "Blocking..." : "Block Dates"}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        className="venues-list glass"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          padding: "2rem",
          borderRadius: "25px",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            fontSize: "1.5rem",
            color: "var(--text-primary)",
          }}
        >
          📅 All Active Venues
        </h3>

        <div
          className="venues-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {activeVenues.length === 0 ? (
            <motion.div
              className="no-venues"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-secondary)",
                fontSize: "1rem",
                gridColumn: "1 / -1", // Span across all columns
              }}
            >
              <p>No active venues found. Add a new venue or check if any were marked inactive.</p>
            </motion.div>
          ) : (
            activeVenues.map((venue, index) => (
              <motion.div
                key={venue._id}
                className="venue-management-card glass"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{
                  padding: "1.5rem",
                  borderRadius: "20px",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div
                  className="venue-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h4 style={{ color: "var(--text-primary)", fontSize: "1.25rem", fontWeight: "600" }}>{venue.name}</h4>
                  <motion.button
                    onClick={() => handleDeleteVenue(venue._id)}
                    className="btn btn-danger btn-small"
                    disabled={loading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    🗑️ Delete
                  </motion.button>
                </div>

                <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p className="venue-location" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    📍{venue.location}
                  </p>
                  <p className="venue-capacity" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    👥{venue.capacity} guests
                  </p>
                  <p className="venue-price" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    💰${venue.pricePerDay}/day
                  </p>
                </div>

                {venue.unavailableDates && venue.unavailableDates.length > 0 && (
                  <motion.div
                    className="blocked-dates"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--glass-border)",
                    }}
                  >
                    <h5
                      style={{
                        marginBottom: "0.75rem",
                        color: "var(--text-primary)",
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      ⚠️ Blocked Dates:
                    </h5>
                    <div
                      className="dates-list"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {venue.unavailableDates.map((unavailableDate, index) => (
                        <motion.div
                          key={index}
                          className="blocked-date"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.75rem",
                            background: "rgba(239, 71, 111, 0.1)",
                            borderRadius: "10px",
                            border: "1px solid rgba(239, 71, 111, 0.2)",
                          }}
                        >
                          <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                            {new Date(unavailableDate.date).toLocaleDateString()}
                          </span>
                          <motion.button
                            onClick={() => handleUnblockDates(venue._id, unavailableDate.date)}
                            className="btn btn-small btn-secondary"
                            disabled={loading}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            🔓 Unblock
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VenueManagement
