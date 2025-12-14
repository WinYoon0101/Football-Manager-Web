"use client";

import { useState } from "react";
import { Calendar, X } from "lucide-react";

interface TeamInfo {
  name: string;
  image?: string | null;
}

interface ScheduleMatchFormProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  matchTime?: string;
  onSubmit: (matchTime: string) => void;
  onClose: () => void;
}

export default function ScheduleMatchForm({
  homeTeam,
  awayTeam,
  matchTime,
  onSubmit,
  onClose,
}: ScheduleMatchFormProps) {

  const toLocalDatetime = (date: string | Date) => {
  const d = new Date(date);
  const tzOffset = d.getTimezoneOffset() * 60000; // offset tính bằng ms
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
};

// Trong useState:
const [time, setTime] = useState(matchTime ? toLocalDatetime(matchTime) : "");

  const handleSubmit = () => {
    if (!time) return;
    onSubmit(time);
  };

  return (
    <div className="bg-neutral-900 text-white rounded-2xl p-6 w-full max-w-xl shadow-2xl border border-white/10 relative">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold tracking-wide">
          📅 Xếp lịch thi đấu
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* TEAMS */}
<div className="flex items-center justify-center mb-8 px-6 gap-6">
  <div className="flex flex-col items-center gap-2">
    <img
      src={homeTeam.image ?? "/team-placeholder.png"}
      alt={homeTeam.name}
      className="w-14 h-14 rounded-full object-cover border border-white/20"
    />
    <span className="text-sm font-medium text-gray-200 text-center">
      {homeTeam.name}
    </span>
  </div>

  <span className="text-xl font-extrabold text-gray-400">VS</span>

  <div className="flex flex-col items-center gap-2">
    <img
      src={awayTeam.image ?? "/team-placeholder.png"}
      alt={awayTeam.name}
      className="w-14 h-14 rounded-full object-cover border border-white/20"
    />
    <span className="text-sm font-medium text-gray-200 text-center">
      {awayTeam.name}
    </span>
  </div>
</div>


      {/* TIME PICKER */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Thời gian thi đấu
        </label>

        <div className="relative">
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl bg-white/80 border border-neutral-700
                       px-4 py-3 pr-5 text-black
                       focus:ring-2 focus:ring-sky-600 outline-none"
          />
        
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl font-semibold
                     bg-neutral-700 hover:bg-neutral-600 transition"
        >
          Hủy
        </button>

        <button
          onClick={handleSubmit}
          disabled={!time}
          className="flex-1 py-3 rounded-xl font-semibold text-white
                     bg-blue-600 hover:bg-blue-700 transition
                     disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}
