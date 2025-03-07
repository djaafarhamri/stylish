import axios from "axios"

// Create a base axios instance with common configuration
const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

export default apiClient

