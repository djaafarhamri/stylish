"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type SignupData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

type LoginData = {
  email: string
  password: string
  remember?: boolean
}

export async function signup(formData: FormData) {
  // In a real app, you would validate the data and create a user in your database
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string

  // Validate passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Set a cookie to simulate authentication
  cookies().set("auth-token", "user-token-123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  })

  // Redirect to the dashboard or home page
  redirect("/")
}

export async function login(formData: FormData) {
  // In a real app, you would validate credentials against your database
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const remember = formData.get("remember") === "on"

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Set a cookie to simulate authentication
  cookies().set("auth-token", "user-token-123", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days if remember, else 1 day
    path: "/",
  })

  // Redirect to the dashboard or home page
  redirect("/")
}

export async function logout() {
  cookies().delete("auth-token")
  redirect("/login")
}

