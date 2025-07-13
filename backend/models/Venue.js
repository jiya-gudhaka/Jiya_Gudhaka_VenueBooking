const mongoose = require("mongoose")

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    unavailableDates: [
      {
        date: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          default: "Blocked by admin",
        },
      },
    ],
    owner: {
      type: String,
      required: true,
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient date queries
venueSchema.index({ "unavailableDates.date": 1 })

module.exports = mongoose.model("Venue", venueSchema)
