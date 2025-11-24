"use client";

import { useState } from "react";

type Season = {
  name: string;
  startDate?: string | null;
  endDate?: string | null;
};

type EditSeasonModalProps = {
  open: boolean;
  onClose: () => void;
  season: Season | null;
  onSave: (season: { name: string; startDate?: string; endDate?: string }) => void;
};

export default function EditSeasonModal({
  open,
  onClose,
  season,
  onSave,
}: EditSeasonModalProps) {
  const [name, setName] = useState<string>(season?.name || "");
  const [startDate, setStartDate] = useState<string>(
    season?.startDate?.slice(0, 10) || ""
  );
  const [endDate, setEndDate] = useState<string>(
    season?.endDate?.slice(0, 10) || ""
  );

  if (!open || !season) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-5">Sửa Giải Đấu</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên giải</label>
            <input
              className="w-full mt-1 p-3 border rounded-xl"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Ngày bắt đầu</label>
            <input
              type="date"
              className="w-full mt-1 p-3 border rounded-xl"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Ngày kết thúc</label>
            <input
              type="date"
              className="w-full mt-1 p-3 border rounded-xl"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 py-3 bg-gray-200 rounded-xl"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl"
            onClick={() =>
              onSave({
                name,
                startDate,
                endDate,
              })
            }
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
