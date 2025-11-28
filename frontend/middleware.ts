import { withAuth } from "next-auth/middleware"

export default withAuth({
  // Cấu hình trang đích khi chưa đăng nhập
  pages: {
    signIn: "/login", 
  },
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup|forgot-password|.*\\..*).*)",
  ],
}
