"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/lib/utils/auth"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra token khi component mount (chỉ chạy trên client)
    const token = getAuthToken()
    
    if (!token) {
      router.replace("/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  // Hiển thị loading hoặc null trong lúc kiểm tra để tránh hydration mismatch
  if (isLoading) {
    return null
  }

  // Nếu không có token, không render gì (sẽ redirect)
  if (!isAuthenticated) {
    return null
  }

  // Nếu có token, hiển thị Dashboard
  return <Dashboard />
}