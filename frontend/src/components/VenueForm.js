"use client"

import { useState } from "react"
import { venueAPI } from "../services/api"

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
    <div className="venue-form-container">
      <h2>Add New Venue</h2>

      {success && <div className="success-message">✅ Venue created successfully!</div>}

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="venue-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Venue Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter venue name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="Enter venue location"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Describe the venue..."
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="capacity">Capacity *</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="Maximum guests"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePerDay">Price per Day ($) *</label>
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
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="amenities">Amenities</label>
          <input
            type="text"
            id="amenities"
            name="amenities"
            value={formData.amenities}
            onChange={handleInputChange}
            placeholder="Comma-separated list (e.g., WiFi, Parking, Audio System)"
          />
          <small className="form-help">Separate multiple amenities with commas</small>
        </div>

        <div className="form-group">
          <label htmlFor="images">Image URLs</label>
          <input
            type="text"
            id="images"
            name="images"
            value={formData.images}
            onChange={handleInputChange}
            placeholder="Comma-separated image URLs"
          />
          <small className="form-help">Separate multiple image URLs with commas</small>
        </div>

        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
          {loading ? "Creating..." : "Create Venue"}
        </button>
      </form>
    </div>
  )
}

export default VenueForm
