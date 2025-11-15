"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Camera } from "lucide-react";

interface EditPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  teams: string[];
  player: any; // cầu thủ được chọn để edit
}

export default function EditPlayerDialog({
  open,
  onOpenChange,
  onSubmit,
  teams,
  player,
}: EditPlayerDialogProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [team, setTeam] = useState("");
  const [playerType, setPlayerType] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ------------------------------------
  // Load data từ player khi mở modal
  // ------------------------------------
  useEffect(() => {
    if (player) {
      setName(player.name || "");
      setBirthDate(player.birthDate?.slice(0, 10) || "");
      setTeam(player.team?.name || "");
      setPlayerType(player.playerType?.name || "");
      setImage(player.image || null);
    }
  }, [player, open]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name || !birthDate || !team || !playerType) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    onSubmit({
      id: player.id,
      name,
      birthDate,
      team,
      playerType,
      image,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa cầu thủ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <div
              className="relative w-28 h-28 rounded-full bg-muted overflow-hidden group cursor-pointer shadow-md"
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                  <Camera className="w-7 h-7 opacity-60" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <Camera className="text-white w-6 h-6" />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label>Tên cầu thủ</Label>
            <Input
              placeholder="Nhập tên cầu thủ"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Birthdate */}
          <div className="space-y-1">
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          {/* Team */}
          <div className="space-y-1">
            <Label>Đội bóng</Label>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn đội bóng" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Player Type */}
          <div className="space-y-1">
            <Label>Loại cầu thủ</Label>
            <Select value={playerType} onValueChange={setPlayerType}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="domestic">Trong nước</SelectItem>
                <SelectItem value="foreign">Nước ngoài</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
