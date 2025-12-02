"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2, Save, Settings as SettingsIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  parametersAPI,
  Parameter,
  UpdateParameterRequest,
} from "@/lib/api/parameters";

export default function SettingsModule() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parameter, setParameter] = useState<Parameter | null>(null);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateParameterRequest>({
    minAge: null,
    maxAge: null,
    minPlayers: null,
    maxPlayers: null,
    maxForeignPlayers: null,
    minGoalMinute: null,
    maxGoalMinute: null,
    categorySort: [],
    drawScore: 1,
    loseScore: 0,
    winScore: 3,
  });

  // Load parameter với id = 1
  useEffect(() => {
    loadParameter();
  }, []);

  async function loadParameter(showLoading: boolean = true) {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const data = await parametersAPI.getById(1);
      setParameter(data);
      setFormData({
        minAge: data.minAge ?? null,
        maxAge: data.maxAge ?? null,
        minPlayers: data.minPlayers ?? null,
        maxPlayers: data.maxPlayers ?? null,
        maxForeignPlayers: data.maxForeignPlayers ?? null,
        minGoalMinute: data.minGoalMinute ?? null,
        maxGoalMinute: data.maxGoalMinute ?? null,
        categorySort: data.categorySort ?? [],
        drawScore: data.drawScore ?? 1,
        loseScore: data.loseScore ?? 0,
        winScore: data.winScore ?? 3,
      });
      // Reset error state
      setScoreError(null);
    } catch (error: any) {
      toast.error("Không thể tải cài đặt hệ thống");
      console.error("Error loading parameter:", error);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  function handleReset() {
    // Reset về giá trị hiện tại trong database (không hiển thị loading)
    loadParameter(false);
  }

  function validateScores() {
    const win = formData.winScore ?? 0;
    const draw = formData.drawScore ?? 0;
    const lose = formData.loseScore ?? 0;

    // Kiểm tra điểm thắng > điểm hòa
    if (win <= draw) {
      setScoreError(`Điểm thắng (${win}) phải lớn hơn điểm hòa (${draw})`);
      return false;
    }

    // Kiểm tra điểm hòa > điểm thua
    if (draw <= lose) {
      setScoreError(`Điểm hòa (${draw}) phải lớn hơn điểm thua (${lose})`);
      return false;
    }

    // Kiểm tra điểm thắng > điểm hòa > điểm thua
    if (win <= lose) {
      setScoreError(`Điểm thắng (${win}) phải lớn hơn điểm thua (${lose})`);
      return false;
    }

    setScoreError(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!parameter) return;

    // Validate điểm
    if (!validateScores()) {
      return;
    }

    try {
      setSaving(true);
      const updated = await parametersAPI.update(1, formData);
      setParameter(updated);
      toast.success("Cập nhật cài đặt thành công!");
      setScoreError(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật cài đặt"
      );
      console.error("Error updating parameter:", error);
    } finally {
      setSaving(false);
    }
  }

  function handleInputChange(
    field: keyof UpdateParameterRequest,
    value: string | number | null
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "" ? null : Number(value) || value,
    }));

    // Clear error khi người dùng thay đổi điểm
    if (
      field === "winScore" ||
      field === "drawScore" ||
      field === "loseScore"
    ) {
      setScoreError(null);
    }
  }

  function handleCategorySortChange(index: number, value: string) {
    setFormData((prev) => {
      const newSort = [...(prev.categorySort || [])];
      newSort[index] = value;
      return { ...prev, categorySort: newSort };
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Cài Đặt Hệ Thống</h2>
          <p className="text-white/70">
            Quản lý các thông số và quy tắc của giải đấu
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quy định về cầu thủ */}
          <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Quy Định Về Cầu Thủ</CardTitle>
              <CardDescription className="text-white/70">
                Thiết lập các quy định về độ tuổi và số lượng cầu thủ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tuổi cầu thủ */}
              <div className="space-y-3 pb-4 border-b border-white/20">
                <h4 className="text-sm font-semibold text-white/80">Độ Tuổi</h4>
                <div className="space-y-2">
                  <Label htmlFor="minAge" className="text-white/80">
                    Tuổi tối thiểu
                  </Label>
                  <Input
                    id="minAge"
                    type="number"
                    min="0"
                    value={formData.minAge ?? ""}
                    onChange={(e) =>
                      handleInputChange("minAge", e.target.value)
                    }
                    placeholder="Ví dụ: 18"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAge" className="text-white/80">
                    Tuổi tối đa
                  </Label>
                  <Input
                    id="maxAge"
                    type="number"
                    min="0"
                    value={formData.maxAge ?? ""}
                    onChange={(e) =>
                      handleInputChange("maxAge", e.target.value)
                    }
                    placeholder="Ví dụ: 40"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Số lượng cầu thủ */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white/80">
                  Số Lượng
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="minPlayers" className="text-white/80">
                    Số cầu thủ tối thiểu
                  </Label>
                  <Input
                    id="minPlayers"
                    type="number"
                    min="0"
                    value={formData.minPlayers ?? ""}
                    onChange={(e) =>
                      handleInputChange("minPlayers", e.target.value)
                    }
                    placeholder="Ví dụ: 11"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers" className="text-white/80">
                    Số cầu thủ tối đa
                  </Label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    min="0"
                    value={formData.maxPlayers ?? ""}
                    onChange={(e) =>
                      handleInputChange("maxPlayers", e.target.value)
                    }
                    placeholder="Ví dụ: 25"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxForeignPlayers" className="text-white/80">
                    Số cầu thủ nước ngoài tối đa
                  </Label>
                  <Input
                    id="maxForeignPlayers"
                    type="number"
                    min="0"
                    value={formData.maxForeignPlayers ?? ""}
                    onChange={(e) =>
                      handleInputChange("maxForeignPlayers", e.target.value)
                    }
                    placeholder="Ví dụ: 5"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quy định về bàn thắng */}
          <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">
                Quy Định Về Bàn Thắng
              </CardTitle>
              <CardDescription className="text-white/70">
                Thiết lập phút ghi bàn hợp lệ và hệ thống điểm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Phút ghi bàn */}
              <div className="space-y-3 pb-4 border-b border-white/20">
                <h4 className="text-sm font-semibold text-white/80">
                  Phút Ghi Bàn
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="minGoalMinute" className="text-white/80">
                    Phút ghi bàn tối thiểu
                  </Label>
                  <Input
                    id="minGoalMinute"
                    type="number"
                    min="0"
                    value={formData.minGoalMinute ?? ""}
                    onChange={(e) =>
                      handleInputChange("minGoalMinute", e.target.value)
                    }
                    placeholder="Ví dụ: 1"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxGoalMinute" className="text-white/80">
                    Phút ghi bàn tối đa
                  </Label>
                  <Input
                    id="maxGoalMinute"
                    type="number"
                    min="0"
                    value={formData.maxGoalMinute ?? ""}
                    onChange={(e) =>
                      handleInputChange("maxGoalMinute", e.target.value)
                    }
                    placeholder="Ví dụ: 90"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Hệ thống điểm */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white/80">
                  Hệ Thống Điểm
                </h4>
                {scoreError && (
                  <div className="p-3 text-sm text-red-300 bg-red-500/20 border border-red-400/50 rounded-md">
                    ⚠️ {scoreError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="winScore" className="text-white/80">
                    Điểm thắng
                  </Label>
                  <Input
                    id="winScore"
                    type="number"
                    min="0"
                    value={formData.winScore ?? ""}
                    onChange={(e) =>
                      handleInputChange("winScore", e.target.value)
                    }
                    placeholder="Ví dụ: 3"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/60 ${
                      scoreError ? "border-red-400" : ""
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drawScore" className="text-white/80">
                    Điểm hòa
                  </Label>
                  <Input
                    id="drawScore"
                    type="number"
                    min="0"
                    value={formData.drawScore ?? ""}
                    onChange={(e) =>
                      handleInputChange("drawScore", e.target.value)
                    }
                    placeholder="Ví dụ: 1"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/60 ${
                      scoreError ? "border-red-400" : ""
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loseScore" className="text-white/80">
                    Điểm thua
                  </Label>
                  <Input
                    id="loseScore"
                    type="number"
                    min="0"
                    value={formData.loseScore ?? ""}
                    onChange={(e) =>
                      handleInputChange("loseScore", e.target.value)
                    }
                    placeholder="Ví dụ: 0"
                    className={`bg-white/10 border-white/20 text-white placeholder:text-white/60 ${
                      scoreError ? "border-red-400" : ""
                    }`}
                  />
                </div>
                <p className="text-xs text-white/60">
                  Lưu ý: Điểm thắng phải lớn hơn điểm hòa, và điểm hòa phải lớn
                  hơn điểm thua
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Thứ tự xếp hạng */}
          <Card className="lg:col-span-2 bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Thứ Tự Xếp Hạng</CardTitle>
              <CardDescription className="text-white/70">
                Thiết lập thứ tự ưu tiên khi xếp hạng (các giá trị hợp lệ: điểm,
                hiệu_số, bàn_thắng, đối_kháng)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-white/80">Vị trí {index + 1}</Label>
                    <Input
                      type="text"
                      value={formData.categorySort?.[index] || ""}
                      onChange={(e) =>
                        handleCategorySortChange(index, e.target.value)
                      }
                      placeholder={`Vị trí ${index + 1}`}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60">
                Gợi ý: điểm, hiệu_số, bàn_thắng, đối_kháng
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={saving}
            className="border-white/20 text-black hover:bg-red-500 hover:text-white"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#3872ec] hover:bg-[#2f5fc3] text-white border border-white/10"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu Cài Đặt
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
