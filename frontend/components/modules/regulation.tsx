"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Regulation } from "@/lib/types"

interface RegulationProps {
  regulation: Regulation
  setRegulation: (reg: Regulation) => void
}

export default function RegulationModule({ regulation, setRegulation }: RegulationProps) {
  const [reg1, setReg1] = useState({ ...regulation })
  const [reg3, setReg3] = useState({ ...regulation })
  const [reg5, setReg5] = useState({ ...regulation })
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  const handleSaveReg1 = () => {
    if (reg1.minAge >= reg1.maxAge) {
      alert("Tuổi tối thiểu phải nhỏ hơn tuổi tối đa")
      return
    }
    if (reg1.minPlayers >= reg1.maxPlayers) {
      alert("Số lượng tối thiểu phải nhỏ hơn số lượng tối đa")
      return
    }
    if (reg1.maxForeignPlayers > reg1.maxPlayers) {
      alert("Số cầu thủ nước ngoài không thể vượt quá số cầu thủ tối đa")
      return
    }
    setRegulation({ ...regulation, ...reg1 })
    setSaveSuccess("reg1")
    setTimeout(() => setSaveSuccess(null), 3000)
  }

  const handleSaveReg3 = () => {
    if (reg3.maxScoringTime < 0) {
      alert("Thời gian ghi bàn không thể âm")
      return
    }
    setRegulation({ ...regulation, ...reg3 })
    setSaveSuccess("reg3")
    setTimeout(() => setSaveSuccess(null), 3000)
  }

  const handleSaveReg5 = () => {
    if (reg5.winPoints <= reg5.drawPoints || reg5.drawPoints <= reg5.lossPoints) {
      alert("Điểm thắng > Điểm hòa > Điểm thua")
      return
    }
    setRegulation({ ...regulation, ...reg5 })
    setSaveSuccess("reg5")
    setTimeout(() => setSaveSuccess(null), 3000)
  }

  const applyTemplate = (template: "standard" | "youth" | "professional") => {
    let newReg = { ...regulation }

    if (template === "standard") {
      newReg = {
        ...newReg,
        minAge: 16,
        maxAge: 40,
        minPlayers: 15,
        maxPlayers: 22,
        maxForeignPlayers: 3,
      }
    } else if (template === "youth") {
      newReg = {
        ...newReg,
        minAge: 12,
        maxAge: 18,
        minPlayers: 12,
        maxPlayers: 18,
        maxForeignPlayers: 1,
      }
    } else if (template === "professional") {
      newReg = {
        ...newReg,
        minAge: 18,
        maxAge: 45,
        minPlayers: 18,
        maxPlayers: 25,
        maxForeignPlayers: 5,
      }
    }

    setReg1(newReg)
    setRegulation(newReg)
    setSaveSuccess("template")
    setTimeout(() => setSaveSuccess(null), 3000)
  }

  return (
    <Tabs defaultValue="reg1" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="reg1">QĐ1: Cầu Thủ</TabsTrigger>
        <TabsTrigger value="reg3">QĐ3: Bàn Thắng</TabsTrigger>
        <TabsTrigger value="reg5">QĐ5: Điểm Số</TabsTrigger>
        <TabsTrigger value="templates">Mẫu</TabsTrigger>
      </TabsList>

      {/* Regulation 1 */}
      <TabsContent value="reg1">
        <Card>
          <CardHeader>
            <CardTitle>Qui Định 1: Cầu Thủ</CardTitle>
            <CardDescription>Thay đổi tuổi, số lượng và cấu thành đội</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Tuổi Tối Thiểu</label>
                <Input
                  type="number"
                  value={reg1.minAge}
                  onChange={(e) => setReg1({ ...reg1, minAge: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Tuổi Tối Đa</label>
                <Input
                  type="number"
                  value={reg1.maxAge}
                  onChange={(e) => setReg1({ ...reg1, maxAge: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Số Cầu Thủ Tối Thiểu</label>
                <Input
                  type="number"
                  value={reg1.minPlayers}
                  onChange={(e) => setReg1({ ...reg1, minPlayers: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Số Cầu Thủ Tối Đa</label>
                <Input
                  type="number"
                  value={reg1.maxPlayers}
                  onChange={(e) => setReg1({ ...reg1, maxPlayers: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Cầu Thủ Nước Ngoài Tối Đa</label>
                <Input
                  type="number"
                  value={reg1.maxForeignPlayers}
                  onChange={(e) => setReg1({ ...reg1, maxForeignPlayers: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            {saveSuccess === "reg1" && (
              <div className="p-3 bg-green-500/20 text-green-700 rounded text-sm">
                ✓ Qui định 1 đã được cập nhật thành công
              </div>
            )}
            <Button onClick={handleSaveReg1} className="w-full md:w-auto">
              Lưu Qui Định 1
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Regulation 3 */}
      <TabsContent value="reg3">
        <Card>
          <CardHeader>
            <CardTitle>Qui Định 3: Bàn Thắng</CardTitle>
            <CardDescription>Thay đổi loại bàn thắng và thời gian ghi bàn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Thời Gian Ghi Bàn Tối Đa (phút)</label>
              <Input
                type="number"
                value={reg3.maxScoringTime}
                onChange={(e) => setReg3({ ...reg3, maxScoringTime: Number.parseInt(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Hiện tại có {reg3.goalTypes.length} loại bàn thắng: {reg3.goalTypes.join(", ")}
              </p>
            </div>
            <div className="p-3 bg-muted rounded">
              <h4 className="font-medium text-foreground text-sm mb-2">Loại Bàn Thắng</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Loại A: Bàn thắng bình thường</p>
                <p>Loại B: Bàn thắng từ pha tấn công</p>
                <p>Loại C: Bàn thắng từ pha phòng ngự</p>
              </div>
            </div>
            {saveSuccess === "reg3" && (
              <div className="p-3 bg-green-500/20 text-green-700 rounded text-sm">
                ✓ Qui định 3 đã được cập nhật thành công
              </div>
            )}
            <Button onClick={handleSaveReg3} className="w-full md:w-auto">
              Lưu Qui Định 3
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Regulation 5 */}
      <TabsContent value="reg5">
        <Card>
          <CardHeader>
            <CardTitle>Qui Định 5: Điểm Số</CardTitle>
            <CardDescription>Thay đổi điểm thắng, hòa, thua và tiêu chí xếp hạng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Điểm Thắng</label>
                <Input
                  type="number"
                  value={reg5.winPoints}
                  onChange={(e) => setReg5({ ...reg5, winPoints: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Điểm Hòa</label>
                <Input
                  type="number"
                  value={reg5.drawPoints}
                  onChange={(e) => setReg5({ ...reg5, drawPoints: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Điểm Thua</label>
                <Input
                  type="number"
                  value={reg5.lossPoints}
                  onChange={(e) => setReg5({ ...reg5, lossPoints: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-muted rounded">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{reg5.winPoints}</div>
                <div className="text-xs text-muted-foreground">Thắng</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{reg5.drawPoints}</div>
                <div className="text-xs text-muted-foreground">Hòa</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{reg5.lossPoints}</div>
                <div className="text-xs text-muted-foreground">Thua</div>
              </div>
            </div>

            {saveSuccess === "reg5" && (
              <div className="p-3 bg-green-500/20 text-green-700 rounded text-sm">
                ✓ Qui định 5 đã được cập nhật thành công
              </div>
            )}
            <Button onClick={handleSaveReg5} className="w-full md:w-auto">
              Lưu Qui Định 5
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Templates Tab */}
      <TabsContent value="templates">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tiêu Chuẩn</CardTitle>
              <CardDescription>Qui định chuẩn cho giải đấu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-medium">Tuổi:</span> 16-40
                </p>
                <p>
                  <span className="font-medium">Cầu thủ:</span> 15-22
                </p>
                <p>
                  <span className="font-medium">Nước ngoài:</span> Tối đa 3
                </p>
              </div>
              {saveSuccess === "template" && <div className="text-xs text-green-700">✓ Đã áp dụng</div>}
              <Button onClick={() => applyTemplate("standard")} className="w-full" size="sm">
                Áp Dụng
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thanh Thiếu Niên</CardTitle>
              <CardDescription>Qui định cho đội trẻ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-medium">Tuổi:</span> 12-18
                </p>
                <p>
                  <span className="font-medium">Cầu thủ:</span> 12-18
                </p>
                <p>
                  <span className="font-medium">Nước ngoài:</span> Tối đa 1
                </p>
              </div>
              {saveSuccess === "template" && <div className="text-xs text-green-700">✓ Đã áp dụng</div>}
              <Button onClick={() => applyTemplate("youth")} className="w-full" size="sm">
                Áp Dụng
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chuyên Nghiệp</CardTitle>
              <CardDescription>Qui định cho giải chuyên nghiệp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-medium">Tuổi:</span> 18-45
                </p>
                <p>
                  <span className="font-medium">Cầu thủ:</span> 18-25
                </p>
                <p>
                  <span className="font-medium">Nước ngoài:</span> Tối đa 5
                </p>
              </div>
              {saveSuccess === "template" && <div className="text-xs text-green-700">✓ Đã áp dụng</div>}
              <Button onClick={() => applyTemplate("professional")} className="w-full" size="sm">
                Áp Dụng
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
