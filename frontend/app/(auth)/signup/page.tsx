import { SignupForm } from "@/components/auth/signupForm"

// Khuyến nghị: Bỏ "use client" ở đây để page này là Server Component (tốt cho SEO)
// Logic client (useState, useEffect...) nên nằm bên trong <SignupForm />
export default function SignupPage() {
  return (
    // Wrapper này giúp form không bị bè ngang quá mức, giữ kích thước đồng bộ với Login
    <div className="w-full max-w-md space-y-8">
       <SignupForm />
    </div>
  )
}