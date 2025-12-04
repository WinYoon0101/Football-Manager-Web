"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // TODO: Gọi API reset password khi backend có endpoint
      // const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // })
      
      // Tạm thời chỉ hiển thị thông báo thành công
      // Khi backend có API, uncomment code trên và xử lý response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">Kiểm Tra Email</h1>
          <p className="text-slate-500">
            Chúng tôi đã gửi link đặt lại mật khẩu tới{" "}
            <span className="font-bold text-slate-900">{email}</span>.
            Vui lòng kiểm tra hộp thư của bạn.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => {
              setSubmitted(false)
              setEmail("")
            }} 
            variant="outline" 
            className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Gửi Lại
          </Button>
          <Link 
            href="/login" 
            className="block text-center text-sm text-slate-500 hover:text-blue-600 hover:underline"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Quên Mật Khẩu</h1>
        <p className="text-slate-500">
          Nhập email để nhận link đặt lại mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="player@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus:border-blue-600"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Gửi Liên Kết"}
        </Button>

        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm text-slate-500 hover:text-blue-600 hover:underline"
          >
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </div>
  )
}

