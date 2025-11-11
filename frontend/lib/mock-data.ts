// ============================
// ⚽ MOCK DATA — FOOTBALL LEAGUE MANAGER
// ============================

import type { Team, Match, Regulation, Season, User } from "./types"

// --- Quy định mặc định ---
export const defaultRegulation: Regulation = {
  id: "reg-default",
  name: "Quy Định Chuẩn",
  minAge: 16,
  maxAge: 40,
  minPlayers: 15,
  maxPlayers: 22,
  maxForeignPlayers: 3,
  goalTypes: 3,
  matchDuration: 90,
  winPoints: 3,
  drawPoints: 1,
  lossPoints: 0,
  rankingPriority: ["points", "goalDiff", "goalsFor"],
}

// --- Danh sách quy định đã lưu ---
export const savedRegulations: Regulation[] = [
  {
    id: "reg-1",
    name: "Quy Định Chuẩn",
    minAge: 16,
    maxAge: 40,
    minPlayers: 15,
    maxPlayers: 22,
    maxForeignPlayers: 3,
    goalTypes: 3,
    matchDuration: 90,
    winPoints: 3,
    drawPoints: 1,
    lossPoints: 0,
    rankingPriority: ["points", "goalDiff", "goalsFor"],
  },
  {
    id: "reg-2",
    name: "Quy Định Thanh Thiếu Niên",
    minAge: 12,
    maxAge: 18,
    minPlayers: 12,
    maxPlayers: 18,
    maxForeignPlayers: 1,
    goalTypes: 3,
    matchDuration: 80,
    winPoints: 3,
    drawPoints: 1,
    lossPoints: 0,
    rankingPriority: ["points", "goalDiff", "goalsFor"],
  },
]

// --- Danh sách đội bóng ---
export const mockTeams: Team[] = [
  {
    id: "team-1",
    name: "Hà Nội FC",
    city: "Hà Nội",
    players: [
      { id: "p1", name: "Nguyễn Văn A", age: 28, type: "domestic", teamId: "team-1", jerseyNumber: 1 },
      { id: "p2", name: "Trần Văn B", age: 25, type: "domestic", teamId: "team-1", jerseyNumber: 7 },
      { id: "p3", name: "João Silva", age: 32, type: "foreign", teamId: "team-1", jerseyNumber: 9 },
    ],
  },
  {
    id: "team-2",
    name: "TP Hồ Chí Minh United",
    city: "TP Hồ Chí Minh",
    players: [
      { id: "p4", name: "Lê Văn C", age: 27, type: "domestic", teamId: "team-2", jerseyNumber: 1 },
      { id: "p5", name: "Phạm Văn D", age: 24, type: "domestic", teamId: "team-2", jerseyNumber: 10 },
      { id: "p6", name: "Carlos Rodriguez", age: 29, type: "foreign", teamId: "team-2", jerseyNumber: 8 },
    ],
  },
  {
    id: "team-3",
    name: "Đà Nẵng Anh Đào",
    city: "Đà Nẵng",
    players: [
      { id: "p7", name: "Hoàng Văn E", age: 26, type: "domestic", teamId: "team-3", jerseyNumber: 1 },
      { id: "p8", name: "Dương Văn F", age: 23, type: "domestic", teamId: "team-3", jerseyNumber: 11 },
      { id: "p9", name: "Marco Rossi", age: 31, type: "foreign", teamId: "team-3", jerseyNumber: 7 },
    ],
  },
  {
    id: "team-4",
    name: "Becamex Bình Dương",
    city: "Bình Dương",
    players: [],
  },
]

// --- Danh sách trận đấu ---
export const mockMatches: Match[] = [
  {
    id: "match-1",
    seasonId: "season-3",
    homeTeamId: "team-1",
    awayTeamId: "team-2",
    homeTeam: "Hà Nội FC",
    awayTeam: "TP Hồ Chí Minh United",
    round: 1,
    homeScore: 2,
    awayScore: 1,
    status: "completed",
    date: "2025-01-10",
    time: "18:00",
    venue: "Sân Gia Lai",
    goals: [
      { id: "g1", matchId: "match-1", scorerId: "p2", teamId: "team-1", goalType: "A", minute: 15 },
      { id: "g2", matchId: "match-1", scorerId: "p3", teamId: "team-1", goalType: "B", minute: 42 },
      { id: "g3", matchId: "match-1", scorerId: "p5", teamId: "team-2", goalType: "A", minute: 67 },
    ],
  },
  {
    id: "match-2",
    seasonId: "season-3",
    homeTeamId: "team-3",
    awayTeamId: "team-1",
    homeTeam: "Đà Nẵng Anh Đào",
    awayTeam: "Hà Nội FC",
    round: 1,
    homeScore: 1,
    awayScore: 1,
    status: "completed",
    date: "2025-01-11",
    time: "17:00",
    venue: "Sân Hòa Xuân",
    goals: [
      { id: "g4", matchId: "match-2", scorerId: "p9", teamId: "team-3", goalType: "C", minute: 28 },
      { id: "g5", matchId: "match-2", scorerId: "p1", teamId: "team-1", goalType: "A", minute: 55 },
    ],
  },
]

// --- Danh sách mùa giải ---
export const mockSeasons: Season[] = [
  {
    id: "season-1",
    name: "Giải bóng đá hạng Nhất Quốc gia",
    status: "not-started",
    startDate: "2026-03-05",
    endDate: "2026-12-01",
    teamCount: 11,
    registrations: [],
  },
  {
    id: "season-2",
    name: "Giải bóng đá A1 toàn quốc",
    status: "ongoing",
    startDate: "2024-03-05",
    endDate: "2024-12-01",
    teamCount: 14,
    registrations: [],
  },
  {
    id: "season-3",
    name: "NIGHT WOLF V.LEAGUE 1 - 2023/24",
    status: "ongoing",
    startDate: "2023-10-20",
    endDate: "2024-06-30",
    teamCount: 14,
    registrations: [
      {
        id: "reg-1",
        seasonId: "season-3",
        teamId: "team-4",
        teamName: "Becamex Bình Dương",
        submittedDate: "2023-09-15",
        status: "pending",
      },
    ],
  },
]

// --- Danh sách người dùng ---
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Admin",
    email: "admin@football.vn",
    role: "admin",
    username: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-01",
  },
  {
    id: "user-2",
    name: "Trần Thị B",
    email: "manager@football.vn",
    role: "manager",
    username: "manager",
    createdAt: "2024-01-15",
  },
  {
    id: "user-3",
    name: "Lê Văn A",
    email: "quanly@football.vn",
    role: "manager",
    username: "quanly",
    createdAt: "2024-02-01",
  },
]
