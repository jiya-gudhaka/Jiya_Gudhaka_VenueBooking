"use client"

import { useState, useEffect } from "react"
import { venueAPI, bookingAPI } from "../services/api"
import VenueForm from "./VenueForm"
import BookingsList from "./BookingsList"
import VenueManagement from "./VenueManagement"
import { motion } from "framer-motion"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [venues, setVenues] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    upcomingBookings: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch all venues (including inactive ones for admin view if needed, or filter here)
      const [venuesData, bookingsData] = await Promise.all([venueAPI.getAll(), bookingAPI.getAll()])

      setVenues(venuesData)
      setBookings(bookingsData)

      // Calculate stats
      const totalRevenue = bookingsData
        .filter((booking) => booking.status !== "cancelled")
        .reduce((sum, booking) => sum + booking.totalAmount, 0)

      const upcomingBookings = bookingsData.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Normalize today's date
        return bookingDate >= today && booking.status !== "cancelled"
      }).length

      setStats({
        totalVenues: venuesData.filter((v) => v.isActive).length, // Only count active venues for overview
        totalBookings: bookingsData.length,
        totalRevenue,
        upcomingBookings,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVenueAdded = () => {
    fetchDashboardData()
    setActiveTab("venues")
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "venues", label: "Manage Venues", icon: "🏢" },
    { id: "add-venue", label: "Add Venue", icon: "➕" },
    { id: "bookings", label: "Bookings", icon: "📅" },
  ]

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your venues and bookings</p>
      </div>

      <div className="dashboard-tabs glass">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "50px",
              border: activeTab === tab.id ? "2px solid var(--primary)" : "1px solid var(--glass-border)",
              background: activeTab === tab.id ? "var(--primary)" : "var(--glass-white)",
              color: activeTab === tab.id ? "white" : "var(--text-primary)",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.3s ease",
              boxShadow: activeTab === tab.id ? "0 4px 15px rgba(108, 99, 255, 0.3)" : "none",
            }}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card glass">
                <div className="stat-icon">🏢</div>
                <div className="stat-info">
                  <h3>{stats.totalVenues}</h3>
                  <p>Total Active Venues</p>
                </div>
              </div>

              <div className="stat-card glass">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{stats.totalBookings}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>

              <div className="stat-card glass">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${stats.totalRevenue.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>

              <div className="stat-card glass">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <h3>{stats.upcomingBookings}</h3>
                  <p>Upcoming Bookings</p>
                </div>
              </div>
            </div>

            <div className="recent-activity glass">
              <h2>Recent Bookings</h2>
              <div className="activity-list">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="activity-item">
                    <div className="activity-info">
                      <h4>{booking.customerName}</h4>
                      <p>
                        {booking.venue?.name} - {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`activity-status ${booking.status}`}
                      style={{
                        backgroundColor:
                          booking.status === "confirmed"
                            ? "#10b98120"
                            : booking.status === "pending"
                              ? "#f59e0b20"
                              : "#ef444420",
                        color:
                          booking.status === "confirmed"
                            ? "#065f46"
                            : booking.status === "pending"
                              ? "#b45309"
                              : "#991b1b",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontWeight: "600",
                        textTransform: "capitalize",
                        border: `1px solid ${booking.status === "confirmed" ? "#10b98140" : booking.status === "pending" ? "#f59e0b40" : "#ef444440"}`,
                      }}
                    >
                      {booking.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "venues" && <VenueManagement venues={venues} onVenueUpdated={fetchDashboardData} />}

        {activeTab === "add-venue" && <VenueForm onVenueAdded={handleVenueAdded} />}

        {activeTab === "bookings" && (
          <BookingsList bookings={bookings} venues={venues} onBookingUpdated={fetchDashboardData} />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
