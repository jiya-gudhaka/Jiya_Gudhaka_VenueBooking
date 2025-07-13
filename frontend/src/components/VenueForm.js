"use client"

import { useState } from "react"
import { venueAPI } from "../services/api"
import { motion, AnimatePresence } from "framer-motion"

const VenueForm = ({ onVenueAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "",
    pricePerDay: "",
    amenities: "",
    images: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const venueData = {
        ...formData,
        capacity: Number.parseInt(formData.capacity),
        pricePerDay: Number.parseFloat(formData.pricePerDay),
        amenities: formData.amenities
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
        images: formData.images
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      }

      await venueAPI.create(venueData)
      setSuccess(true)

      // Reset form
      setFormData({
        name: "",
        description: "",
        location: "",
        capacity: "",
        pricePerDay: "",
        amenities: "",
        images: "",
      })

      // Call parent callback
      if (onVenueAdded) {
        onVenueAdded()
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create venue")
      console.error("Error creating venue:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="venue-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, var(--primary), var(--primary-light))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        Add New Venue
      </h2>

      <AnimatePresence>
        {success && (
          <motion.div
            className="success-message"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: "1.5rem" }}
          >
            ✅ Venue created successfully!
          </motion.div>
        )}

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: "1.5rem" }}
          >
            ❌ {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="venue-form glass"
        style={{
          padding: "2.5rem",
          borderRadius: "25px",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div className="form-group">
            <label htmlFor="name" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Venue Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter venue name"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                fontSize: "1rem",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="Enter venue location"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                fontSize: "1rem",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: "1.5rem" }}>
          <label htmlFor="description" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Describe the venue..."
            rows="4"
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "10px",
              border: "1px solid var(--glass-border)",
              background: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              fontSize: "1rem",
              color: "var(--text-primary)",
              resize: "vertical",
            }}
          />
        </div>

        <div
          className="form-row"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "1.5rem" }}
        >
          <div className="form-group">
            <label htmlFor="capacity" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Capacity *
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="Maximum guests"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                fontSize: "1rem",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePerDay" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
              Price per Day ($) *
            </label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                border: "1px solid var(--glass-border)",
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)",
                fontSize: "1rem",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: "1.5rem" }}>
          <label htmlFor="amenities" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
            Amenities
          </label>
          <input
            type="text"
            id="amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleInputChange}
            placeholder="Comma-separated list (e.g., WiFi, Parking, Audio System)"
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "10px",
              border: "1px solid var(--glass-border)",
              background: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              fontSize: "1rem",
              color: "var(--text-primary)",
            }}
          />
          <small
            className="form-help"
            style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}
          >
            Separate multiple amenities with commas
          </small>
        </div>

        <div className="form-group" style={{ marginTop: "1.5rem" }}>
          <label htmlFor="images" style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
            Image URLs
          </label>
          <input
            type="text"
            id="images"
            name="images"
            value={formData.images}
            onChange={handleInputChange}
            placeholder="Comma-separated image URLs"
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "10px",
              border: "1px solid var(--glass-border)",
              background: "rgba(255, 255, 255, 0.5)",
              backdropFilter: "blur(10px)",
              fontSize: "1rem",
              color: "var(--text-primary)",
            }}
          />
          <small
            className="form-help"
            style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.25rem", display: "block" }}
          >
            Separate multiple image URLs with commas
          </small>
        </div>

        <motion.button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ width: "100%", marginTop: "2rem" }}
        >
          {loading ? "Creating..." : "Create Venue"}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default VenueForm
