const express = require("express")
const router = express.Router()
const Booking = require("../models/Booking")
const Venue = require("../models/Venue")

// GET /api/bookings - Fetch all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("venue", "name location").sort({ createdAt: -1 })
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message })
  }
})

// POST /api/bookings - Create a new booking
router.post("/", async (req, res) => {
  try {
    const { venue: venueId, bookingDate, ...bookingData } = req.body

    // Check if venue exists
    const venue = await Venue.findById(venueId)
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" })
    }

    // Check if date is available
    const bookingDateObj = new Date(bookingDate)

    // Check for existing bookings
    const existingBooking = await Booking.findOne({
      venue: venueId,
      bookingDate: bookingDateObj,
      status: { $ne: "cancelled" },
    })

    if (existingBooking) {
      return res.status(400).json({ message: "Venue is already booked for this date" })
    }

    // Check if date is blocked by admin
    const isBlocked = venue.unavailableDates.some(
      (unavailableDate) => unavailableDate.date.toDateString() === bookingDateObj.toDateString(),
    )

    if (isBlocked) {
      return res.status(400).json({ message: "Venue is not available for this date" })
    }

    // Check capacity
    if (bookingData.guestCount > venue.capacity) {
      return res.status(400).json({ message: "Guest count exceeds venue capacity" })
    }

    // Create booking
    const booking = new Booking({
      venue: venueId,
      bookingDate: bookingDateObj,
      totalAmount: venue.pricePerDay,
      ...bookingData,
    })

    const savedBooking = await booking.save()
    const populatedBooking = await Booking.findById(savedBooking._id).populate("venue", "name location")

    res.status(201).json(populatedBooking)
  } catch (error) {
    res.status(400).json({ message: "Error creating booking", error: error.message })
  }
})

// GET /api/bookings/:id - Fetch single booking
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("venue")
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    res.json(booking)
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message })
  }
})

// PUT /api/bookings/:id - Update booking status
router.put("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("venue", "name location")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.json(booking)
  } catch (error) {
    res.status(400).json({ message: "Error updating booking", error: error.message })
  }
})

// DELETE /api/bookings/:id - Cancel booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" }, { new: true })

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.json({ message: "Booking cancelled successfully", booking })
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error: error.message })
  }
})

module.exports = router
