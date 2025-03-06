// Simplified version of the toast component for the example
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const toast = ({ title, description, variant }: ToastProps) => {
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
    })
  }

  return sonnerToast.success(title, {
    description,
  })
}

