const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    specialRequests: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Compound index for efficient queries
bookingSchema.index({ venue: 1, bookingDate: 1 })

module.exports = mongoose.model("Booking", bookingSchema)
