"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Star, GripVertical } from "lucide-react"
import type { Regulation } from "@/lib/types"

interface SettingsModuleProps {
  regulation: Regulation
  setRegulation: (reg: Regulation) => void
}

export default function SettingsModule({ regulation, setRegulation }: SettingsModuleProps) {
  const [formData, setFormData] = useState<Regulation>({ ...regulation })
  const [savedRegulations, setSavedRegulations] = useState<Regulation[]>([
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
      isDefault: true,
    },
  ])
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const rankingOptions = [
    { value: "points", label: "Theo Điểm Số" },
    { value: "goalDiff", label: "Theo Hiệu Số Bàn Thắng" },
    { value: "goalsFor", label: "Theo Số Bàn Thắng" },
    { value: "awayGoals", label: "Theo Số Bàn Thắng Trên Sân Khách" },
    { value: "headToHead", label: "Theo Kết Quả Đối Kháng 2 Đội" },
  ]

  const handleSave = () => {
    if (formData.minAge >= formData.maxAge) {
      alert("Tuổi tối thiểu phải nhỏ hơn tuổi tối đa")
      return
    }
    if (formData.minPlayers >= formData.maxPlayers) {
      alert("Số lượng cầu thủ tối thiểu phải nhỏ hơn tối đa")
      return
    }
    if (formData.maxForeignPlayers > formData.maxPlayers) {
      alert("Số cầu thủ nước ngoài không thể vượt quá số cầu thủ tối đa")
      return
    }
    if (!formData.rankingPriority || formData.rankingPriority.length === 0) {
      alert("Vui lòng chọn ít nhất một tiêu chí xếp hạng")
      return
    }

    const newReg: Regulation = {
      ...formData,
      id: `reg-${Date.now()}`,
      name: `Quy Định ${new Date().toLocaleDateString("vi-VN")}`,
    }

    setSavedRegulations([...savedRegulations, newReg])
    setRegulation(formData)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa quy định này?")) {
      setSavedRegulations(savedRegulations.filter((r) => r.id !== id))
    }
  }

  const handleDragStart = (value: string) => {
    setDraggedItem(value)
  }

  const handleDragOver = (e: React.DragEvent, value: string) => {
    e.preventDefault()
    if (draggedItem && draggedItem !== value) {
      const currentPriorities = formData.rankingPriority || []
      const draggedIndex = currentPriorities.indexOf(draggedItem)
      const targetIndex = currentPriorities.indexOf(value)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newPriorities = [...currentPriorities]
        newPriorities.splice(draggedIndex, 1)
        newPriorities.splice(targetIndex, 0, draggedItem)
        setFormData({ ...formData, rankingPriority: newPriorities })
      }
    }
  }

  const handleDrop = () => {
    setDraggedItem(null)
  }

  const toggleRankingPriority = (value: string) => {
    const current = formData.rankingPriority || []
    if (current.includes(value)) {
      setFormData({ ...formData, rankingPriority: current.filter((v) => v !== value) })
    } else {
      setFormData({ ...formData, rankingPriority: [...current, value] })
    }
  }

  const setAsDefault = (id: string) => {
    setSavedRegulations(savedRegulations.map((reg) => ({ ...reg, isDefault: reg.id === id })))
  }

  return (
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="form">Quy Định</TabsTrigger>
        <TabsTrigger value="saved">Quy Định Đã Lưu</TabsTrigger>
      </TabsList>

      <TabsContent value="form">
        <Card>
          <CardHeader>
            <CardTitle>Cài Đặt Quy Định</CardTitle>
            <CardDescription>Thiết lập các quy định cho giải đấu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Age and Player Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAge">Tuổi Cầu Thủ Tối Thiểu</Label>
                <Input
                  id="minAge"
                  type="number"
                  value={formData.minAge}
                  onChange={(e) => setFormData({ ...formData, minAge: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxAge">Tuổi Cầu Thủ Tối Đa</Label>
                <Input
                  id="maxAge"
                  type="number"
                  value={formData.maxAge}
                  onChange={(e) => setFormData({ ...formData, maxAge: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="minPlayers">Số Lượng Cầu Thủ Tối Thiểu</Label>
                <Input
                  id="minPlayers"
                  type="number"
                  value={formData.minPlayers}
                  onChange={(e) => setFormData({ ...formData, minPlayers: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxPlayers">Số Lượng Cầu Thủ Tối Đa</Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(e) => setFormData({ ...formData, maxPlayers: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxForeignPlayers">SL Cầu Thủ Nước Ngoài Tối Đa</Label>
                <Input
                  id="maxForeignPlayers"
                  type="number"
                  value={formData.maxForeignPlayers}
                  onChange={(e) => setFormData({ ...formData, maxForeignPlayers: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Goal Types and Match Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goalTypes">Số Loại Bàn Thắng</Label>
                <Input
                  id="goalTypes"
                  type="number"
                  value={formData.goalTypes}
                  onChange={(e) => setFormData({ ...formData, goalTypes: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="matchDuration">Thời Gian Trận Đấu (phút)</Label>
                <Input
                  id="matchDuration"
                  type="number"
                  value={formData.matchDuration}
                  onChange={(e) => setFormData({ ...formData, matchDuration: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Points System */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="winPoints">Điểm Số Thắng</Label>
                <Input
                  id="winPoints"
                  type="number"
                  value={formData.winPoints}
                  onChange={(e) => setFormData({ ...formData, winPoints: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="drawPoints">Điểm Số Hòa</Label>
                <Input
                  id="drawPoints"
                  type="number"
                  value={formData.drawPoints}
                  onChange={(e) => setFormData({ ...formData, drawPoints: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="lossPoints">Điểm Số Thua</Label>
                <Input
                  id="lossPoints"
                  type="number"
                  value={formData.lossPoints}
                  onChange={(e) => setFormData({ ...formData, lossPoints: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Ranking Priorities */}
            <div>
              <Label className="text-base">Thứ Tự Ưu Tiên Khi Xếp Hạng *</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Chọn và kéo để sắp xếp mức độ ưu tiên các tiêu chí xếp hạng
              </p>
              <div className="space-y-2">
                {/* Selected priorities - draggable */}
                {formData.rankingPriority?.map((priorityValue, index) => {
                  const option = rankingOptions.find((o) => o.value === priorityValue)
                  if (!option) return null
                  return (
                    <div
                      key={priorityValue}
                      draggable
                      onDragStart={() => handleDragStart(priorityValue)}
                      onDragOver={(e) => handleDragOver(e, priorityValue)}
                      onDrop={handleDrop}
                      className="flex items-center space-x-3 p-3 border rounded-lg bg-primary/5 cursor-move hover:bg-primary/10"
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 flex items-center gap-3">
                        <Badge variant="default">{index + 1}</Badge>
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRankingPriority(priorityValue)}
                      >
                        Xóa
                      </Button>
                    </div>
                  )
                })}

                {/* Available options to add */}
                {rankingOptions
                  .filter((option) => !formData.rankingPriority?.includes(option.value))
                  .map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => toggleRankingPriority(option.value)}
                    >
                      <div className="w-5 h-5" /> {/* Spacer for alignment */}
                      <span className="text-sm font-medium text-muted-foreground flex-1">{option.label}</span>
                      <Button type="button" variant="outline" size="sm">
                        Thêm
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-green-500/20 text-green-700 rounded text-sm">
                ✓ Quy định đã được lưu thành công
              </div>
            )}

            <Button onClick={handleSave} className="w-full">
              Lưu Quy Định
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="saved">
        <Card>
          <CardHeader>
            <CardTitle>Quy Định Đã Lưu</CardTitle>
            <CardDescription>
              Danh sách các quy định đã được lưu. Chọn quy định chuẩn để áp dụng mặc định.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savedRegulations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Chưa có quy định nào được lưu</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Quy Định</TableHead>
                    <TableHead>Tuổi</TableHead>
                    <TableHead>Số Cầu Thủ</TableHead>
                    <TableHead>Nước Ngoài</TableHead>
                    <TableHead>Điểm Số</TableHead>
                    <TableHead>Chuẩn</TableHead>
                    <TableHead className="text-right">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedRegulations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.name}</TableCell>
                      <TableCell>
                        {reg.minAge}-{reg.maxAge}
                      </TableCell>
                      <TableCell>
                        {reg.minPlayers}-{reg.maxPlayers}
                      </TableCell>
                      <TableCell>{reg.maxForeignPlayers}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {reg.winPoints}/{reg.drawPoints}/{reg.lossPoints}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reg.isDefault ? (
                          <Badge className="gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Chuẩn
                          </Badge>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => setAsDefault(reg.id)}>
                            Đặt làm chuẩn
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setFormData(reg)
                              setRegulation(reg)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(reg.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
