"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Gọi API đăng nhập
      const result = await login({ email, password });

      
      // Lưu token vào cả localStorage và cookie
      if (result.token) {
        setAuthToken(result.token, result.user);
      }

      // Reset form
      setEmail("");
      setPassword("");
      setIsLoading(false);

      // Chuyển về trang chủ sau khi lưu token
      window.location.href = "/";
    } catch (err: any) {
      // Xử lý lỗi
      setError(err.message || "Email hoặc mật khẩu không chính xác");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900">Đăng Nhập</h1>
        <p className="text-slate-500">
          Chưa có tài khoản?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* 5. Hiển thị thông báo lỗi nếu có */}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email
          </Label>
          <Input
            id="email"
            placeholder="admin@gmail.com"
            type="email"
            // 6. Binding dữ liệu 2 chiều
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-700">
              Mật khẩu
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            // 7. Binding dữ liệu 2 chiều
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
        </Button>
      </form>
    </div>
  );
}
