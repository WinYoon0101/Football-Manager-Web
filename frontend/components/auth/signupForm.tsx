"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" // 1. Import router
import { signIn } from "next-auth/react"    // 2. Import signIn để auto login
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // 3. State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")

  // Hàm cập nhật state khi nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    // 4. Validate checkbox
    if (!agreeTerms) {
      setError("Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục.")
      setIsLoading(false)
      return
    }

    try {
      // BƯỚC 1: Gọi API Backend để tạo tài khoản
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại")
      }

      // BƯỚC 2: Tự động đăng nhập (Auto Login)
      const loginRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (loginRes?.error) {
        // Trường hợp hiếm: Tạo được nhưng không login được
        router.push("/login")
      } else {
        // Thành công -> Về trang chủ
        router.refresh()
        router.push("/")
      }

    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Tạo Tài Khoản</h1>
        <p className="text-slate-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        
        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            ⚠️ {error}
          </div>
        )}

        {/* Tên hiển thị */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700">Tên hiển thị</Label>
          <Input 
            id="name" 
            placeholder="Nguyễn Văn A" 
            type="text" 
            // Binding dữ liệu
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus-visible:ring-blue-600"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">Email</Label>
          <Input 
            id="email" 
            placeholder="admin@gmail.com" 
            type="email" 
            // Binding dữ liệu
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus-visible:ring-blue-600"
          />
        </div>
        
        {/* Mật khẩu */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700">Mật khẩu</Label>
          <Input 
            id="password" 
            type="password" 
            // Binding dữ liệu
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus-visible:ring-blue-600"
          />
        </div>

        {/* Checkbox Điều khoản */}
        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="terms" 
            // Xử lý sự kiện riêng cho shadcn checkbox
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
            className="border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" 
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
          >
            Tôi đồng ý với <Link href="/terms" className="text-blue-600 hover:underline">Điều khoản dịch vụ</Link>
          </label>
        </div>

        {/* Button Submit */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2" disabled={isLoading}>
          {isLoading ? "Đang tạo tài khoản..." : "Đăng Ký Ngay"}
        </Button>
      </form>
    </div>
  )
}