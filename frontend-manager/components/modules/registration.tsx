"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Team, Player, Regulation } from "@/lib/types"

interface RegistrationProps {
  teams: Team[]
  setTeams: (teams: Team[]) => void
  regulation: Regulation
}

export default function RegistrationModule({ teams, setTeams, regulation }: RegistrationProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("")
  const [playerName, setPlayerName] = useState("")
  const [playerAge, setPlayerAge] = useState("")
  const [playerType, setPlayerType] = useState<"domestic" | "foreign">("domestic")
  const [jerseyNumber, setJerseyNumber] = useState("")

  const handleAddPlayer = () => {
    if (!selectedTeam || !playerName || !playerAge || !jerseyNumber) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    const age = Number.parseInt(playerAge)
    if (age < regulation.minAge || age > regulation.maxAge) {
      alert(`Tuổi cầu thủ phải từ ${regulation.minAge} đến ${regulation.maxAge}`)
      return
    }

    const team = teams.find((t) => t.id === selectedTeam)
    if (!team) return

    const currentForeignCount = team.players.filter((p) => p.type === "foreign").length
    if (playerType === "foreign" && currentForeignCount >= regulation.maxForeignPlayers) {
      alert(`Tối đa ${regulation.maxForeignPlayers} cầu thủ nước ngoài`)
      return
    }

    if (team.players.length >= regulation.maxPlayers) {
      alert(`Tối đa ${regulation.maxPlayers} cầu thủ trên đội`)
      return
    }

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name: playerName,
      age,
      type: playerType,
      teamId: selectedTeam,
      jerseyNumber: Number.parseInt(jerseyNumber),
    }

    const updatedTeams = teams.map((t) => (t.id === selectedTeam ? { ...t, players: [...t.players, newPlayer] } : t))

    setTeams(updatedTeams)
    setPlayerName("")
    setPlayerAge("")
    setJerseyNumber("")
    setPlayerType("domestic")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiếp Nhận Hồ Sơ Đăng Ký</CardTitle>
        <CardDescription>
          Tuổi: {regulation.minAge}-{regulation.maxAge}, Cầu thủ: {regulation.minPlayers}-{regulation.maxPlayers}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Chọn Đội</label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn đội..." />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name} ({team.players.length}/{regulation.maxPlayers})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Loại Cầu Thủ</label>
            <Select value={playerType} onValueChange={(v) => setPlayerType(v as "domestic" | "foreign")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="domestic">Trong Nước</SelectItem>
                <SelectItem value="foreign">Nước Ngoài</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input placeholder="Tên cầu thủ" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
          <Input type="number" placeholder="Tuổi" value={playerAge} onChange={(e) => setPlayerAge(e.target.value)} />
          <Input
            type="number"
            placeholder="Số áo"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
          />
          <Button onClick={handleAddPlayer} className="mt-6">
            Thêm Cầu Thủ
          </Button>
        </div>

        {selectedTeam && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-4">
              Danh Sách Cầu Thủ - {teams.find((t) => t.id === selectedTeam)?.name}
            </h3>
            <div className="space-y-2">
              {teams
                .find((t) => t.id === selectedTeam)
                ?.players.map((player) => (
                  <div key={player.id} className="flex justify-between items-center p-3 border border-border rounded">
                    <span className="text-foreground">
                      #{player.jerseyNumber} - {player.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {player.age} tuổi - {player.type === "domestic" ? "Trong nước" : "Nước ngoài"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
