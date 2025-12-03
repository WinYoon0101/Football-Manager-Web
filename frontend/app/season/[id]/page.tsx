"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { seasonApi } from "@/lib/api/seasons";
import {
  EllipsisVertical,
  Check,
  X,
  ChevronDown,
  CirclePlus,
  Trash,
  SquarePen,
  CalendarDays,
  ArrowLeft,
} from "lucide-react";
import { Application, MatchResult, Team } from "@/lib/types";
import { matchApi, resultApi } from "@/lib/api/matches";
import { teamsAPI } from "@/lib/api/teams";

import EditSeasonModal from "@/components/seasons/EditSeasonModal";
import DeleteSeasonModal from "@/components/seasons/DeleteSeasonModal";
import { Button } from "@/components/ui/button";
import { applicationApi } from "@/lib/api/application";

// ======================= TYPES =========================

type RegisterRequest = {
  id: number;
  name: string;
  founded: string;
  stadium: string;
  players: number;
  date: string;
  note: string;
};

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



// ========================================================

export default function SeasonDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const router = useRouter();

  const [season, setSeason] = useState<Season | null>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState("matches"); // matches | teams

  const [createMatchModal, setCreateMatchModal] = useState(false);
  const [homeTeam, setHomeTeam] = useState<number | null>(null);
  const [awayTeam, setAwayTeam] = useState<number | null>(null);
  const [round, setRound] = useState(1); // 1: lượt đi, 2: lượt về

  const [openMenuMatchId, setOpenMenuMatchId] = useState<number | null>(null);
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [deleteMatchId, setDeleteMatchId] = useState<number | null>(null);

  const [groupedMatches, setGroupedMatches] = useState<
    Record<string, MatchResult[]>
  >({});

  const [stadium, setStadium] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  const [applications, setApplications] = useState<Application[]>([]);

  const [matchTime, setMatchTime] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuMatchId(null);
    }

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Cập nhật sân khi đội nhà thay đổi
  useEffect(() => {
    if (!homeTeam) {
      setStadium("");
      return;
    }

    const team = teams.find((t) => t.id === homeTeam);
    setStadium(team?.homeStadium || "");
  }, [homeTeam, teams]);

  // Hàm định dạng ngày tháng
  function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

 

  const pageBackgroundStyle = {
    backgroundImage:
      'linear-gradient(rgba(8, 21, 56, 0.5), rgba(8, 21, 56, 0.55)), url("/bg.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  } as const;

  // ======================================
  // LOAD API
  // ======================================

  async function loadData() {
    try {
      setLoading(true);

      const [res, rankRes, matchRes, teamsRes, appsRes] = await Promise.all([
        seasonApi.getById(id),
        seasonApi.getRankings(id),
        resultApi.getResultsBySeason(id),
        teamsAPI.getAll(), // lấy tất cả teams
        applicationApi.getBySeason(id),
      ]);

      setTeams(teamsRes);

      setSeason(res.data);

      setApplications(appsRes.data); 

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

      // ================================
      // GROUP MATCHES BY ROUND (ĐÃ SỬA)
      // ================================
      const grouped: Record<number, MatchResult[]> = {};

      matchRes.data.forEach((m: MatchResult) => {
        const roundId = m.match.round.id;

        if (!grouped[roundId]) grouped[roundId] = [];
        grouped[roundId].push(m);
      });

      setGroupedMatches(grouped);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMatch() {
    if (!homeTeam || !awayTeam || !matchTime) return;

    try {
      const body = {
        roundId: round,
        team1Id: homeTeam,
        team2Id: awayTeam,
        matchTime: matchTime, // ISO string
        stadium: stadium || undefined,
        seasonId: id,
      };

      const res = await matchApi.create(body);

      console.log("Tạo trận đấu thành công:", res.data);

      // đóng modal
      setCreateMatchModal(false);

      // reset form
      setHomeTeam(null);
      setAwayTeam(null);
      setMatchTime("");
      setRound(1);

      // load lại danh sách trận
      loadData();
    } catch (err: any) {
      console.error("Lỗi tạo trận:", err);
      alert("Không tạo được trận đấu!");
    }
  }

  async function handleUpdateSeason(data: {
    name: string;
    startDate?: string;
    endDate?: string;
  }): Promise<void> {
    await seasonApi.update(id, {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    await loadData();
    setEditOpen(false);
  }

  async function handleDeleteSeason() {
    await seasonApi.delete(id);
    router.push("/"); // chuyển trang
  }

  const getRoundName = (id: number) => {
    if (id === 1) return "Vòng 1";
    if (id === 2) return "Vòng 2";
    return `Vòng ${id}`;
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const openDetail = (app: Application) => {
    setSelected(app);
    setModalOpen(true);
  };

  // ======================================
  // RENDER
  // ======================================

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

  return (
    <div className="w-full min-h-screen p-8" style={pageBackgroundStyle}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        {/* LEFT: Back + Title */}
    <div className="flex flex-col">
    {/* Back + Title (ngang) */}
    <div className="flex items-center gap-4 mb-2">
      <Button
        className="text-white border border-white/20"
        variant="ghost"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-5 w-5" />
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

        {/* RIGHT: Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-5 py-3 bg-white border rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-2"
          >
            <span className="font-medium text-gray-700">Quản lý</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow-xl w-56 py-2 animate-fadeIn z-20">
              <button
                onClick={() => {
                  setCreateMatchModal(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-100 transition"
              >
                <CirclePlus size={20} className="text-gray-600" />
                Tạo Trận Đấu
              </button>

              <button
                onClick={() => {
                  setEditOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-100 transition"
              >
                <SquarePen size={20} className="text-gray-600" />
                Sửa Giải Đấu
              </button>

              <button
                onClick={() => {
                  setDeleteOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-100 text-red-600 transition"
              >
                <Trash size={20} className="text-red-600" />
                Xóa Giải Đấu
              </button>
            </div>
          )}
        </div>
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
          Hãy tạo trận đấu để bắt đầu mùa giải
        </p>
        <button
          onClick={() => setCreateMatchModal(true)}
          className="px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 shadow"
        >
          + Tạo trận đấu
        </button>
      </div>
    ) : (
      Object.keys(groupedMatches)
        .map(Number)
        .sort((a, b) => a - b)
        .map((roundId) => (
          <div key={roundId}>
            {/* HEADER VÒNG */}
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
                        className="
            p-5 mb-5 rounded-2xl 
            bg-white/70 border border-blue-100 
            flex items-center justify-between 
            hover:bg-blue-50/40 transition cursor-pointer
            shadow-sm hover:shadow-md
          "
                      >
                        {/* TIME */}
                        <div className="w-[140px] text-left">
                          <div className="text-lg font-bold text-blue-700">
                            {new Date(m.match.matchTime).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(m.match.matchTime).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>

                        {/* HOME TEAM */}
                        <div className="flex items-center gap-3 w-[240px] justify-center">
                          <img
                            src={t1.image ?? TEAM_AVATAR(t1.name)}
                            className="w-10 h-10 rounded-full object-cover border border-blue-200"
                          />
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {t1.name}
                          </span>
                        </div>

                        {/* VS */}
                        <div className="text-center w-[40px] font-semibold text-blue-800">
                          VS
                        </div>

                        {/* AWAY TEAM */}
                        <div className="flex items-center gap-3 w-[240px] justify-center">
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {t2.name}
                          </span>
                          <img
                            src={t2.image ?? TEAM_AVATAR(t2.name)}
                            className="w-10 h-10 rounded-full object-cover border border-blue-200"
                          />
                        </div>

                        {/* SCORE */}
                        <div className="w-[110px] text-center text-xl font-bold text-gray-900">
                          {score}
                        </div>

                    
                        {/* MENU ICON */}
                        <div
                          className="relative"
                          ref={(el) => {
                            menuRefs.current[m.matchId] = el; // không return gì
                          }}
                        >
                          {/* BUTTON mở menu */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuMatchId(
                                openMenuMatchId === m.matchId ? null : m.matchId
                              );
                            }}
                            className="p-1 opacity-60 hover:opacity-100"
                          >
                            <EllipsisVertical
                              size={20}
                              className="text-blue-900"
                            />
                          </button>

                          {/* DROPDOWN */}
                          {openMenuMatchId === m.matchId && (
                            <div
                              className="absolute right-0 top-8 bg-white border rounded-xl shadow-xl w-40 py-2 z-30"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => {
                                  router.push(`/match/${m.matchId}`);
                                  setOpenMenuMatchId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                              >
                                Xem chi tiết
                              </button>

                              <button className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 cursor-not-allowed">
                                Xếp lịch
                              </button>

                              <button
                                onClick={() => setDeleteMatchId(m.matchId)}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                              >
                                Xóa
                              </button>
                            </div>
                          )}
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
            <h2 className="text-xl font-bold text-white mb-5">
              Bảng Xếp Hạng
            </h2>

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
                  {/* Rank badge premium */}
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

                  {/* Avatar + tên */}
                  <div className="flex items-center gap-3 flex-1 pl-4">
                    <img
                      src={item.image}
                      className="w-9 h-9 rounded-2xl object-cover border shadow-sm"
                    />
                    <div className="font-medium text-sm text-white">{item.team}</div>
                  </div>

                  {/* T-H-B */}
                  <div className="w-20 text-center text-sm text-white/90 font-medium">
                    {item.thb}
                  </div>

                  {/* Hiệu số */}
                  <div className="w-16 text-center text-sm font-semibold text-gray-200">
                    {item.hieu}
                  </div>

                  {/* Điểm */}
                  <div className="w-16 text-center text-lg font-extrabold text-blue-300">
                    {item.point}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REGISTER SECTION */}

          <div className="shadow-sm bg-white/20 border-white/20 rounded-2xl p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl text-white font-bold">Đơn Đăng Ký</h2>
    {/* Badge số lượng */}
    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
      {applications.length} đơn
    </span>
  </div>

  {/* LIST AREA (scrollable) */}
  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
    {applications.map((app) => (
      <div
        key={app.id}
        className="flex items-center gap-3 p-3 bg-white/30 rounded-xl hover:bg-white/50 transition cursor-pointer"
        onClick={() => openDetail(app)}
      >
        {app.team.image && (
          <img
            src={app.team.image}
            alt={app.team.name}
            className="w-12 h-12 rounded-full object-cover border border-white/30"
          />
        )}
        <div className="flex-1">
          <div className="font-semibold text-white">{app.team.name}</div>
          <div className="text-sm text-gray-200">
            Ngày đăng ký: {formatDate(app.dateSignin)}
          </div>
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
          {app.status === "pending" ? "Chờ duyệt" : "Đang xử lý"}
        </span>
      </div>
    ))}
  </div>

  {/* Button mở modal */}
  <button
    onClick={() => setModalOpen(true)}
    className="w-full mt-6 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 shadow transition"
  >
    Xem tất cả yêu cầu
  </button>
</div>
        </div>
      </div>

     {/* MODAL */}
{modalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className=" bg-white/80 w-full max-w-4xl rounded-3xl shadow-2xl grid grid-cols-2 overflow-hidden animate-fadeIn">
      
      {/* LEFT LIST */}
      <div className="border-r p-6 overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Đơn Chờ Xét Duyệt</h2>
        <div className="space-y-3">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => openDetail(app)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border bg-white/50 shadow-sm hover:shadow-md transition text-left ${
                selected?.id === app.id ? "bg-blue-50 border-blue-600" : ""
              }`}
            >
              {app.team.image && (
                <img
                  src={app.team.image}
                  alt={app.team.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{app.team.name}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(app.dateSignin)}
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                {app.status === "pending" ? "Chờ duyệt" : "Đang xử lý"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT DETAIL */}
      <div className="p-8 relative overflow-y-auto max-h-[80vh] flex flex-col items-center justify-center text-center">
        {/* Close button */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute right-6 top-6 text-gray-500 hover:text-black transition"
        >
          <X size={24} />
        </button>

        {selected ? (
          <>
            {selected.team.image && (
              <img
                src={selected.team.image}
                alt={selected.team.name}
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 mb-4"
              />
            )}
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{selected.team.name}</h2>

            <div className="space-y-2 text-gray-700 text-left">
              <p><b>Sân Nhà:</b> {selected.team.homeStadium ?? "Chưa có"}</p>
              <p><b>Số Cầu Thủ:</b> {selected.team.playerCount ?? "Chưa có"}</p>
              <p><b>Ngày Đăng Ký:</b> {new Date(selected.dateSignin).toLocaleDateString("vi-VN")}</p>
              <p><b>Trạng Thái:</b> {selected.status === "pending" ? "Chờ duyệt" : "Đang xử lý"}</p>
            </div>

            <div className="flex gap-4 mt-8 w-full justify-center">
              <button
                onClick={async () => {
                  await applicationApi.update(selected.id, { status: "accepted" });
                  setModalOpen(false);
                  loadData();
                }}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 shadow transition"
              >
                <Check size={18} /> Duyệt
              </button>

              <button
                onClick={async () => {
                  await applicationApi.update(selected.id, { status: "rejected" });
                  setModalOpen(false);
                  loadData();
                }}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 flex items-center justify-center gap-2 shadow transition"
              >
                <X size={18} /> Từ Chối
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400 italic mt-4">
            Chọn 1 đơn bên trái để xem chi tiết...
          </div>
        )}
      </div>

    </div>
  </div>
)}

      {/* MODAL TẠO TRẬN ĐẤU MỚI */}
      {createMatchModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[3px] flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-7 animate-scaleIn">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-7">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Tạo Trận Đấu Mới
              </h2>

              <button
                onClick={() => setCreateMatchModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <X className="text-gray-500 hover:text-gray-900" size={22} />
              </button>
            </div>

            {/* CHỌN ĐỘI */}
            <div className="grid grid-cols-2 gap-5 mb-4">
              {/* ĐỘI NHÀ */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Đội nhà
                </label>
                <select
                  className={`mt-1 w-full border rounded-xl p-3.5 bg-white transition 
        ${
          homeTeam !== null && homeTeam === awayTeam
            ? "border-red-500 bg-red-50"
            : "border-gray-200"
        }`}
                  value={homeTeam ?? ""}
                  onChange={(e) => setHomeTeam(Number(e.target.value))}
                >
                  <option value="">Chọn đội nhà</option>
                  {teams.map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                      disabled={awayTeam === t.id}
                    >
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ĐỘI KHÁCH */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Đội khách
                </label>
                <select
                  className={`mt-1 w-full border rounded-xl p-3.5 bg-white transition 
        ${
          awayTeam !== null && homeTeam === awayTeam
            ? "border-red-500 bg-red-50"
            : "border-gray-200"
        }`}
                  value={awayTeam ?? ""}
                  onChange={(e) => setAwayTeam(Number(e.target.value))}
                >
                  <option value="">Chọn đội khách</option>
                  {teams.map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                      disabled={homeTeam === t.id}
                    >
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SÂN VẬN ĐỘNG */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600">
                Sân vận động
              </label>
              <input
                type="text"
                value={stadium}
                disabled
                className="mt-1 w-full border border-gray-200 rounded-xl p-3.5 bg-gray-100 text-gray-600"
                placeholder="Sân vận động sẽ tự điền theo đội nhà"
              />
            </div>

            {/* CẢNH BÁO */}
            {homeTeam !== null && homeTeam === awayTeam && (
              <p className="text-red-500 text-sm mt-1 mb-4">
                ❌ Hai đội không được trùng nhau.
              </p>
            )}

            {/* NGÀY GIỜ */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600">
                Ngày giờ thi đấu
              </label>
              <input
                type="datetime-local"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>

            {/* VÒNG ĐẤU */}
            <div className="mb-7">
              <label className="text-sm font-medium text-gray-600">
                Vòng đấu
              </label>
              <select
                value={round}
                onChange={(e) => setRound(Number(e.target.value))}
                className="mt-1 w-full border border-gray-200 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value={1}>Vòng 1 (Lượt đi)</option>
                <option value={2}>Vòng 2 (Lượt về)</option>
              </select>
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleCreateMatch}
              disabled={
                homeTeam === awayTeam || homeTeam === null || awayTeam === null
              }
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all shadow-sm ${
                homeTeam === awayTeam || homeTeam === null || awayTeam === null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 shadow-lg"
              }`}
            >
              Tạo trận đấu
            </button>
          </div>
        </div>
      )}
      {/* MODAL XÓA TRẬN ĐẤU */}
      {deleteMatchId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xóa</h2>

            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa trận đấu này không?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteMatchId(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Hủy
              </button>

              <button
                onClick={async () => {
                  await matchApi.delete(deleteMatchId);
                  await loadData();
                  setDeleteMatchId(null);
                  setOpenMenuMatchId(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <EditSeasonModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        season={season}
        onSave={handleUpdateSeason}
      />

      <DeleteSeasonModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        seasonName={season?.name}
        onConfirm={handleDeleteSeason}
      />
    </div>
  );
}
