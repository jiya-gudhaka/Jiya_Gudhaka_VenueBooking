const mongoose = require("mongoose")
const Venue = require("../models/Venue")
const connectDB = require("../config/database")

const sampleVenues = [
  {
    name: "Grand Ballroom",
    description: "Elegant ballroom perfect for weddings and corporate events",
    location: "Downtown Convention Center",
    capacity: 200,
    pricePerDay: 2500,
    amenities: ["Audio/Visual Equipment", "Catering Kitchen", "Dance Floor", "Parking"],
    images: ["/placeholder.svg?height=300&width=400"],
    owner: "admin",
  },
  {
    name: "Garden Pavilion",
    description: "Beautiful outdoor venue with garden views",
    location: "City Park",
    capacity: 150,
    pricePerDay: 1800,
    amenities: ["Outdoor Seating", "Garden Views", "Tent Option", "Parking"],
    images: ["/placeholder.svg?height=300&width=400"],
    owner: "admin",
  },
  {
    name: "Conference Hall A",
    description: "Modern conference facility for business meetings",
    location: "Business District",
    capacity: 100,
    pricePerDay: 1200,
    amenities: ["Projector", "Whiteboard", "WiFi", "Coffee Station"],
    images: ["/placeholder.svg?height=300&width=400"],
    owner: "admin",
  },
  {
    name: "Rooftop Terrace",
    description: "Stunning rooftop venue with city skyline views",
    location: "Midtown Hotel",
    capacity: 80,
    pricePerDay: 2000,
    amenities: ["City Views", "Bar Setup", "Lounge Seating", "Climate Control"],
    images: ["/placeholder.svg?height=300&width=400"],
    owner: "admin",
  },
]

const seedDatabase = async () => {
  try {
    await connectDB()

    // Clear existing venues
    await Venue.deleteMany({})

    // Insert sample venues
    const venues = await Venue.insertMany(sampleVenues)
    console.log(`${venues.length} venues created successfully!`)

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
