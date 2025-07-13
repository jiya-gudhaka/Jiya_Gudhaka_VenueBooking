"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import VenueList from "./components/VenueList"
import AdminDashboard from "./components/AdminDashboard"
import BookingForm from "./components/BookingForm"
import VenueDetails from "./components/VenueDetails"
import "./App.css"

function App() {
  const [userRole, setUserRole] = useState("user") // 'user' or 'admin'

  return (
    <Router>
      <div className="App">
        <Navbar userRole={userRole} setUserRole={setUserRole} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<VenueList />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/BookingForm/:id" element={<BookingForm />} />
            <Route path="/admin" element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/VenueList" element={<VenueList />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
