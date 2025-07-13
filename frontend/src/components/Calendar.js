"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const Calendar = ({ selectedDate, onSelectDate, unavailableDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Normalize unavailable dates to YYYY-MM-DD strings
  const normalizedUnavailableDates = new Set(
    unavailableDates.map((date) => {
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    })
  )

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const generateCalendarDays = useCallback(() => {
    const numDays = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push({ type: "empty" })
    }

    for (let i = 1; i <= numDays; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const isPast = date < today
      const isSelected = selectedDate === dateString
      const isUnavailable = normalizedUnavailableDates.has(dateString)

      days.push({
        type: "day",
        date,
        day: i,
        dateString,
        isPast,
        isSelected,
        isUnavailable,
      })
    }

    return days
  }, [currentYear, currentMonth, selectedDate, normalizedUnavailableDates])

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((year) => year - 1)
        return 11
      }
      return prev - 1
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((year) => year + 1)
        return 0
      }
      return prev + 1
    })
  }

  const handleDateClick = (day) => {
    if (day.type === "day" && !day.isPast && !day.isUnavailable) {
      onSelectDate(day.dateString)
    }
  }

  const handleClear = () => {
    onSelectDate("")
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })

  return (
    <motion.div
      className="calendar-container glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "1.5rem",
        borderRadius: "20px",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-glass)",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <div
        className="calendar-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <motion.button
          onClick={handlePrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--text-primary)",
          }}
        >
          {"<"}
        </motion.button>
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "var(--primary)",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {monthName} {currentYear}
        </h3>
        <motion.button
          onClick={handleNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--text-primary)",
          }}
        >
          {">"}
        </motion.button>
      </div>

      <div
        className="days-of-week"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        {daysOfWeek.map((day, index) => (
          <span
            key={day}
            style={{
              fontWeight: "600",
              color: index === 0 || index === 6 ? "var(--accent-rose)" : "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            {day}
          </span>
        ))}
      </div>

      <div
        className="calendar-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.5rem",
        }}
      >
        <AnimatePresence>
          {generateCalendarDays().map((day, index) => (
            <motion.div
              key={index}
              className={`calendar-day ${day.type === "day" ? "day-cell" : "empty-cell"} ${day.isPast ? "past" : ""} ${day.isSelected ? "selected" : ""} ${day.isUnavailable ? "unavailable" : ""}`}
              onClick={() => handleDateClick(day)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              whileHover={{ scale: day.type === "day" && !day.isPast && !day.isUnavailable ? 1.05 : 1 }}
              whileTap={{ scale: day.type === "day" && !day.isPast && !day.isUnavailable ? 0.95 : 1 }}
              style={{
                padding: "0.75rem 0.5rem",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: "500",
                position: "relative",
                cursor: day.type === "day" && !day.isPast && !day.isUnavailable ? "pointer" : "default",
                color:
                  day.type === "empty" || day.isPast || day.isUnavailable
                    ? "var(--text-secondary)"
                    : "var(--text-primary)",
                background: day.isSelected
                  ? "var(--primary)"
                  : day.isUnavailable
                    ? "rgba(239, 71, 111, 0.1)"
                    : "rgba(255, 255, 255, 0.5)",
                border: day.isSelected
                  ? "1px solid var(--primary)"
                  : day.isUnavailable
                    ? "1px solid rgba(239, 71, 111, 0.2)"
                    : "1px solid var(--glass-border)",
                boxShadow: day.isSelected ? "0 4px 10px rgba(108, 99, 255, 0.2)" : "none",
                backdropFilter: "blur(5px)",
                overflow: "hidden",
              }}
            >
              {day.type === "day" ? (
                <>
                  {day.day}
                  {(day.isPast || day.isUnavailable) && (
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "1.5rem",
                        color: day.isPast && !day.isUnavailable ? "rgba(0,0,0,0.2)" : "var(--accent-rose)",
                        pointerEvents: "none",
                        lineHeight: "1",
                      }}
                    >
                      {day.isUnavailable ? "❌" : "—"}
                    </span>
                  )}
                </>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div
        className="calendar-footer"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1.5rem",
        }}
      >
        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent-rose)",
            fontWeight: "600",
            cursor: "pointer",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            transition: "background 0.3s ease",
          }}
        >
          Clear
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Calendar
