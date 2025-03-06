import type React from "react"
import { Toaster } from "sonner"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { AuthProvider } from "@/context/AuthContext"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "STYLISH - Modern Clothing Store",
  description:
    "Discover the latest fashion trends at STYLISH. Shop our collection of high-quality clothing for men and women.",
    generator: 'v0.dev'
}    

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>    
  )
}  
