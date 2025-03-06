import apiClient from "@/lib/api-client"
import type { LoginRequest, LoginResponse, SignupRequest, User } from "@/types/api"

export const AuthService = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post("/auth/login", credentials)

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("auth-token", data.token)
    }

    return data
  },

  // Register new user
  async signup(userData: SignupRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post("/auth/signup", userData)

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("auth-token", data.token)
    }

    return data
  },

  // Logout user
  async logout(): Promise<void> {
    localStorage.removeItem("auth-token")
    // Optionally call logout endpoint to invalidate token on server
    await apiClient.post("/auth/logout")
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get("/auth/me")
    return data
  },
}

