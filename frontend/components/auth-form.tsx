"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

interface AuthFormProps {
  children: React.ReactNode
  submitLabel: string
  action: (formData: FormData) => Promise<void | { error: string }>
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

  async function handleAction(formData: FormData) {
    setError(null)
    const result = await action(formData)
    if (result && "error" in result) {
      setError(result.error)
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

