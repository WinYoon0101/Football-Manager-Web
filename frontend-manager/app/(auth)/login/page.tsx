import { LoginForm } from "@/components/auth/loginForm"

// Không cần "use client" ở đây nữa nếu logic client nằm trong LoginForm
export default function LoginPage() {
  return (
    // Layout cha đã lo việc căn giữa (items-center justify-center)
    // Nên ở đây chỉ cần gọi Form ra là xong.
    <div className="w-full max-w-md space-y-8"> 
        {/* Có thể thêm wrapper này để giới hạn chiều rộng form cho đẹp */}
        <LoginForm />
    </div>
  )
}