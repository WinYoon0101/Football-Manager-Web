"use client";

import { useState } from "react";
import { applicationApi, Application } from "@/lib/api/application";
import { X, AlertCircle, CheckCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "apply" | "cancel";
  userTeamId?: number;       // chỉ cần khi apply
  currentSeasonId?: number;  // chỉ cần khi apply
  userApplication?: Application; // chỉ cần khi cancel
  onSuccess: () => void;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  type,
  userTeamId,
  currentSeasonId,
  userApplication,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = async () => {
    setLoading(true);
    setError(null);

    try {
      if (type === "apply") {
        if (!userTeamId || !currentSeasonId) throw new Error("Missing team or season id");
        await applicationApi.create({
          teamId: userTeamId,
          seasonId: currentSeasonId,
          status: "pending",
        });
      } else if (type === "cancel") {
        if (!userApplication) throw new Error("Missing application");
        await applicationApi.delete(userApplication.id);
      }

      onSuccess();
      onClose();
    } catch (e: any) {
      console.error(e);
      setError(type === "apply"
        ? "Không thể đăng ký. Vui lòng thử lại."
        : "Không thể hủy đăng ký. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const title = type === "apply" ? "Đăng ký tham gia mùa giải" : "Hủy đăng ký";
  const description =
    type === "apply"
      ? "Bạn có chắc muốn đăng ký cho đội bóng của mình vào mùa giải hiện tại?"
      : "Bạn có chắc muốn hủy đăng ký tham gia mùa giải này không?";
  const icon = type === "apply" ? <AlertCircle className="w-12 h-12 text-blue-500" /> : <CheckCircle className="w-12 h-12 text-red-500" />;
  const actionText = type === "apply" ? "Xác nhận đăng ký" : "Xác nhận hủy";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-scaleIn">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        {/* ICON */}
        <div className="flex justify-center mb-4">{icon}</div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-3 text-white">{title}</h2>

        {/* DESCRIPTION */}
        <p className="text-center text-gray-200 mb-6">{description}</p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 text-sm px-4 py-2 rounded mb-4">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAction}
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 p-3 rounded-xl font-semibold text-white transition
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading && (
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}
            {loading ? (type === "apply" ? "Đang đăng ký..." : "Đang hủy...") : actionText}
          </button>

         
        </div>
      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
