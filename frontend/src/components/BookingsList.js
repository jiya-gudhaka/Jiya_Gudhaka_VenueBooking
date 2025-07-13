"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { bookingAPI } from "../services/api"

const BookingsList = ({ bookings = [], venues = [], onBookingUpdated }) => {
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status === filter
  })

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setLoading(true)
      await bookingAPI.update(bookingId, { status: newStatus })
      setMessage({ type: "success", text: "Booking status updated successfully" })
      onBookingUpdated()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update booking status" })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      setLoading(true)
      await bookingAPI.delete(bookingId)
      setMessage({ type: "success", text: "Booking cancelled successfully" })
      onBookingUpdated()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to cancel booking" })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return `✅`
      case "cancelled":
        return `❌`
      case "pending":
        return `⏰`
      default:
        return `⏰`
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#10b981"
      case "cancelled":
        return "#ef4444"
      case "pending":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  return (
    <motion.div
      className="bookings-list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bookings-header glass"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: "2rem",
          borderRadius: "25px",
          marginBottom: "2rem",
          border: "1px solid var(--glass-border)",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            marginBottom: "1.5rem",
            background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          📅 Bookings Management
        </h2>

        <div
          className="bookings-filters"
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { key: "all", label: "All", count: bookings.length, icon: `🔽` },
            {
              key: "confirmed",
              label: "Confirmed",
              count: bookings.filter((b) => b.status === "confirmed").length,
              icon: `✅`,
            },
            {
              key: "pending",
              label: "Pending",
              count: bookings.filter((b) => b.status === "pending").length,
              icon: `⏰`,
            },
            {
              key: "cancelled",
              label: "Cancelled",
              count: bookings.filter((b) => b.status === "cancelled").length,
              icon: `❌`,
            },
          ].map((filterOption, index) => (
            <motion.button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`filter-btn ${filter === filterOption.key ? "active" : ""}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "50px",
                border: filter === filterOption.key ? "2px solid var(--primary)" : "1px solid var(--glass-border)",
                background: filter === filterOption.key ? "var(--primary)" : "var(--glass-white)",
                color: filter === filterOption.key ? "white" : "var(--text-primary)",
                backdropFilter: "blur(10px)",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}
            >
              {filterOption.icon}
              {filterOption.label} ({filterOption.count})
            </motion.button>
          ))}
        </div>
      </motion.div>

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
        className="bookings-table glass"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          borderRadius: "25px",
          overflow: "hidden",
          border: "1px solid var(--glass-border)",
        }}
      >
        {filteredBookings.length === 0 ? (
          <motion.div
            className="no-bookings"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              padding: "4rem",
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
            }}
          >
            📅 <span style={{ display: "block", marginTop: "1rem" }}>No bookings found for the selected filter.</span>
          </motion.div>
        ) : (
          <div className="table-container" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                  {["Customer", "Venue", "Date", "Event Type", "Guests", "Amount", "Status", "Actions"].map(
                    (header, index) => (
                      <motion.th
                        key={header}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        style={{
                          padding: "1.5rem 1rem",
                          textAlign: "left",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          fontSize: "0.95rem",
                        }}
                      >
                        {header}
                      </motion.th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    style={{
                      borderBottom: "1px solid var(--glass-border)",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <div className="customer-info">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                          👤<strong style={{ color: "var(--text-primary)" }}>{booking.customerName}</strong>
                        </div>
                        <div
                          className="customer-contact"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.125rem",
                            marginLeft: "1.5rem",
                          }}
                        >
                          <small style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                            {booking.customerEmail}
                          </small>
                          <small style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                            {booking.customerPhone}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        📍
                        <span style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                          {booking.venue?.name || "Unknown Venue"}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "1.5rem 1rem", color: "var(--text-primary)", fontWeight: "500" }}>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1.5rem 1rem", color: "var(--text-primary)" }}>{booking.eventType}</td>
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        👥<span style={{ color: "var(--text-primary)", fontWeight: "500" }}>{booking.guestCount}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        💰
                        <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>${booking.totalAmount}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <motion.span
                        className={`status-badge ${booking.status}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          textTransform: "capitalize",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          background: `${getStatusColor(booking.status)}20`,
                          color: getStatusColor(booking.status),
                          border: `1px solid ${getStatusColor(booking.status)}40`,
                        }}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </motion.span>
                    </td>
                    <td style={{ padding: "1.5rem 1rem" }}>
                      <div
                        className="booking-actions"
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {booking.status === "pending" && (
                          <motion.button
                            onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                            className="btn btn-small btn-success"
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.05 }}
                          >
                            ✅ Confirm
                          </motion.button>
                        )}
                        {booking.status !== "cancelled" && (
                          <motion.button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-small btn-danger"
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9 + index * 0.05 }}
                          >
                            ❌ Cancel
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default BookingsList
