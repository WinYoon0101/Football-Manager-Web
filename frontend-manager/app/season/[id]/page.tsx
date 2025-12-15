"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { seasonApi } from "@/lib/api/seasons";
import { applicationApi, Application } from "@/lib/api/application";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { MatchResult, Team } from "@/lib/types";
import { resultApi } from "@/lib/api/matches";
import { teamsAPI } from "@/lib/api/teams";
import { userApi } from "@/lib/api/user";
import { Button } from "@/components/ui/button";
import ApplicationModal from "@/components/application/ApplicationModal";
import StatusBadge from "@/components/application/StatusBadge";

// ======================= TYPES =========================
type Season = {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
};

type Ranking = {
  rank: number;
  team: string;
  image?: string;
  thb: string;
  hieu: number;
  point: number;
};

// Avatar khi không có image
const TEAM_AVATAR = (name: string) =>
  `https://api.dicebear.com/9.x/shapes/svg?seed=${name}`;

export default function SeasonDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [season, setSeason] = useState<Season | null>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userApplication, setUserApplication] = useState<Application | null>(null);
  const [groupedMatches, setGroupedMatches] = useState<Record<number, MatchResult[]>>({});
  const [teams, setTeams] = useState<Team[]>([]);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"apply" | "cancel" | null>(null);

  const pageBackgroundStyle = {
    backgroundImage:
      'linear-gradient(rgba(8, 21, 56, 0.5), rgba(8, 21, 56, 0.55)), url("/bg.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  } as const;


// Lấy user từ localStorage 
const loadUser = async () => {
  try {
    const raw = localStorage.getItem("user");

    if (!raw) {
      console.error("Chưa có user trong localStorage");
      return null;
    }

    const userObj = JSON.parse(raw);

    if (!userObj.id) {
      console.error("User không hợp lệ trong localStorage");
      return null;
    }


    setUser(userObj); // đặt thẳng từ localStorage
    console.log("Loaded User:", userObj);

    return userObj;
  } catch (err) {
    console.error("Lỗi lấy user:", err);
    return null;
  }
};


  // Load tất cả dữ liệu của trang
  const loadData = async () => {
    setLoading(true);
    try {
      // 1️⃣ Lấy user trước
      const currentUser = await loadUser();
      const userTeamId = currentUser?.teamId ?? null;
      console.log("Current User Team ID:", userTeamId);

      // 2️⃣ Fetch các dữ liệu khác song song
      const [res, rankRes, matchRes, teamsRes, appsRes] = await Promise.all([
        seasonApi.getById(id),
        seasonApi.getRankings(id),
        resultApi.getResultsBySeason(id),
        teamsAPI.getAll(),
        applicationApi.getAllBySeason(id),
      ]);

      setSeason(res.data);
      console.log("Season Data:", res.data);
      setTeams(teamsRes);



      // Xử lý bảng xếp hạng
      setRankings(
        (rankRes.data || []).map((item: any, index: number) => ({
          rank: index + 1,
          team: item.team?.name || "Unknown",
          image: item.team?.image || TEAM_AVATAR(item.team?.name),
          thb: `${item.win}-${item.draw}-${item.lose}`,
          hieu: item.goalDifference,
          point: item.points,
        }))
      );

      // Nhóm trận theo vòng
      const grouped: Record<number, MatchResult[]> = {};
      (matchRes.data || []).forEach((m: MatchResult) => {
        const roundId = m.match.round.id;
        if (!grouped[roundId]) grouped[roundId] = [];
        grouped[roundId].push(m);
      });
      setGroupedMatches(grouped);

      // Lấy application của team user
      if (userTeamId && appsRes.data) {
        const app = appsRes.data.find((a) => a.team.id === userTeamId);
        setUserApplication(app ?? null);
        console.log("User Application:", app ?? null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const openApplyModal = () => {
    setModalType("apply");
    setModalOpen(true);
  };

  const openCancelModal = () => {
    setModalType("cancel");
    setModalOpen(true);
  };

  const getRoundName = (id: number) => {
    if (id === 1) return "Vòng 1";
    if (id === 2) return "Vòng 2";
    return `Vòng ${id}`;
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen" style={pageBackgroundStyle}>
        <div className="min-h-screen bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Đang tải thông tin mùa giải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!season) {
    return (
      <div className="min-h-screen" style={pageBackgroundStyle}>
        <div className="min-h-screen bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy mùa giải</h1>
            <Button
              className="text-white border border-white/20"
              variant="ghost"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }


  // =====================
// KIỂM TRA MÙA GIẢI ĐÃ KẾT THÚC CHƯA
// =====================
const isSeasonEnded =
  season?.endDate
    ? new Date(season.endDate).getTime() < Date.now()
    : false;


  const userTeamId = user?.teamId ?? null;

  return (
    <div className="w-full min-h-screen p-8" style={pageBackgroundStyle}>
      {/* HEADER */}
     <div className="flex items-start justify-between mb-8">

  {/* LEFT GROUP: Back + Title + Date */}
  <div className="flex flex-col">
    {/* Back + Title (ngang) */}
    <div className="flex items-center gap-4 mb-2">
      <Button
        className="text-white border border-white/20"
        variant="ghost"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
        {season.name}
      </h1>
    </div>

    {/* DATE LINE (centered under the above group) */}
    <div className="flex justify-center w-full">
      <div className="flex items-center gap-2 text-gray-200 text-lg font-medium">
        <CalendarDays className="w-5 h-5 text-blue-800" />
        <span>
          {season.startDate &&
            new Date(season.startDate).toLocaleDateString("vi-VN")}{" "}
          –{" "}
          {season.endDate &&
            new Date(season.endDate).toLocaleDateString("vi-VN")}
        </span>
      </div>
    </div>
  </div>

  {/* RIGHT ACTION */}
  {user && (
    <div className="flex flex-col items-end gap-2">

      <div className="flex items-center gap-3">
        {userApplication && (
          <StatusBadge status={userApplication.status} />
        )}

        {userApplication?.status === "pending" && (
          <Button variant="destructive" onClick={openCancelModal}>
            Hủy đăng ký
          </Button>
        )}
      </div>

      {!userApplication && !isSeasonEnded && (
  <Button variant="default" onClick={openApplyModal}>
    Đăng ký tham gia
  </Button>
)}

{isSeasonEnded && (
  <div className="px-4 py-2 rounded-lg bg-gray-500/80 text-gray-200 text-sm font-semibold">
    Mùa giải đã kết thúc
  </div>
)}

    </div>
  )}

</div>


      {/* CONTENT AREA */}
      <div className="flex gap-10">
        {/* LEFT (MATCHES) */}
        <div className="flex-1">
          <div className="shadow-sm bg-white/20 border-white/20 text-white rounded-2xl p-7 flex flex-col items-center justify-center">
            {Object.keys(groupedMatches).length === 0 ? (
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  Chưa có trận đấu nào
                </h3>
                <p className="text-white/80 mb-6">
                  Hãy theo dõi các cập nhật từ ban tổ chức để biết thêm chi tiết về lịch thi đấu.
                </p>
              </div>
            ) : (
              Object.keys(groupedMatches)
                .map(Number)
                .sort((a, b) => a - b)
                .map((roundId) => (
                  <div key={roundId}>
                    <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-blue-800 rounded-xl shadow-sm">
                      
                      <h2 className="text-xl font-bold text-white tracking-wide">
                        {getRoundName(roundId)}
                      </h2>
                    </div>

                    {groupedMatches[roundId].map((m) => {
                      const t1 = m.match.team1;
                      const t2 = m.match.team2;
                      const score = `${m.team1Goals} - ${m.team2Goals}`;

                      return (
                        <div
                          key={m.matchId}
                          onClick={() => router.push(`/match/${m.matchId}`)}
                          className="p-5 mb-5 rounded-2xl bg-white/70 border border-blue-100 flex items-center justify-between hover:bg-blue-50/40 transition cursor-pointer shadow-sm hover:shadow-md"
                        >
                          {/* TIME */}
                          <div className="w-[140px] text-left">
                            <div className="text-lg font-bold text-blue-700">
                              {new Date(m.match.matchTime).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(m.match.matchTime).toLocaleDateString("vi-VN")}
                            </div>
                          </div>

                          {/* HOME TEAM */}
                          <div className="flex items-center gap-3 w-[250px] justify-center">
                            <img
                              src={t1.image ?? TEAM_AVATAR(t1.name)}
                              className="w-10 h-10 rounded-full object-cover border border-blue-200"
                            />
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {t1.name}
                            </span>
                          </div>

                          {/* VS */}
                          <div className="text-center w-[40px] font-semibold text-blue-800">VS</div>

                          {/* AWAY TEAM */}
                          <div className="flex items-center gap-3 w-[270px] justify-center">
                            <span className="text-sm font-medium text-gray-800 truncate">{t2.name}</span>
                            <img
                              src={t2.image ?? TEAM_AVATAR(t2.name)}
                              className="w-10 h-10 rounded-full object-cover border border-blue-200"
                            />
                          </div>

                          {/* SCORE */}
                          <div className="w-[110px] text-center text-xl font-bold text-gray-900">
                            {score}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* RIGHT AREA */}
        <div className="w-[480px] shrink-0 flex flex-col gap-8">
          {/* RANKING */}
          <div className="shadow-sm bg-white/20 border-white/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-5">Bảng Xếp Hạng</h2>

            {/* Header */}
            <div className="flex items-center px-4 py-2 text-xs font-semibold text-white/80 border-b">
              <div className="w-12">Rank</div>
              <div className="flex-1 pl-3">Đội</div>
              <div className="w-20 text-center">T-H-B</div>
              <div className="w-16 text-center">+/-</div>
              <div className="w-16 text-center">Điểm</div>
            </div>

            <div className="mt-1 divide-y">
              {rankings.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center px-4 py-3 group hover:bg-gray-400 transition-colors"
                >
                  <div
                    className={`w-10 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold
                    ${
                      item.rank === 1
                        ? "bg-yellow-500"
                        : item.rank === 2
                        ? "bg-gray-400"
                        : item.rank === 3
                        ? "bg-amber-700"
                        : "bg-gray-600"
                    }`}
                  >
                    {item.rank}
                  </div>

                  <div className="flex items-center gap-3 flex-1 pl-4">
                    <img
                      src={item.image}
                      className="w-9 h-9 rounded-2xl object-cover border shadow-sm"
                    />
                    <div className="font-medium text-sm text-white">{item.team}</div>
                  </div>

                  <div className="w-20 text-center text-sm text-white/90 font-medium">{item.thb}</div>
                  <div className="w-16 text-center text-sm font-semibold text-gray-200">{item.hieu}</div>
                  <div className="w-16 text-center text-lg font-extrabold text-blue-300">{item.point}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* APPLICATION MODAL */}
      {modalOpen && modalType && user && (
        <ApplicationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={modalType}
          userTeamId={userTeamId}
          currentSeasonId={id}
          userApplication={userApplication || undefined}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
