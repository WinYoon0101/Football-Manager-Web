"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, TrendingUp, Target, BarChart3 } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { Team, Match, Season } from "@/lib/types"

interface OverviewModuleProps {
  teams: Team[]
  matches: Match[]
  seasons: Season[]
}

export default function OverviewModule({ teams, matches, seasons }: OverviewModuleProps) {
  const totalTeams = teams.length
  const totalPlayers = teams.reduce((acc, team) => acc + team.players.length, 0)
  const completedMatches = matches.filter((m) => m.status === "completed").length
  const upcomingMatches = matches.filter((m) => m.status === "scheduled").length

  const seasonData = [
    { name: "Năm 4tl Mùa", value: completedMatches, color: "#10b981" },
    { name: "Năm 3tl Mùa", value: Math.floor(completedMatches * 0.8), color: "#f59e0b" },
    { name: "Lần 1tl Mùa", value: Math.floor(completedMatches * 0.5), color: "#3b82f6" },
  ]

  const goalsData = [
    { month: "T1", goals: 12 },
    { month: "T2", goals: 19 },
    { month: "T3", goals: 15 },
    { month: "T4", goals: 25 },
    { month: "T5", goals: 22 },
    { month: "T6", goals: 30 },
  ]

  const teamPerformance = teams.slice(0, 5).map((team) => ({
    name: team.name.split(" ")[0],
    wins: Math.floor(Math.random() * 10 + 5),
    draws: Math.floor(Math.random() * 5 + 2),
    losses: Math.floor(Math.random() * 5),
  }))

  const matchTrend = [
    { week: "Tuần 1", matches: 4 },
    { week: "Tuần 2", matches: 6 },
    { week: "Tuần 3", matches: 5 },
    { week: "Tuần 4", matches: 8 },
    { week: "Tuần 5", matches: 7 },
    { week: "Tuần 6", matches: 9 },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Trophy className="h-6 w-6" />
              </div>
              <TrendingUp className="h-5 w-5 text-white/80" />
            </div>
            <div className="text-4xl font-bold mb-2">{totalTeams}</div>
            <div className="text-sm text-white/90 font-medium">Số Đội Tham Gia</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
              <Target className="h-5 w-5 text-white/80" />
            </div>
            <div className="text-4xl font-bold mb-2">{totalPlayers}</div>
            <div className="text-sm text-white/90 font-medium">Tổng Cầu Thủ</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">+{completedMatches * 3} bàn</div>
            </div>
            <div className="text-4xl font-bold mb-2">{completedMatches}</div>
            <div className="text-sm text-white/90 font-medium">Trận Đã Diễn Ra</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="text-xs bg-white/20 px-2 py-1 rounded-full">Sắp tới</div>
            </div>
            <div className="text-4xl font-bold mb-2">{upcomingMatches}</div>
            <div className="text-sm text-white/90 font-medium">Trận Sắp Đấu</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Season Overview Donut Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              Tổng Quan Các Mùa Giải
            </CardTitle>
            <CardDescription>Phân bố trận đấu theo mùa</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={seasonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {seasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {seasonData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goals Trend Area Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              Xu Hướng Bàn Thắng
            </CardTitle>
            <CardDescription>Số bàn thắng theo tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={goalsData}>
                <defs>
                  <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="goals"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGoals)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Match Trend Line Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
              Lượng Trận Đấu
            </CardTitle>
            <CardDescription>Số trận đấu theo tuần</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={matchTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="matches"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance Bar Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
              Thành Tích Đội Bóng
            </CardTitle>
            <CardDescription>So sánh thắng - hòa - thua</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="wins" fill="#10b981" name="Thắng" radius={[4, 4, 0, 0]} />
                <Bar dataKey="draws" fill="#f59e0b" name="Hòa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" fill="#ef4444" name="Thua" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Match Schedule */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
              Lịch Thi Đấu Sắp Tới
            </CardTitle>
            <CardDescription>Các trận đấu trong tuần này</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matches.slice(0, 5).map((match) => {
                const homeTeam = teams.find((t) => t.id === match.homeTeamId)
                const awayTeam = teams.find((t) => t.id === match.awayTeamId)
                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">{homeTeam?.name.charAt(0)}</span>
                      </div>
                      <div className="text-center px-3">
                        <span className="text-xs font-semibold text-gray-500">VS</span>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-white">{awayTeam?.name.charAt(0)}</span>
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-semibold text-gray-900">
                          {homeTeam?.name.split(" ")[0]} vs {awayTeam?.name.split(" ")[0]}
                        </div>
                        <div className="text-xs text-muted-foreground">Vòng {match.round}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{match.date}</div>
                      <div className="text-xs text-muted-foreground">
                        {match.status === "completed" ? "Đã kết thúc" : "19:00"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Standings Table */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-full"></div>
            Bảng Xếp Hạng
          </CardTitle>
          <CardDescription>Top đội bóng dẫn đầu giải đấu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teams.slice(0, 5).map((team, index) => {
              const points = 30 - index * 3
              const wins = 10 - index
              const draws = 2
              const losses = index
              return (
                <div
                  key={team.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400"
                      : index === 1
                        ? "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300"
                        : index === 2
                          ? "bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300"
                          : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                          : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                            : index === 2
                              ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                              : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                      <span className="text-sm font-bold text-gray-700">{team.name.substring(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{team.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {wins}T - {draws}H - {losses}B
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded flex items-center justify-center ${
                            i < wins ? "bg-green-500" : i < wins + draws ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        >
                          <span className="text-xs text-white font-bold">
                            {i < wins ? "T" : i < wins + draws ? "H" : "B"}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="text-right min-w-[60px]">
                      <div className="text-2xl font-bold text-gray-900">{points}</div>
                      <div className="text-xs text-muted-foreground">điểm</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
