
import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { useFormStatus } from "react-dom"
import { User } from "../types/api"
import useAuth from "../context/auth/useAuth"
import { useNavigate } from "react-router"

interface AuthFormProps {
  children: React.ReactNode
  submitLabel: string
  action: (formData: FormData) => Promise<{user: User} | { error: string }>
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Processing..." : label}
    </Button>
  )
}

export function AuthForm({ children, submitLabel, action }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null)

  const {login} = useAuth()

  const navigate = useNavigate()
  
  async function handleAction(formData: FormData) {
    setError(null)
    const result = await action(formData)
    if (result && "error" in result) {
      setError(result.error)
    } else {
      login(result.user)
      navigate("/account")
    }
  }

  return (
    <form action={handleAction}>
      {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}
      {children}
      <div className="mt-4">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}

