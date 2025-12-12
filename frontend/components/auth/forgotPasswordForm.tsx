"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  // ... (Giữ nguyên logic submit) ...

  if (submitted) {
    return (
      <div className="w-full">
         {/* Text thành công */}
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Kiểm Tra Email</h1>
        <p className="text-slate-500 mb-8">
           Chúng tôi đã gửi link tới <span className="font-bold text-slate-900">{email}</span>...
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="w-full mb-2 border-blue-200 text-blue-600 hover:bg-blue-50">
           Gửi Lại
        </Button>
        <Link href="/login" className="block text-center text-sm text-slate-500 hover:text-blue-600">
           Quay lại đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Quên Mật Khẩu</h1>
        <p className="text-sm text-slate-500">
          Nhập email để lấy lại mật khẩu.
        </p>
      </div>

      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-900">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // Style Input Light Mode
            className="bg-white border-gray-300 text-slate-900 placeholder:text-gray-400 focus-visible:ring-blue-600"
            required
          />
        </div>

        {/* Nút màu xanh */}
        <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold">
          Đặt lại mật khẩu
        </Button>

        <div className="text-center">
          <Link href="/login" className="text-sm text-slate-500 hover:text-blue-600 hover:underline">
            Quay Lại Đăng Nhập
          </Link>
        </div>
      </form>
    </div>
  )
}