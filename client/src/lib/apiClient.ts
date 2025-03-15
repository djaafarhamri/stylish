import axios from "axios"

// Create a base axios instance with common configuration
const apiClient = axios.create({
  baseURL: "https://stylish-skb8.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

export default apiClient

