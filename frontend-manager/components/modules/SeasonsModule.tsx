"use client";

import { useEffect, useState } from "react";
import { seasonApi, Season } from "@/lib/api/seasons";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";


import { useRouter } from "next/navigation";
import { applicationApi } from "@/lib/api/application";

// ===== Helper: Tính trạng thái mùa giải =====
function getSeasonStatus(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return "Không rõ";

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "Chưa bắt đầu";
  if (now > end) return "Kết thúc";
  return "Đang diễn ra";
}

export default function SeasonsModule() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

const [teamsCount, setTeamsCount] = useState<Record<number, number>>({});


  // ===== Fetch API =====
  async function loadSeasons() {
    try {
      setLoading(true);
      const res = await seasonApi.getAll();
      setSeasons(res.data);
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  const loadSeasons = async () => {
    try {
      setLoading(true);
      const res = await seasonApi.getAll();
      setSeasons(res.data);

      // Lấy số đội accepted cho từng season
      const counts: Record<number, number> = {};
      await Promise.all(
        res.data.map(async (s) => {
          const teamsRes = await applicationApi.getAcceptedTeamsBySeason(s.id);
          counts[s.id] = teamsRes.data.length; // số đội accepted
        })
      );
      setTeamsCount(counts);
    } finally {
      setLoading(false);
    }
  };

  loadSeasons();
}, []);

  // ===== FILTER =====
  const filtered = seasons.filter((s) => {
    const status = getSeasonStatus(s.startDate, s.endDate);

    return (
      s.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterStatus === "" || filterStatus === "all" || filterStatus === status)
    );
  });

  

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">
          Danh Sách Mùa Giải
        </h1>
        <p className="text-white/70">Quản lý các mùa giải trong hệ thống</p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 items-center mb-8">
        <Input
          placeholder="Tên mùa giải"
          className="w-64 shadow-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <Select onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 shadow-sm bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Tình Trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Đang diễn ra">Đang diễn ra</SelectItem>
            <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
            <SelectItem value="Kết thúc">Kết thúc</SelectItem>
          </SelectContent>
        </Select>

    
      </div>

      {/* TABLE */}
      <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md rounded-xl overflow-hidden">
        <CardHeader className="grid grid-cols-[2fr,1fr,1fr,1fr,0.7fr] px-6 py-4 font-semibold text-sm bg-white/10 border-b border-white/20">
          <div className="text-white">Tên Mùa Giải</div>
          <div className="text-white">Tình Trạng</div>
          <div className="text-white">Ngày Bắt Đầu</div>
          <div className="text-white">Ngày Kết Thúc</div>
          <div className="text-white">Số Đội</div>
        
        </CardHeader>

        <CardContent className="px-0">
          {loading && <p className="p-4 text-white/60">Đang tải...</p>}

          {!loading &&
            filtered.map((item) => {
              const status = getSeasonStatus(item.startDate, item.endDate);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr,1fr,1fr,1fr,0.7fr] px-6 py-4 items-center text-sm 
                    hover:bg-white/10 transition-colors border-b border-white/20 last:border-0  cursor-pointer"
                     onClick={() => router.push(`/season/${item.id}`)}
                >
                  <div
                    className="text-blue-300 font-medium hover:text-blue-200 hover:underline cursor-pointer"
                  >
                    {item.name}
                  </div>

                  <div >
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium border
                      ${
                        status === "Đang diễn ra"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : status === "Chưa bắt đầu"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="text-white/80 ">
                    {item.startDate?.slice(0, 10)}
                  </div>
                  <div className="text-white/80 " >
                    {item.endDate?.slice(0, 10)}
                  </div>

                  <div className="font-medium text-white/80"> {teamsCount[item.id] ?? 0}</div>

                
                </div>
              );
            })}
        </CardContent>
      </Card>


    </div>
  );
}
