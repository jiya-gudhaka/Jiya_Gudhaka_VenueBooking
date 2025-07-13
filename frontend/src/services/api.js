const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Venue API
export const venueAPI = {
  getAll: () => apiRequest("/venues"),
  getById: (id) => apiRequest(`/venues/${id}`),
  create: (venueData) =>
    apiRequest("/venues", {
      method: "POST",
      body: venueData,
    }),
  update: (id, venueData) =>
    apiRequest(`/venues/${id}`, {
      method: "PUT",
      body: venueData,
    }),
  delete: (id) =>
    apiRequest(`/venues/${id}`, {
      method: "DELETE",
    }),
  blockDates: (id, data) =>
    apiRequest(`/venues/${id}/block-dates`, {
      method: "POST",
      body: data,
    }),
  unblockDates: (id, data) =>
    apiRequest(`/venues/${id}/unblock-dates`, {
      method: "DELETE",
      body: data,
    }),
  checkAvailability: (id, startDate, endDate) =>
    apiRequest(`/venues/${id}/availability?startDate=${startDate}&endDate=${endDate}`),
}

// Booking API
export const bookingAPI = {
  getAll: () => apiRequest("/bookings"),
  getById: (id) => apiRequest(`/bookings/${id}`),
  create: (bookingData) =>
    apiRequest("/bookings", {
      method: "POST",
      body: bookingData,
    }),
  update: (id, bookingData) =>
    apiRequest(`/bookings/${id}`, {
      method: "PUT",
      body: bookingData,
    }),
  delete: (id) =>
    apiRequest(`/bookings/${id}`, {
      method: "DELETE",
    }),
}
