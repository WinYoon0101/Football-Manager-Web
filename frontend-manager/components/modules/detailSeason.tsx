"use client";

import { useState } from "react";
import { EllipsisVertical, Check, X } from "lucide-react";

export default function VLeaguePage() {
  type RegisterRequest = {
    id: number;
    name: string;
    founded: string;
    stadium: string;
    players: number;
    date: string;
    note: string;
  };

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<RegisterRequest | null>(null);

  const registerRequests: RegisterRequest[] = [
    {
      id: 1,
      name: "CLB Phú Thọ",
      founded: "2016-01-01",
      stadium: "SVĐ Phú Thọ",
      players: 24,
      date: "2024-02-10",
      note: "Xin tham gia V.League 2",
    },
    {
      id: 2,
      name: "Manh Quang FC",
      founded: "2018-04-21",
      stadium: "SVĐ Việt Trì",
      players: 22,
      date: "2024-02-12",
      note: "Đề nghị xem lại hồ sơ",
    },
  ];

  const openDetail = (item: RegisterRequest) => {
    setSelected(item);
    setModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8 flex gap-10">

      {/* LEFT AREA */}
      <div className="flex-1">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight drop-shadow-sm">
            Quản lý Giải Đấu V.League 1 – 2023/24
          </h1>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="px-5 py-3 bg-white shadow-md rounded-xl border border-gray-200 flex items-center gap-2 hover:bg-gray-50 transition"
            >
              Quản lý
              <EllipsisVertical size={20} className="text-gray-600" />
            </button>

            {open && (
              <div className="absolute right-0 top-14 bg-white border shadow-2xl rounded-xl w-60 z-20 overflow-hidden animate-fadeIn">
                {[
                  "Thêm Trận Đấu",
                  "Sửa Thông Tin Giải Đấu",     
                  "Xóa Giải Đấu",
                ].map((item, i) => (
                  <button
                    key={i}
                    className="w-full px-5 py-3 text-left hover:bg-gray-100 text-gray-700 font-medium border-b last:border-0 transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MATCH LIST */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
            Vòng 1
          </h2>

          {[
            { time: "18:00", date: "20/10/2023", home: "Hải Phòng", away: "HAGL", score: "1 - 1" },
            { time: "18:00", date: "21/10/2023", home: "Đông Á Thanh Hóa", away: "Hồng Lĩnh Hà Tĩnh", score: "2 - 4" },
            { time: "17:00", date: "22/10/2023", home: "SL Nghệ An", away: "Thể Công", score: "2 - 1" },
            { time: "18:00", date: "22/10/2023", home: "Nam Định", away: "Quảng Nam", score: "2 - 0" },
            { time: "19:15", date: "22/10/2023", home: "Bình Định", away: "Công an Hà Nội", score: "2 - 1" },
          ].map((m, i) => (
            <div
              key={i}
              className="mb-5 p-5 border border-gray-200 rounded-2xl bg-gray-50 shadow-sm hover:shadow-lg hover:bg-gray-100 transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {m.time} • {m.date}
                </div>

                <div className="text-xs text-gray-400">Trận {i + 1}</div>
              </div>

              <div className="text-center my-3 text-lg font-semibold text-gray-900">
                {m.home}
                <span className="mx-3 text-gray-500 font-normal">VS</span>
                {m.away}
              </div>

              <div className="text-center text-2xl font-extrabold text-blue-600">
                {m.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT AREA */}
      <div className="w-[380px] shrink-0 flex flex-col gap-8">

        {/* RANKING */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5 tracking-tight">
            Bảng Xếp Hạng
          </h2>

          <div className="space-y-3">
            {[
              { rank: 1, team: "Nam Định", thb: "1-0-0", hieu: "+2", point: 3 },
              { rank: 2, team: "Quảng Nam", thb: "1-0-0", hieu: "+2", point: 3 },
              { rank: 3, team: "SLNA", thb: "1-0-0", hieu: "+1", point: 3 },
              { rank: 4, team: "Bình Định", thb: "1-0-0", hieu: "+1", point: 3 },
              { rank: 5, team: "Thể Công", thb: "1-0-0", hieu: "+1", point: 3 },
              { rank: 6, team: "Hải Phòng", thb: "0-1-0", hieu: "0", point: 1 },
            ].map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between p-4 rounded-xl border bg-gray-50 hover:bg-gray-100 transition shadow-sm"
              >
                <div
                  className={`w-11 h-11 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-sm ${
                    item.rank === 1
                      ? "bg-yellow-500"
                      : item.rank === 2
                      ? "bg-gray-400"
                      : item.rank === 3
                      ? "bg-amber-700"
                      : "bg-gray-700"
                  }`}
                >
                  {item.rank}
                </div>

                <div className="flex-1 ml-4">
                  <div className="font-semibold text-gray-900">{item.team}</div>
                  <div className="text-xs text-gray-500">T-H-B: {item.thb}</div>
                </div>

                <div className="text-center w-14">
                  <div className="text-gray-700 text-sm">Hiệu</div>
                  <div className="font-bold">{item.hieu}</div>
                </div>

                <div className="text-center w-14">
                  <div className="text-gray-700 text-sm">Điểm</div>
                  <div className="text-xl font-extrabold text-blue-600">
                    {item.point}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REGISTER REQUEST */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Đơn Đăng Ký</h2>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            Có {registerRequests.length} đơn chờ xét duyệt
          </button>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl grid grid-cols-2 overflow-hidden">

            {/* LIST */}
            <div className="border-r p-6 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Đơn Chờ Xét Duyệt</h2>

              <div className="space-y-3">
                {registerRequests.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openDetail(item)}
                    className={`w-full text-left p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition ${
                      selected?.id === item.id ? "border-blue-600 bg-blue-50" : ""
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DETAIL */}
            <div className="p-6 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-black"
              >
                <X size={22} />
              </button>

              {selected ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{selected.name}</h2>

                  <div className="space-y-3 text-gray-700">
                    <p><b>Ngày Thành Lập:</b> {selected.founded}</p>
                    <p><b>Sân Nhà:</b> {selected.stadium}</p>
                    <p><b>Số Lượng Cầu Thủ:</b> {selected.players}</p>
                    <p><b>Ngày Đăng Ký:</b> {selected.date}</p>
                    <p><b>Ghi chú:</b> {selected.note}</p>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 shadow">
                      <Check size={18} /> Duyệt
                    </button>

                    <button className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 flex items-center justify-center gap-2 shadow">
                      <X size={18} /> Từ Chối
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 italic mt-10">
                  Chọn 1 đơn từ danh sách bên trái để xem chi tiết...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
