"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, ArrowLeft, Check, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Season, Team, Match } from "@/lib/types"

interface SeasonsModuleProps {
  seasons: Season[]
  setSeasons: (seasons: Season[]) => void
  teams: Team[]
  matches: Match[]
  setMatches: (matches: Match[]) => void
}

export default function SeasonsModule({ seasons, setSeasons, teams, matches, setMatches }: SeasonsModuleProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newSeason, setNewSeason] = useState({ name: "", startDate: "", endDate: "", maxTeams: "" })

  const savedRegulations = [
    { id: "reg-1", name: "Quy Định Chuẩn" },
    { id: "reg-2", name: "Quy Định Thanh Thiếu Niên" },
    { id: "reg-3", name: "Quy Định Chuyên Nghiệp" },
  ]

  const filteredSeasons = seasons.filter((season) => {
    const matchesSearch = season.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || season.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = (seasonId: string) => {
    if (confirm("Bạn có chắc muốn xóa mùa giải này?")) {
      setSeasons(seasons.filter((s) => s.id !== seasonId))
    }
  }

  const handleAddSeason = () => {
    if (!newSeason.name || !newSeason.startDate || !newSeason.endDate || !newSeason.maxTeams) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }
    const season: Season = {
      id: `season-${Date.now()}`,
      name: newSeason.name,
      startDate: newSeason.startDate,
      endDate: newSeason.endDate,
      status: "not-started",
      teamCount: 0,
      maxTeams: Number.parseInt(newSeason.maxTeams),
      regulationId: undefined,
      registrations: [],
    }
    setSeasons([...seasons, season])
    setNewSeason({ name: "", startDate: "", endDate: "", maxTeams: "" })
    setShowAddDialog(false)
  }

  if (selectedSeason) {
    return (
      <SeasonDetailView
        season={selectedSeason}
        seasons={seasons}
        setSeasons={setSeasons}
        teams={teams}
        matches={matches}
        setMatches={setMatches}
        onBack={() => setSelectedSeason(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nhập tên mùa giải..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="not-started">Chưa bắt đầu</SelectItem>
              <SelectItem value="ongoing">Đang diễn ra</SelectItem>
              <SelectItem value="completed">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            Xuất Dữ Liệu
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm Mùa Giải
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Mùa Giải Mới</DialogTitle>
                <DialogDescription>Nhập thông tin mùa giải</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Tên Mùa Giải *</Label>
                  <Input
                    value={newSeason.name}
                    onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
                    placeholder="Ví dụ: V.LEAGUE 1 - 2025/26"
                  />
                </div>
                <div>
                  <Label>Ngày Bắt Đầu *</Label>
                  <Input
                    type="date"
                    value={newSeason.startDate}
                    onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Ngày Kết Thúc *</Label>
                  <Input
                    type="date"
                    value={newSeason.endDate}
                    onChange={(e) => setNewSeason({ ...newSeason, endDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Số Đội Tham Gia *</Label>
                  <Input
                    type="number"
                    value={newSeason.maxTeams}
                    onChange={(e) => setNewSeason({ ...newSeason, maxTeams: e.target.value })}
                    placeholder="Nhập số đội tham gia"
                    min="2"
                  />
                </div>
                <Button onClick={handleAddSeason} className="w-full">
                  Thêm Mùa Giải
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Seasons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Mùa Giải</CardTitle>
          <CardDescription>Quản lý các mùa giải bóng đá</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Mùa Giải</TableHead>
                <TableHead>Tình Trạng</TableHead>
                <TableHead>Ngày Bắt Đầu</TableHead>
                <TableHead>Ngày Kết Thúc</TableHead>
                <TableHead>Số Đội</TableHead>
                <TableHead className="text-right">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSeasons.map((season) => (
                <TableRow
                  key={season.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedSeason(season)}
                >
                  <TableCell className="font-medium">{season.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        season.status === "completed"
                          ? "secondary"
                          : season.status === "ongoing"
                            ? "default"
                            : "outline"
                      }
                    >
                      {season.status === "completed"
                        ? "Đã kết thúc"
                        : season.status === "ongoing"
                          ? "Đang diễn ra"
                          : "Chưa bắt đầu"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(season.startDate).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{new Date(season.endDate).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{season.teamCount || 0}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedSeason(season)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem Chi Tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(season.id)
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function SeasonDetailView({
  season,
  seasons,
  setSeasons,
  teams,
  matches,
  setMatches,
  onBack,
}: {
  season: Season
  seasons: Season[]
  setSeasons: (seasons: Season[]) => void
  teams: Team[]
  matches: Match[]
  setMatches: (matches: Match[]) => void
  onBack: () => void
}) {
  const [activeTab, setActiveTab] = useState<"matches" | "standings" | "registrations">("matches")
  const [showAddMatchDialog, setShowAddMatchDialog] = useState(false)
  const [showMatchDetailDialog, setShowMatchDetailDialog] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [newMatch, setNewMatch] = useState({
    homeTeamId: "",
    awayTeamId: "",
    date: "",
    time: "",
    round: "1",
    venue: "",
  })
  const [goalForm, setGoalForm] = useState({ teamId: "", scorerId: "", minute: "", goalType: "A" as "A" | "B" | "C" })
  const [matchInfoType, setMatchInfoType] = useState<"goal" | "foul">("goal")
  const [foulForm, setFoulForm] = useState({
    teamId: "",
    playerId: "",
    minute: "",
    foulType: "yellow" as "yellow" | "red",
  })

  const seasonMatches = matches.filter((m) => m.seasonId === season.id)

  const handleAddMatch = () => {
    if (!newMatch.homeTeamId || !newMatch.awayTeamId || !newMatch.date || !newMatch.time) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }
    const homeTeam = teams.find((t) => t.id === newMatch.homeTeamId)
    const awayTeam = teams.find((t) => t.id === newMatch.awayTeamId)

    const match: Match = {
      id: `match-${Date.now()}`,
      seasonId: season.id,
      homeTeamId: newMatch.homeTeamId,
      awayTeamId: newMatch.awayTeamId,
      homeTeam: homeTeam?.name,
      awayTeam: awayTeam?.name,
      round: Number.parseInt(newMatch.round),
      status: "scheduled",
      date: newMatch.date,
      time: newMatch.time,
      venue: newMatch.venue,
      goals: [],
      fouls: [],
    }
    setMatches([...matches, match])
    setNewMatch({ homeTeamId: "", awayTeamId: "", date: "", time: "", round: "1", venue: "" })
    setShowAddMatchDialog(false)
  }

  const handleAddGoal = () => {
    if (!selectedMatch || !goalForm.teamId || !goalForm.scorerId || !goalForm.minute) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    const goal = {
      id: `goal-${Date.now()}`,
      matchId: selectedMatch.id,
      scorerId: goalForm.scorerId,
      teamId: goalForm.teamId,
      goalType: goalForm.goalType,
      minute: Number.parseInt(goalForm.minute),
    }

    const updatedMatch = {
      ...selectedMatch,
      goals: [...selectedMatch.goals, goal],
      homeScore: [...selectedMatch.goals, goal].filter((g) => g.teamId === selectedMatch.homeTeamId).length,
      awayScore: [...selectedMatch.goals, goal].filter((g) => g.teamId === selectedMatch.awayTeamId).length,
      status: "completed" as const,
    }

    setMatches(matches.map((m) => (m.id === selectedMatch.id ? updatedMatch : m)))
    setSelectedMatch(updatedMatch)
    setGoalForm({ teamId: "", scorerId: "", minute: "", goalType: "A" })
  }

  const handleAddFoul = () => {
    if (!selectedMatch || !foulForm.teamId || !foulForm.playerId || !foulForm.minute) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    const foul = {
      id: `foul-${Date.now()}`,
      matchId: selectedMatch.id,
      playerId: foulForm.playerId,
      teamId: foulForm.teamId,
      foulType: foulForm.foulType,
      minute: Number.parseInt(foulForm.minute),
    }

    const updatedMatch = {
      ...selectedMatch,
      fouls: [...(selectedMatch.fouls || []), foul],
    }

    setMatches(matches.map((m) => (m.id === selectedMatch.id ? updatedMatch : m)))
    setSelectedMatch(updatedMatch)
    setFoulForm({ teamId: "", playerId: "", minute: "", foulType: "yellow" })
  }

  const handleApproveRegistration = (regId: string) => {
    setSeasons(
      seasons.map((s) =>
        s.id === season.id
          ? {
              ...s,
              registrations: s.registrations.map((r) => (r.id === regId ? { ...r, status: "approved" as const } : r)),
            }
          : s,
      ),
    )
  }

  const handleRejectRegistration = (regId: string) => {
    setSeasons(
      seasons.map((s) =>
        s.id === season.id
          ? {
              ...s,
              registrations: s.registrations.map((r) => (r.id === regId ? { ...r, status: "rejected" as const } : r)),
            }
          : s,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        Quay Lại
      </Button>

      {/* Season Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{season.name}</CardTitle>
              <CardDescription className="mt-2">
                {new Date(season.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(season.endDate).toLocaleDateString("vi-VN")}
              </CardDescription>
            </div>
            <Badge
              variant={
                season.status === "completed" ? "secondary" : season.status === "ongoing" ? "default" : "outline"
              }
            >
              {season.status === "completed"
                ? "Đã kết thúc"
                : season.status === "ongoing"
                  ? "Đang diễn ra"
                  : "Chưa bắt đầu"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "matches" ? "default" : "ghost"}
          onClick={() => setActiveTab("matches")}
          className="rounded-b-none"
        >
          Trận Đấu
        </Button>
        <Button
          variant={activeTab === "standings" ? "default" : "ghost"}
          onClick={() => setActiveTab("standings")}
          className="rounded-b-none"
        >
          Bảng Xếp Hạng
        </Button>
        <Button
          variant={activeTab === "registrations" ? "default" : "ghost"}
          onClick={() => setActiveTab("registrations")}
          className="rounded-b-none"
        >
          Đơn Đăng Ký
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "matches" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh Sách Trận Đấu</CardTitle>
                <CardDescription>{seasonMatches.length} trận đấu</CardDescription>
              </div>
              <Dialog open={showAddMatchDialog} onOpenChange={setShowAddMatchDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tạo Trận Đấu Mới
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tạo Trận Đấu Mới</DialogTitle>
                    <DialogDescription>Nhập thông tin trận đấu</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Giải Đấu</Label>
                      <Input value={season.name} disabled />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Chọn 2 đội đấu *</Label>
                        <Select
                          value={newMatch.homeTeamId}
                          onValueChange={(v) => setNewMatch({ ...newMatch, homeTeamId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Đội nhà" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="invisible">vs</Label>
                        <Select
                          value={newMatch.awayTeamId}
                          onValueChange={(v) => setNewMatch({ ...newMatch, awayTeamId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Đội khách" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Thời Gian Thi Đấu *</Label>
                      <Input
                        type="datetime-local"
                        value={newMatch.date ? `${newMatch.date}T${newMatch.time || "00:00"}` : ""}
                        onChange={(e) => {
                          const [date, time] = e.target.value.split("T")
                          setNewMatch({ ...newMatch, date, time })
                        }}
                      />
                    </div>
                    <div>
                      <Label>Vòng Đấu *</Label>
                      <Input
                        type="number"
                        value={newMatch.round}
                        onChange={(e) => setNewMatch({ ...newMatch, round: e.target.value })}
                        placeholder="Nhập số vòng"
                      />
                    </div>
                    <div>
                      <Label>Sân Vận Động</Label>
                      <Input
                        value={newMatch.venue}
                        onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                        placeholder="Nhập tên sân"
                      />
                    </div>
                    <Button onClick={handleAddMatch} className="w-full">
                      Submit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seasonMatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Chưa có trận đấu nào</p>
              ) : (
                seasonMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => {
                      setSelectedMatch(match)
                      setShowMatchDetailDialog(true)
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-sm text-muted-foreground w-32">
                        {new Date(match.date).toLocaleDateString("vi-VN")}
                        <br />
                        {match.time}
                      </div>
                      <div className="flex items-center gap-4 flex-1 justify-center">
                        <div className="text-right flex-1 font-medium">{match.homeTeam}</div>
                        <div className="font-bold text-lg min-w-[80px] text-center">
                          {match.homeScore !== undefined ? `${match.homeScore} - ${match.awayScore}` : "vs"}
                        </div>
                        <div className="text-left flex-1 font-medium">{match.awayTeam}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">Vòng {match.round}</div>
                      <Badge variant={match.status === "completed" ? "default" : "outline"}>
                        {match.status === "completed" ? "Đã diễn ra" : "Sắp diễn ra"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "standings" && (
        <Card>
          <CardHeader>
            <CardTitle>Bảng Xếp Hạng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Bảng xếp hạng sẽ được cập nhật sau khi có kết quả trận đấu
            </p>
          </CardContent>
        </Card>
      )}

      {activeTab === "registrations" && (
        <Card>
          <CardHeader>
            <CardTitle>Đơn Đăng Ký Chưa Xét Duyệt</CardTitle>
            <CardDescription>Xét duyệt đơn đăng ký tham gia mùa giải</CardDescription>
          </CardHeader>
          <CardContent>
            {season.registrations.filter((r) => r.status === "pending").length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Không có đơn đăng ký nào đang chờ xét duyệt</p>
            ) : (
              <div className="space-y-4">
                {season.registrations
                  .filter((r) => r.status === "pending")
                  .map((reg) => (
                    <div key={reg.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{reg.teamName}</p>
                        <p className="text-sm text-muted-foreground">
                          Ngày đăng ký: {new Date(reg.submittedDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApproveRegistration(reg.id)} className="gap-2">
                          <Check className="h-4 w-4" />
                          Xem Đơn
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectRegistration(reg.id)}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Từ Chối
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={showMatchDetailDialog} onOpenChange={setShowMatchDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm Thông Tin Trận Đấu</DialogTitle>
            <DialogDescription>
              Trận: {selectedMatch?.homeTeam} vs {selectedMatch?.awayTeam}
            </DialogDescription>
          </DialogHeader>

          {selectedMatch && (
            <div className="space-y-6 py-4">
              {/* Match Score Display */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50">
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground mb-2 text-center">Giải Có •</div>
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl">⚽</span>
                      </div>
                      <p className="font-semibold">{selectedMatch.homeTeam}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{selectedMatch.homeScore || 0}</div>
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground">-</div>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{selectedMatch.awayScore || 0}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span className="text-2xl">⚽</span>
                      </div>
                      <p className="font-semibold">{selectedMatch.awayTeam}</p>
                    </div>
                  </div>
                  <div className="text-center mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Vòng {selectedMatch.round}
                      <br />
                      Sân {selectedMatch.venue || "Gia Lai"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs for Goal/Foul selection */}
              <div className="flex gap-2 border-b">
                <Button
                  variant={matchInfoType === "goal" ? "default" : "ghost"}
                  onClick={() => setMatchInfoType("goal")}
                  className="rounded-b-none"
                >
                  Bàn Thắng
                </Button>
                <Button
                  variant={matchInfoType === "foul" ? "default" : "ghost"}
                  onClick={() => setMatchInfoType("foul")}
                  className="rounded-b-none"
                >
                  Phạm Lỗi
                </Button>
              </div>

              {matchInfoType === "goal" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ghi Nhận Bàn Thắng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Đội Bóng *</Label>
                        <Select
                          value={goalForm.teamId}
                          onValueChange={(v) => setGoalForm({ ...goalForm, teamId: v, scorerId: "" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Lựa chọn..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedMatch.homeTeamId}>{selectedMatch.homeTeam}</SelectItem>
                            <SelectItem value={selectedMatch.awayTeamId}>{selectedMatch.awayTeam}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Cầu Thủ *</Label>
                        <Select
                          value={goalForm.scorerId}
                          onValueChange={(v) => setGoalForm({ ...goalForm, scorerId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Lựa chọn..." />
                          </SelectTrigger>
                          <SelectContent>
                            {goalForm.teamId &&
                              teams
                                .find((t) => t.id === goalForm.teamId)
                                ?.players.map((player) => (
                                  <SelectItem key={player.id} value={player.id}>
                                    {player.name} (#{player.jerseyNumber})
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Loại Bàn Thắng *</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <Button
                            type="button"
                            variant={goalForm.goalType === "A" ? "default" : "outline"}
                            onClick={() => setGoalForm({ ...goalForm, goalType: "A" })}
                            className="h-20 flex flex-col items-center justify-center"
                          >
                            <div className="text-2xl mb-1">⚡</div>
                            <div className="text-xs">Bàn Thắng</div>
                          </Button>
                          <Button
                            type="button"
                            variant={goalForm.goalType === "B" ? "default" : "outline"}
                            onClick={() => setGoalForm({ ...goalForm, goalType: "B" })}
                            className="h-20 flex flex-col items-center justify-center"
                          >
                            <div className="text-2xl mb-1">🚫</div>
                            <div className="text-xs">Phạm Lỗi</div>
                          </Button>
                          <Button
                            type="button"
                            variant={goalForm.goalType === "C" ? "default" : "outline"}
                            onClick={() => setGoalForm({ ...goalForm, goalType: "C" })}
                            className="h-20 flex flex-col items-center justify-center"
                          >
                            <div className="text-2xl mb-1">🎯</div>
                            <div className="text-xs">Loại Khác</div>
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Thời Điểm *</Label>
                        <Input
                          type="number"
                          value={goalForm.minute}
                          onChange={(e) => setGoalForm({ ...goalForm, minute: e.target.value })}
                          placeholder="Phút ghi bàn"
                          min="0"
                          max="120"
                        />
                      </div>
                    </div>

                    <Button onClick={handleAddGoal} className="w-full">
                      Submit
                    </Button>
                  </CardContent>
                </Card>
              )}

              {matchInfoType === "foul" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ghi Nhận Phạm Lỗi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Đội Bóng *</Label>
                        <Select
                          value={foulForm.teamId}
                          onValueChange={(v) => setFoulForm({ ...foulForm, teamId: v, playerId: "" })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Lựa chọn..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={selectedMatch.homeTeamId}>{selectedMatch.homeTeam}</SelectItem>
                            <SelectItem value={selectedMatch.awayTeamId}>{selectedMatch.awayTeam}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Cầu Thủ *</Label>
                        <Select
                          value={foulForm.playerId}
                          onValueChange={(v) => setFoulForm({ ...foulForm, playerId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Lựa chọn..." />
                          </SelectTrigger>
                          <SelectContent>
                            {foulForm.teamId &&
                              teams
                                .find((t) => t.id === foulForm.teamId)
                                ?.players.map((player) => (
                                  <SelectItem key={player.id} value={player.id}>
                                    {player.name} (#{player.jerseyNumber})
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Loại Thẻ *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button
                            type="button"
                            variant={foulForm.foulType === "yellow" ? "default" : "outline"}
                            onClick={() => setFoulForm({ ...foulForm, foulType: "yellow" })}
                            className="h-20 flex flex-col items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            <div className="text-2xl mb-1">🟨</div>
                            <div className="text-xs">Thẻ Vàng</div>
                          </Button>
                          <Button
                            type="button"
                            variant={foulForm.foulType === "red" ? "default" : "outline"}
                            onClick={() => setFoulForm({ ...foulForm, foulType: "red" })}
                            className="h-20 flex flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white"
                          >
                            <div className="text-2xl mb-1">🟥</div>
                            <div className="text-xs">Thẻ Đỏ</div>
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Thời Điểm *</Label>
                        <Input
                          type="number"
                          value={foulForm.minute}
                          onChange={(e) => setFoulForm({ ...foulForm, minute: e.target.value })}
                          placeholder="Phút phạm lỗi"
                          min="0"
                          max="120"
                        />
                      </div>
                    </div>

                    <Button onClick={handleAddFoul} className="w-full">
                      Submit
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Goals List */}
              {selectedMatch.goals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Danh Sách Bàn Thắng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedMatch.goals.map((goal) => {
                        const team = teams.find((t) => t.id === goal.teamId)
                        const player = team?.players.find((p) => p.id === goal.scorerId)
                        return (
                          <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                {goal.minute}'
                              </div>
                              <div>
                                <p className="font-medium">{player?.name}</p>
                                <p className="text-sm text-muted-foreground">{team?.name}</p>
                              </div>
                            </div>
                            <Badge>{goal.goalType}</Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fouls List */}
              {selectedMatch.fouls && selectedMatch.fouls.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Danh Sách Phạm Lỗi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedMatch.fouls.map((foul) => {
                        const team = teams.find((t) => t.id === foul.teamId)
                        const player = team?.players.find((p) => p.id === foul.playerId)
                        return (
                          <div key={foul.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                {foul.minute}'
                              </div>
                              <div>
                                <p className="font-medium">{player?.name}</p>
                                <p className="text-sm text-muted-foreground">{team?.name}</p>
                              </div>
                            </div>
                            <Badge variant={foul.foulType === "red" ? "destructive" : "secondary"}>
                              {foul.foulType === "yellow" ? "🟨 Thẻ Vàng" : "🟥 Thẻ Đỏ"}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
