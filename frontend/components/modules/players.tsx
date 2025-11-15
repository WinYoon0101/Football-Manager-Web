"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, X, Save, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Team, Player } from "@/lib/types"

interface PlayersModuleProps {
  teams: Team[]
  setTeams: (teams: Team[]) => void
}

export default function PlayersModule({ teams, setTeams }: PlayersModuleProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<(Player & { teamName: string; teamId: string }) | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "add">("view")
  const [editForm, setEditForm] = useState<Partial<Player>>({})
  const [showDetailView, setShowDetailView] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const allPlayers = teams.flatMap((team) =>
    (team.players || []).map((player) => ({
      ...player,
      teamName: team.name,
      teamId: team.id,
      type: player.type || "domestic",
    })),
  )

  const filteredPlayers = allPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.teamName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openDialog = (player: Player & { teamName: string; teamId: string }, mode: "view" | "edit") => {
    setSelectedPlayer(player)
    setEditForm(player)
    setDialogMode(mode)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setSelectedPlayer(null)
    setEditForm({
      name: "",
      position: "FW",
      number: 1,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      type: "domestic",
    })
    setImagePreview(null)
    setDialogMode("add")
    setIsDialogOpen(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (dialogMode === "add") {
      const teamId = editForm.teamId
      if (!teamId) return

      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: editForm.name || "",
        position: editForm.position || "FW",
        number: editForm.number || 1,
        goals: editForm.goals || 0,
        assists: editForm.assists || 0,
        yellowCards: editForm.yellowCards || 0,
        redCards: editForm.redCards || 0,
        type: editForm.type || "domestic",
        image: imagePreview ?? undefined,
        jerseyNumber: 0
      }

      setTeams(
        teams.map((team) => (team.id === teamId ? { ...team, players: [...(team.players || []), newPlayer] } : team)),
      )
    } else if (dialogMode === "edit" && selectedPlayer) {
      const teamId = (selectedPlayer as any).teamId
      setTeams(
        teams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                players: (team.players || []).map((p) => (p.id === selectedPlayer.id ? { ...p, ...editForm } : p)),
              }
            : team,
        ),
      )
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (player: Player & { teamId: string }) => {
    if (confirm(`Bạn có chắc muốn xóa cầu thủ ${player.name}?`)) {
      setTeams(
        teams.map((team) =>
          team.id === player.teamId
            ? { ...team, players: (team.players || []).filter((p) => p.id !== player.id) }
            : team,
        ),
      )
    }
  }

  const showPlayerDetail = (player: Player & { teamName: string; teamId: string }) => {
    setSelectedPlayer(player)
    setShowDetailView(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cầu thủ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm Cầu Thủ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Cầu Thủ</CardTitle>
          <CardDescription>Tổng số {filteredPlayers.length} cầu thủ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Đội</TableHead>
                <TableHead>Loại Cầu Thủ</TableHead>
                <TableHead>Bàn Thắng</TableHead>
                <TableHead className="text-right">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player) => (
                <TableRow
                  key={player.id}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => showPlayerDetail(player as any)}
                >
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.teamName}</TableCell>
                  <TableCell>
                    <Badge variant={player.type === "foreign" ? "secondary" : "outline"}>
                      {player.type === "foreign" ? "Ngoài nước" : "Trong nước"}
                    </Badge>
                  </TableCell>
                  <TableCell>{player.goals || 0}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => showPlayerDetail(player as any)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem Chi Tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDialog(player as any, "edit")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(player as any)} className="text-destructive">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add"
                ? "Thêm Cầu Thủ Mới"
                : dialogMode === "edit"
                  ? "Chỉnh Sửa Cầu Thủ"
                  : "Chi Tiết Cầu Thủ"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "view" ? "Thông tin chi tiết về cầu thủ" : "Nhập thông tin cầu thủ"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {dialogMode === "add" && (
              <div className="col-span-2 flex flex-col items-center">
                <Label className="mb-2">Ảnh Đại Diện</Label>
                <div className="w-32 h-32 border-2 border-dashed border-muted-foreground rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="player-image-upload"
                  />
                  <label
                    htmlFor="player-image-upload"
                    className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-xs text-muted-foreground">Ảnh Đại Diện</div>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            {dialogMode === "add" && (
              <>
                <div className="col-span-2">
                  <Label>Tên Cầu Thủ *</Label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Nhập tên cầu thủ"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Đội Bóng *</Label>
                  <Select
                    value={editForm.teamId}
                    onValueChange={(value) => setEditForm({ ...editForm, teamId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Lựa chọn..." />
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
                  <Label>Sinh Nhật *</Label>
                  <Input
                    type="date"
                    value={editForm.birthDate || ""}
                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Loại Cầu Thủ *</Label>
                  <Select
                    value={editForm.type || "domestic"}
                    onValueChange={(value) => setEditForm({ ...editForm, type: value as "domestic" | "foreign" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Lựa chọn..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestic">Trong Nước</SelectItem>
                      <SelectItem value="foreign">Ngoài Nước</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {dialogMode !== "add" && (
              <>
                <div>
                  <Label>Tên Cầu Thủ *</Label>
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    disabled={dialogMode === "view"}
                  />
                </div>

                <div>
                  <Label>Số Áo *</Label>
                  <Input
                    type="number"
                    value={editForm.number || ""}
                    onChange={(e) => setEditForm({ ...editForm, number: Number.parseInt(e.target.value) })}
                    disabled={dialogMode === "view"}
                  />
                </div>

                <div>
                  <Label>Vị Trí *</Label>
                  <Select
                    value={editForm.position}
                    onValueChange={(value) => setEditForm({ ...editForm, position: value as any })}
                    disabled={dialogMode === "view"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GK">Thủ Môn (GK)</SelectItem>
                      <SelectItem value="DF">Hậu Vệ (DF)</SelectItem>
                      <SelectItem value="MF">Tiền Vệ (MF)</SelectItem>
                      <SelectItem value="FW">Tiền Đạo (FW)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Bàn Thắng</Label>
                  <Input
                    type="number"
                    value={editForm.goals || 0}
                    onChange={(e) => setEditForm({ ...editForm, goals: Number.parseInt(e.target.value) || 0 })}
                    disabled={dialogMode === "view"}
                  />
                </div>

                <div>
                  <Label>Kiến Tạo</Label>
                  <Input
                    type="number"
                    value={editForm.assists || 0}
                    onChange={(e) => setEditForm({ ...editForm, assists: Number.parseInt(e.target.value) || 0 })}
                    disabled={dialogMode === "view"}
                  />
                </div>

                <div>
                  <Label>Thẻ Vàng</Label>
                  <Input
                    type="number"
                    value={editForm.yellowCards || 0}
                    onChange={(e) => setEditForm({ ...editForm, yellowCards: Number.parseInt(e.target.value) || 0 })}
                    disabled={dialogMode === "view"}
                  />
                </div>

                <div>
                  <Label>Thẻ Đỏ</Label>
                  <Input
                    type="number"
                    value={editForm.redCards || 0}
                    onChange={(e) => setEditForm({ ...editForm, redCards: Number.parseInt(e.target.value) || 0 })}
                    disabled={dialogMode === "view"}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              {dialogMode === "view" ? "Đóng" : "Hủy"}
            </Button>
            {dialogMode !== "view" && (
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {dialogMode === "add" ? "Submit" : "Lưu"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailView} onOpenChange={setShowDetailView}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi Tiết Cầu Thủ</DialogTitle>
          </DialogHeader>

          {selectedPlayer && (
            <div className="space-y-6 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-5xl font-bold">
                      {selectedPlayer.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-2">{selectedPlayer.name}</h2>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Đội Bóng</p>
                          <p className="font-semibold">{selectedPlayer.teamName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Số Áo</p>
                          <p className="font-semibold">#{selectedPlayer.jerseyNumber || selectedPlayer.number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tuổi</p>
                          <p className="font-semibold">{selectedPlayer.age || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Loại Cầu Thủ</p>
                          <Badge variant={selectedPlayer.type === "foreign" ? "secondary" : "outline"}>
                            {selectedPlayer.type === "foreign" ? "Ngoài nước" : "Trong nước"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Bàn Thắng</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{selectedPlayer.goals || 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Kiến Tạo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{selectedPlayer.assists || 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Thẻ Vàng</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-yellow-600">{selectedPlayer.yellowCards || 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Thẻ Đỏ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-red-600">{selectedPlayer.redCards || 0}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tiểu Sử</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {selectedPlayer.bio || "Chưa có thông tin tiểu sử cho cầu thủ này. Thông tin sẽ được cập nhật sau."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lịch Sử Thi Đấu</CardTitle>
                  <CardDescription>Các trận đấu gần đây</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedPlayer.matchHistory && selectedPlayer.matchHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Đối Thủ</TableHead>
                          <TableHead>Bàn Thắng</TableHead>
                          <TableHead>Kiến Tạo</TableHead>
                          <TableHead>Thẻ</TableHead>
                          <TableHead>Phút Thi Đấu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPlayer.matchHistory.map((match) => (
                          <TableRow key={match.id}>
                            <TableCell>{new Date(match.date).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell>{match.opponent}</TableCell>
                            <TableCell>{match.goals}</TableCell>
                            <TableCell>{match.assists}</TableCell>
                            <TableCell>
                              {match.yellowCards > 0 && <span className="mr-1">🟨{match.yellowCards}</span>}
                              {match.redCards > 0 && <span>🟥{match.redCards}</span>}
                            </TableCell>
                            <TableCell>{match.minutesPlayed}'</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Chưa có lịch sử thi đấu</p>
                  )}
                </CardContent>
              </Card>

              <Button onClick={() => setShowDetailView(false)} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay Lại Danh Sách
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
