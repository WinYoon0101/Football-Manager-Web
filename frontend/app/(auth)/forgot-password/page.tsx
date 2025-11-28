import { ForgotPasswordForm } from "@/components/auth/forgotPasswordForm" // Nhớ check đúng đường dẫn import

export default function ForgotPasswordPage() {
  return (
    // Wrapper này giữ kích thước form đồng bộ với trang Login/Signup
    <div className="w-full max-w-md space-y-8">
       <ForgotPasswordForm />
    </div>
  )
}