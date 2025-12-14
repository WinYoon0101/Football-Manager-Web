"use client";

import { useEffect, useState } from "react";
import { seasonApi, Season } from "@/lib/api/seasons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { applicationApi } from "@/lib/api/application";

// ===== Helper: Tính trạng thái mùa giải =====
function getSeasonStatus(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return "Không rõ";

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "Chưa bắt đầu";
  if (now > end) return "Kết thúc";
  return "Đang diễn ra";
}

export default function SeasonsModule() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  const [teamsCount, setTeamsCount] = useState<Record<number, number>>({});

  const router = useRouter();

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Data for modals
  const [editing, setEditing] = useState<Season | null>(null);
  const [deleting, setDeleting] = useState<Season | null>(null);

  // Add form state
  const [addForm, setAddForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // ===== Fetch API =====
  async function loadSeasons() {
    try {
      setLoading(true);
      const res = await seasonApi.getAll();
      setSeasons(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  const loadSeasons = async () => {
    try {
      setLoading(true);
      const res = await seasonApi.getAll();
      setSeasons(res.data);

      // Lấy số đội accepted cho từng season
      const counts: Record<number, number> = {};
      await Promise.all(
        res.data.map(async (s) => {
          const teamsRes = await applicationApi.getAcceptedTeamsBySeason(s.id);
          counts[s.id] = teamsRes.data.length; // số đội accepted
        })
      );
      setTeamsCount(counts);
    } finally {
      setLoading(false);
    }
  };

  loadSeasons();
}, []);

  // ===== FILTER =====
  const filtered = seasons.filter((s) => {
    const status = getSeasonStatus(s.startDate, s.endDate);

    return (
      s.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterStatus === "" || filterStatus === "all" || filterStatus === status)
    );
  });

  // ===== CREATE =====
  async function handleAdd() {
    await seasonApi.create(addForm);
    setOpenAdd(false);
    loadSeasons();
  }

  // ===== UPDATE =====
  async function handleUpdate() {
    if (!editing) return;

    await seasonApi.update(editing.id, editForm);
    setOpenEdit(false);
    loadSeasons();
  }

  // ===== DELETE =====
  async function handleDelete() {
    if (!deleting) return;

    await seasonApi.delete(deleting.id);
    setOpenDelete(false);
    loadSeasons();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">
          Danh Sách Mùa Giải
        </h1>
        <p className="text-white/70">Quản lý các mùa giải trong hệ thống</p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 items-center mb-8">
        <Input
          placeholder="Tên mùa giải"
          className="w-64 shadow-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <Select onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 shadow-sm bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Tình Trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Đang diễn ra">Đang diễn ra</SelectItem>
            <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
            <SelectItem value="Kết thúc">Kết thúc</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-3">
          <Button
            className="bg-[#3872ec] hover:bg-[#2f5fc3] text-white border border-white/10 shadow"
            onClick={() => setOpenAdd(true)}
          >
            + Thêm Mùa Giải
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md rounded-xl overflow-hidden">
        <CardHeader className="grid grid-cols-[2fr,1fr,1fr,1fr,0.7fr,0.4fr] px-6 py-4 font-semibold text-sm bg-white/10 border-b border-white/20">
          <div className="text-white">Tên Mùa Giải</div>
          <div className="text-white">Tình Trạng</div>
          <div className="text-white">Ngày Bắt Đầu</div>
          <div className="text-white">Ngày Kết Thúc</div>
          <div className="text-white">Số Đội</div>
          <div className="text-center text-white">Thao Tác</div>
        </CardHeader>

        <CardContent className="px-0">
          {loading && <p className="p-4 text-white/60">Đang tải...</p>}

          {!loading &&
            filtered.map((item) => {
              const status = getSeasonStatus(item.startDate, item.endDate);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr,1fr,1fr,1fr,0.7fr,0.4fr] px-6 py-4 items-center text-sm 
                    hover:bg-white/10 transition-colors border-b border-white/20 last:border-0"
                >
                  <div
                    className="text-blue-300 font-medium hover:text-blue-200 hover:underline cursor-pointer"
                    onClick={() => router.push(`/season/${item.id}`)}
                  >
                    {item.name}
                  </div>

                  <div  onClick={() => router.push(`/season/${item.id}`)} className="cursor-pointer">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium border
                      ${
                        status === "Đang diễn ra"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : status === "Chưa bắt đầu"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="text-white/80 cursor-pointer" onClick={() => router.push(`/season/${item.id}`)} >
                    {item.startDate?.slice(0, 10)}
                  </div>
                  <div className="text-white/80 cursor-pointer" onClick={() => router.push(`/season/${item.id}`)} >
                    {item.endDate?.slice(0, 10)}
                  </div>

                  <div className="font-medium text-white/80">{teamsCount[item.id] ?? 0}</div>

                  {/* Dropdown */}
                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="w-5 h-5 cursor-pointer text-white/60 hover:text-white" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                        className="cursor-pointer"
                          onClick={() => {
                            setEditing(item);
                            setEditForm({
                              name: item.name,
                              startDate: item.startDate?.slice(0, 10) || "",
                              endDate: item.endDate?.slice(0, 10) || "",
                            });
                            setOpenEdit(true);
                          }}
                        >
                          Chỉnh sửa
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600 cursor-pointer"
                          onClick={() => {
                            setDeleting(item);
                            setOpenDelete(true);
                          }}
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* ADD MODAL */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Thêm Mùa Giải</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              placeholder="Tên mùa giải"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                onChange={(e) =>
                  setAddForm({ ...addForm, startDate: e.target.value })
                }
              />
              <Input
                type="date"
                onChange={(e) =>
                  setAddForm({ ...addForm, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button className="w-full" onClick={handleAdd}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      {editing && (
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa Mùa Giải</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startDate: e.target.value })
                  }
                />

                <Input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button className="w-full" onClick={handleUpdate}>
                Cập nhật
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* DELETE MODAL */}
      {deleting && (
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Xóa Mùa Giải</DialogTitle>
              <DialogDescription>
                Bạn có chắc muốn xóa{" "}
                <span className="font-semibold">{deleting.name}</span>?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Hủy
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
