"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion" // Import motion and AnimatePresence
import { venueAPI, bookingAPI } from "../services/api"

const BookingForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    bookingDate: "",
    eventType: "",
    guestCount: "",
    specialRequests: "",
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (id) {
      // Only fetch if id is available
      fetchVenueDetails()
    } else {
      setLoading(false)
      setError("No venue selected. Please go back to the venue list and select a venue to book.")
    }
  }, [id])

  const fetchVenueDetails = async () => {
    try {
      setLoading(true)
      const data = await venueAPI.getById(id)
      setVenue(data)
      setError(null) // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch venue details. Please try again.")
      console.error("Error fetching venue:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.customerName.trim()) {
      errors.customerName = "Name is required"
    }

    if (!formData.customerEmail.trim()) {
      errors.customerEmail = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      errors.customerEmail = "Email is invalid"
    }

    if (!formData.customerPhone.trim()) {
      errors.customerPhone = "Phone number is required"
    }

    if (!formData.bookingDate) {
      errors.bookingDate = "Booking date is required"
    } else {
      const selectedDate = new Date(formData.bookingDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        errors.bookingDate = "Booking date cannot be in the past"
      }
    }

    if (!formData.eventType.trim()) {
      errors.eventType = "Event type is required"
    }

    if (!formData.guestCount) {
      errors.guestCount = "Guest count is required"
    } else if (Number.parseInt(formData.guestCount) < 1) {
      errors.guestCount = "Guest count must be at least 1"
    } else if (venue && Number.parseInt(formData.guestCount) > venue.capacity) {
      errors.guestCount = `Guest count cannot exceed venue capacity (${venue.capacity})`
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const bookingData = {
        ...formData,
        venue: id,
        guestCount: Number.parseInt(formData.guestCount),
      }

      await bookingAPI.create(bookingData)
      setSuccess(true)

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/")
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking")
      console.error("Error creating booking:", err)
    } finally {
      setSubmitting(false)
    }
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

  if (error && !venue) {
    return (
      <motion.div
        className="error-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="error-message">{error}</p>
        <motion.button
          onClick={() => navigate("/")}
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Venues
        </motion.button>
      </motion.div>
    )
  }

  if (success) {
    return (
      <motion.div
        className="success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-message">
          <h2>🎉 Booking Confirmed!</h2>
          <p>
            Your booking for <strong>{venue?.name}</strong> has been confirmed.
          </p>
          <p>You will be redirected to the venues page shortly...</p>
        </div>
      </motion.div>
    )
  }

  // Ensure venue is not null before rendering the form
  if (!venue) {
    return (
      <motion.div
        className="error-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="error-message">Venue details could not be loaded.</p>
        <motion.button
          onClick={() => navigate("/")}
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Venues
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="booking-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}
    >
      <div className="booking-header" style={{ marginBottom: "2rem", textAlign: "center" }}>
        <motion.button
          onClick={() => navigate(-1)}
          className="back-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "none",
            border: "none",
            color: "var(--primary)",
            fontSize: "1.1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
            fontWeight: "500",
          }}
        >
          ← Back
        </motion.button>
        <h1
          style={{
            fontSize: "3rem",
            background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "700",
          }}
        >
          Book {venue.name}
        </h1>
      </div>

      <div
        className="booking-content glass"
        style={{
          padding: "2.5rem",
          borderRadius: "25px",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <div
          className="venue-summary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            marginBottom: "2rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid var(--glass-border)",
          }}
        >
          <img
            src={venue.images[0] || "https://images.unsplash.com/photo-1519167758481-83f29c8a4e0a?w=200&h=150&fit=crop"}
            alt={venue.name}
            className="venue-summary-image"
            style={{
              width: "150px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1519167758481-83f29c8a4e0a?w=200&h=150&fit=crop"
            }}
          />
          <div className="venue-summary-info">
            <h3 style={{ fontSize: "1.75rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>{venue.name}</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "0.25rem" }}>📍 {venue.location}</p>
            <p style={{ color: "var(--text-secondary)", marginBottom: "0.25rem" }}>👥 Up to {venue.capacity} guests</p>
            <p style={{ color: "var(--text-secondary)" }}>💰 ${venue.pricePerDay}/day</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "1.5rem",
              color: "var(--text-primary)",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Booking Details
          </h2>

          <AnimatePresence>
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: "1.5rem" }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="form-group">
              <label htmlFor="customerName" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                Full Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={formErrors.customerName ? "error" : ""}
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "10px",
                  border: `1px solid ${formErrors.customerName ? "var(--accent-rose)" : "var(--glass-border)"}`,
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: "1rem",
                }}
              />
              {formErrors.customerName && (
                <span className="field-error" style={{ color: "var(--accent-rose)", fontSize: "0.85rem" }}>
                  {formErrors.customerName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                Email Address *
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className={formErrors.customerEmail ? "error" : ""}
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "10px",
                  border: `1px solid ${formErrors.customerEmail ? "var(--accent-rose)" : "var(--glass-border)"}`,
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: "1rem",
                }}
              />
              {formErrors.customerEmail && (
                <span className="field-error" style={{ color: "var(--accent-rose)", fontSize: "0.85rem" }}>
                  {formErrors.customerEmail}
                </span>
              )}
            </div>
          </div>

          <div
            className="form-row"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}
          >
            <div className="form-group">
              <label htmlFor="customerPhone" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                Phone Number *
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                className={formErrors.customerPhone ? "error" : ""}
                placeholder="Enter your phone number"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "10px",
                  border: `1px solid ${formErrors.customerPhone ? "var(--accent-rose)" : "var(--glass-border)"}`,
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: "1rem",
                }}
              />
              {formErrors.customerPhone && (
                <span className="field-error" style={{ color: "var(--accent-rose)", fontSize: "0.85rem" }}>
                  {formErrors.customerPhone}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="bookingDate" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                Event Date *
              </label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                className={formErrors.bookingDate ? "error" : ""}
                min={new Date().toISOString().split("T")[0]}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "10px",
                  border: `1px solid ${formErrors.bookingDate ? "var(--accent-rose)" : "var(--glass-border)"}`,
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: "1rem",
                }}
              />
              {formErrors.bookingDate && (
                <span className="field-error" style={{ color: "var(--accent-rose)", fontSize: "0.85rem" }}>
                  {formErrors.bookingDate}
                </span>
              )}
            </div>
          </div>

          <div
            className="form-row"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}
          >
            <div className="form-group">
              <label htmlFor="eventType" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                Event Type *
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className={formErrors.eventType ? "error" : ""}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "10px",
                  border: `1px solid ${formErrors.eventType ? "var(--accent-rose)" : "var(--glass-border)"}`,
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: "1rem",
                }}
              >
                <option value="">Select event type</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Birthday Party">Birthday Party</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.eventType && (
                <span className="field-error" style={{ color: "var(--accent-rose)", fontSize: "0.85rem" }}>
                  {formErrors.eventType}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="guestCount" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                Number of Guests *
              </label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                className={formErrors.guestCount ? "error" : ""}
                placeholder="Enter guest count"
                min="1"
                max={venue.capacity}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  borderRadius: "10px",
                  border: `1px solid ${formErrors.guestCount ? "var(--accent-rose)" : "var(--glass-border)"}`,
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: "1rem",
                }}
              />
              {formErrors.guestCount && (
                <span className="field-error" style={{ color: "var(--accent-rose)", fontSize: "0.85rem" }}>
                  {formErrors.guestCount}
                </span>
              )}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: "1.5rem" }}>
            <label htmlFor="specialRequests" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Special Requests
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Any special requirements or requests..."
              rows="4"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
          </div>

          <div
            className="booking-summary glass"
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              borderRadius: "20px",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--text-primary)" }}>Booking Summary</h3>
            <div
              className="summary-item"
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Venue:</span>
              <span style={{ fontWeight: "500" }}>{venue.name}</span>
            </div>
            <div
              className="summary-item"
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Date:</span>
              <span style={{ fontWeight: "500" }}>{formData.bookingDate || "Not selected"}</span>
            </div>
            <div
              className="summary-item"
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}
            >
              <span style={{ color: "var(--text-secondary)" }}>Guests:</span>
              <span style={{ fontWeight: "500" }}>{formData.guestCount || "Not specified"}</span>
            </div>
            <div
              className="summary-item total"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px dashed var(--glass-border)",
              }}
            >
              <span style={{ fontSize: "1.2rem", fontWeight: "600", color: "var(--text-primary)" }}>Total Amount:</span>
              <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--primary)" }}>
                ${venue.pricePerDay}
              </span>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%", marginTop: "2rem" }}
          >
            {submitting ? "Processing..." : "Confirm Booking"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}

export default BookingForm
