import { toast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  type?: "success" | "error";
}

export function showToast({
  title,
  description = "",
  type = "success",
}: ToastOptions) {
  toast[type](title, {
    description,
  });
}
