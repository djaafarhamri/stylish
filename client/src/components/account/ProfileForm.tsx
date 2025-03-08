"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { AuthService } from "../../services/auth-service"
import useAuth from "../../context/auth/useAuth"
import { useNavigate } from "react-router"
import { showToast } from "../ui/showToast"

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingLogout, setIsLoadingLogout] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const {user} = useAuth()
  // In a real app, you would fetch this data from your backend
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Simulate API call
      if (!formData.email) {
        setMessage({ type: "error", text: "Email is empty" })
        return;
      }
      if (!formData.firstName) {
        setMessage({ type: "error", text: "First Name is empty" })
        return;
      }
      if (!formData.lastName) {
        setMessage({ type: "error", text: "Last Name is empty" })
        return;
      }
      if (!formData.phone) {
        setMessage({ type: "error", text: "Phone is empty" })
        return;
      }
      
      await AuthService.updateProfile(formData)
      
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (error) {
        console.log(error)
      setMessage({ type: "error", text: "Failed to update profile. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const navigate = useNavigate()

  const handleLogout = async() => {
    setIsLoadingLogout(true)
    try {
      await AuthService.logout()
      setIsLoadingLogout(false)
      navigate("/login")
    } catch (e) {
      console.log(e)
      showToast({
        title: "Unknown Error Occurred",
        type: "error"
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save changes"}
      </Button>

      <Button disabled={isLoadingLogout} onClick={handleLogout} variant="outline">
        {isLoading ? "Logging Out..." : "Log Out"}
      </Button>
    </form>
  )
}

