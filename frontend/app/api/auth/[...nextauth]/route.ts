import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch("http://127.0.0.1:4000/auth/login", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });

        const data = await res.json();

        // Nếu đăng nhập thành công
        if (res.ok && data.user) {
          // Trả về user kèm token để NextAuth lưu lại
          return { ...data.user, apiToken: data.token }; 
        }

        // Nếu thất bại
        return null;
      }
    })
  ],
  callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.apiToken = (user as any).apiToken; 
        }
        return token;
        },
        async session({ session, token }) {
        if (token && session.user) {
            (session.user as any).apiToken = token.apiToken;
        }
        return session;
        }
  },
  pages: {
    signIn: '/login', // Đường dẫn tới trang login custom của bạn (nếu chưa có thì để tạm, nó sẽ dùng form mặc định)
    error:  '/login'
  }
});

export { handler as GET, handler as POST };