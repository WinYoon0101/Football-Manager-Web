"use client";

import { useState } from "react";
import Link from "next/link";
import { register, login } from "@/lib/api/auth";
import { setAuthToken } from "@/lib/utils/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    if (!agreeTerms) {
      setError("Bạn cần đồng ý với điều khoản dịch vụ để tiếp tục.");
      setIsLoading(false);
      return;
    }

    try {
      // Đăng ký tài khoản mới
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      // Tự động đăng nhập sau khi đăng ký thành công
      const loginResult = await login({
        email: formData.email,
        password: formData.password,
      });

      // Kiểm tra role - chỉ cho phép user có role "user" (player) đăng nhập
      if (loginResult.user && loginResult.user.role) {
        const userRole = loginResult.user.role.toLowerCase();
        
        // Chỉ cho phép role "user" đăng nhập vào frontend-player
        // Các role khác như "admin", "manager" không được phép
        if (userRole !== "user") {
          setError("Tài khoản này không có quyền truy cập. Vui lòng đăng nhập bằng tài khoản cầu thủ.");
          setIsLoading(false);
          return;
        }
      }

      // Lưu token và user nếu role hợp lệ
      if (loginResult.token) {
        setAuthToken(loginResult.token, loginResult.user);
      }

      setFormData({ name: "", email: "", password: "" });
      setAgreeTerms(false);
      setIsLoading(false);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900">
          Đăng Ký
        </h1>
        <p className="text-slate-500">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700">
            Tên hiển thị
          </Label>
          <Input
            id="name"
            placeholder="Nguyễn Văn A"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus-visible:ring-blue-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email
          </Label>
          <Input
            id="email"
            placeholder="player@gmail.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus-visible:ring-blue-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700">
            Mật khẩu
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white border-gray-300 text-slate-900 focus:ring-blue-600 focus-visible:ring-blue-600"
          />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
            className="border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
          >
            Tôi đồng ý với{" "}
            <span className="text-blue-600 hover:underline">
              Điều khoản dịch vụ
            </span>
          </label>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2"
          disabled={isLoading}
        >
          {isLoading ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
        </Button>
      </form>
    </div>
  );
}


