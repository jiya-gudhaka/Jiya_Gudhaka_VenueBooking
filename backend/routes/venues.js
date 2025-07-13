const express = require("express")
const router = express.Router()
const Venue = require("../models/Venue")
const Booking = require("../models/Booking")

// GET /api/venues - Fetch all venues, optionally filtered by date
router.get("/", async (req, res) => {
  try {
    const { date } = req.query
    const query = { isActive: true }

    if (date) {
      const searchDate = new Date(date)
      searchDate.setHours(0, 0, 0, 0) // Normalize to start of day

      // Find bookings for the specific date
      const bookedVenueIds = await Booking.find({
        bookingDate: searchDate,
        status: { $ne: "cancelled" },
      }).distinct("venue")

      // Find venues that have this date in their unavailableDates
      const blockedVenueIds = await Venue.find({
        "unavailableDates.date": searchDate,
      }).distinct("_id")

      // Combine all unavailable venue IDs
      const unavailableVenueIds = [...new Set([...bookedVenueIds, ...blockedVenueIds])]

      // Add to query: venue _id should not be in unavailableVenueIds
      query._id = { $nin: unavailableVenueIds }
    }

    const venues = await Venue.find(query).sort({ createdAt: -1 })
    res.json(venues)
  } catch (error) {
    res.status(500).json({ message: "Error fetching venues", error: error.message })
  }
})

// GET /api/venues/:id - Fetch single venue
router.get("/:id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" })
    }
    res.json(venue)
  } catch (error) {
    res.status(500).json({ message: "Error fetching venue", error: error.message })
  }
})

// POST /api/venues - Add a new venue
router.post("/", async (req, res) => {
  try {
    const venue = new Venue(req.body)
    const savedVenue = await venue.save()
    res.status(201).json(savedVenue)
  } catch (error) {
    res.status(400).json({ message: "Error creating venue", error: error.message })
  }
})

// PUT /api/venues/:id - Update venue
router.put("/:id", async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" })
    }
    res.json(venue)
  } catch (error) {
    res.status(400).json({ message: "Error updating venue", error: error.message })
  }
})

// POST /api/venues/:id/block-dates - Block dates for a venue
router.post("/:id/block-dates", async (req, res) => {
  try {
    const { dates, reason } = req.body
    const venue = await Venue.findById(req.params.id)

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" })
    }

    // Add new unavailable dates
    const newUnavailableDates = dates.map((date) => ({
      date: new Date(date),
      reason: reason || "Blocked by admin",
    }))

    venue.unavailableDates.push(...newUnavailableDates)
    await venue.save()

    res.json({ message: "Dates blocked successfully", venue })
  } catch (error) {
    res.status(400).json({ message: "Error blocking dates", error: error.message })
  }
})

// DELETE /api/venues/:id/unblock-dates - Unblock dates for a venue
router.delete("/:id/unblock-dates", async (req, res) => {
  try {
    const { dates } = req.body
    const venue = await Venue.findById(req.params.id)

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" })
    }

    // Remove specified dates
    venue.unavailableDates = venue.unavailableDates.filter(
      (unavailableDate) => !dates.some((date) => new Date(date).toDateString() === unavailableDate.date.toDateString()),
    )

    await venue.save()
    res.json({ message: "Dates unblocked successfully", venue })
  } catch (error) {
    res.status(400).json({ message: "Error unblocking dates", error: error.message })
  }
})

// GET /api/venues/:id/availability - Check availability for specific dates
router.get("/:id/availability", async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const venue = await Venue.findById(req.params.id)

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" })
    }

    // Get all bookings for the venue in the date range
    const bookings = await Booking.find({
      venue: req.params.id,
      bookingDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      status: { $ne: "cancelled" },
    })

    // Get unavailable dates
    const unavailableDates = venue.unavailableDates.filter((unavailableDate) => {
      const date = unavailableDate.date
      return date >= new Date(startDate) && date <= new Date(endDate)
    })

    res.json({
      venue: venue.name,
      bookedDates: bookings.map((booking) => booking.bookingDate),
      unavailableDates: unavailableDates.map((ud) => ud.date),
      totalUnavailable: [...bookings.map((b) => b.bookingDate), ...unavailableDates.map((ud) => ud.date)],
    })
  } catch (error) {
    res.status(500).json({ message: "Error checking availability", error: error.message })
  }
})

// DELETE /api/venues/:id - Delete venue
router.delete("/:id", async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" })
    }
    res.json({ message: "Venue deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting venue", error: error.message })
  }
})

module.exports = router
