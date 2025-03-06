"use client"

import { useEffect } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/auth-service"
import type { LoginRequest, SignupRequest } from "@/types/api"

export function useAuth() {
  const router = useRouter()

  // Fetch current user data if authenticated
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR("current-user", () => {
    const token = localStorage.getItem("auth-token")
    return token ? AuthService.getCurrentUser() : null
  })

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await AuthService.login(credentials)
      await mutate() // Refresh user data
      return response
    } catch (error) {
      throw error
    }
  }

  const signup = async (userData: SignupRequest) => {
    try {
      const response = await AuthService.signup(userData)
      await mutate() // Refresh user data
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
      await mutate(null, false) // Clear user data
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return {
    user,
    isLoading,
    isError: error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  }
}

// Hook for protected routes
export function useRequireAuth(redirectUrl = "/login") {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectUrl)
    }
  }, [user, isLoading, router, redirectUrl])

  return { user, isLoading }
}

