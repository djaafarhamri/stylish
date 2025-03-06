import axios from "axios"

// Create a base axios instance with common configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds
})

// Request interceptor for adding auth token, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies in client-side code
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error

    // Handle authentication errors
    if (response && response.status === 401) {
      // Clear auth state and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token")
        window.location.href = "/login"
      }
    }

    // Handle server errors
    if (response && response.status >= 500) {
      console.error("Server error:", response.data)
      // You could trigger a notification here
    }

    return Promise.reject(error)
  },
)

export default apiClient

