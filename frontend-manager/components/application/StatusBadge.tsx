"use client";

interface Props {
  status?: string;
}

export default function StatusBadge({ status }: Props) {
  const normalized = status?.toLowerCase();

  const mapping: Record<
    string,
    { label: string; bg: string; border: string; glow: string }
  > = {
    pending: {
      label: "Đang chờ duyệt",
      bg: "bg-yellow-400/50",
      border: "border-yellow-500",
      glow: "shadow-[0_0_10px_rgba(234,179,8,0.6)]",
    },
    accepted: {
      label: "Đã duyệt",
      bg: "bg-green-500/50",
      border: "border-green-600",
      glow: "shadow-[0_0_10px_rgba(34,197,94,0.6)]",
    },
    rejected: {
      label: "Bị từ chối",
      bg: "bg-red-500/50",
      border: "border-red-600",
      glow: "shadow-[0_0_10px_rgba(239,68,68,0.6)]",
    },
  };

  const info =
    mapping[normalized!] ?? {
      label: "Chưa đăng ký",
      bg: "bg-gray-500",
      border: "border-gray-600",
      glow: "shadow-[0_0_10px_rgba(156,163,175,0.6)]",
    };

  return (
    <span
      className={`
        inline-block px-4 py-1.5 rounded-xl 
        text-white font-semibold text-sm
        border backdrop-blur-sm
        transition-all duration-300 
        ${info.bg} ${info.border} ${info.glow}
      `}
    >
      {info.label}
    </span>
  );
}
