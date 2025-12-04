import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full bg-white">
      
      {/* 1. KHỐI HÌNH ẢNH (Đưa lên đầu -> Sẽ nằm bên TRÁI) */}
      <div className="hidden md:flex w-1/2 relative bg-[#f5f8f5]">
        <Image
          src="/background-2.png"
          alt="Football Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* 2. KHỐI FORM (Đưa xuống dưới -> Sẽ nằm bên PHẢI) */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-12 bg-white">
        {children}
      </div>

    </div>
  )
}

