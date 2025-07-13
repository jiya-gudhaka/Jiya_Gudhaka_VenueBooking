"use client"

import { useState, useEffect } from "react"
import { venueAPI, bookingAPI } from "../services/api"
import VenueForm from "./VenueForm"
import BookingsList from "./BookingsList"
import VenueManagement from "./VenueManagement"

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
        return bookingDate >= today && booking.status !== "cancelled"
      }).length

      setStats({
        totalVenues: venuesData.length,
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

      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-info">
                  <h3>{stats.totalVenues}</h3>
                  <p>Total Venues</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{stats.totalBookings}</h3>
                  <p>Total Bookings</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${stats.totalRevenue.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <h3>{stats.upcomingBookings}</h3>
                  <p>Upcoming Bookings</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
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
                    <div className={`activity-status ${booking.status}`}>{booking.status}</div>
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
