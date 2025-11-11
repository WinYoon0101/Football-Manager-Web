"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit2, Trash2, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Team } from "@/lib/types"

interface TeamsModuleProps {
  teams: Team[]
  setTeams: (teams: Team[]) => void
}

export default function TeamsModule({ teams, setTeams }: TeamsModuleProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: "", city: "" })

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Bạn có chắc chắn muốn xóa đội bóng này?")) {
      setTeams(teams.filter((t) => t.id !== id))
    }
  }

  const handleViewDetail = (team: Team) => {
    setSelectedTeam(team)
    setShowDetail(true)
  }

  const handleAddTeam = () => {
    if (!newTeam.name || !newTeam.city) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }
    const team: Team = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      city: newTeam.city,
      players: [],
    }
    setTeams([...teams, team])
    setNewTeam({ name: "", city: "" })
    setShowAddDialog(false)
  }

  if (showDetail && selectedTeam) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{selectedTeam.name}</h3>
            <p className="text-muted-foreground">{selectedTeam.city}</p>
          </div>
          <Button variant="outline" onClick={() => setShowDetail(false)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay Lại
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Đội</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Tên đội:</span>
                <p className="font-semibold">{selectedTeam.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Thành phố:</span>
                <p className="font-semibold">{selectedTeam.city}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Số cầu thủ:</span>
                <p className="font-semibold">{selectedTeam.players.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Danh Sách Cầu Thủ</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTeam.players.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Chưa có cầu thủ nào</p>
              ) : (
                <div className="space-y-2">
                  {selectedTeam.players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {player.jerseyNumber}
                        </div>
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.age} tuổi • {player.type === "domestic" ? "Nội" : "Ngoại"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh Sách Đội Bóng</CardTitle>
              <CardDescription>Quản lý các đội tham gia giải vô địch</CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm Đội Bóng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Đội Bóng Mới</DialogTitle>
                  <DialogDescription>Nhập thông tin đội bóng</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Tên Đội Bóng *</Label>
                    <Input
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      placeholder="Nhập tên đội bóng"
                    />
                  </div>
                  <div>
                    <Label>Thành Phố *</Label>
                    <Input
                      value={newTeam.city}
                      onChange={(e) => setNewTeam({ ...newTeam, city: e.target.value })}
                      placeholder="Nhập thành phố"
                    />
                  </div>
                  <Button onClick={handleAddTeam} className="w-full">
                    Thêm Đội Bóng
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đội bóng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold">Tên Đội</th>
                  <th className="text-left p-4 font-semibold">Thành Phố</th>
                  <th className="text-left p-4 font-semibold">Số Cầu Thủ</th>
                  <th className="text-right p-4 font-semibold">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetail(team)}
                  >
                    <td className="p-4 font-medium">{team.name}</td>
                    <td className="p-4 text-muted-foreground">{team.city}</td>
                    <td className="p-4 text-muted-foreground">{team.players.length}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Edit functionality
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => handleDelete(team.id, e)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
