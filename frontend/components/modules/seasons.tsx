"use client";

import { useState } from "react";
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

export default function SeasonsModule() {
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null);

  const data = [
    {
      name: "Giải bóng đá hạng Nhì Quốc gia",
      status: "Chưa bắt đầu",
      start: "26-03-05",
      end: "26-12-01",
      teams: 11,
    },
    {
      name: "Giải bóng đá 4.1 toàn quốc",
      status: "Đang diễn ra",
      start: "24-03-05",
      end: "24-12-01",
      teams: 14,
    },
    {
      name: "NIGHT WOLF VLEAGUE 1 - 2023/24",
      status: "Đang diễn ra",
      start: "23-10-20",
      end: "24-06-30",
      teams: 14,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Danh Sách Mùa Giải
      </h1>

      {/* FILTERS */}
      <div className="flex gap-4 items-center mb-8">
        <Input
          placeholder="Tên mùa giải"
          className="w-64 shadow-sm"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <Select onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 shadow-sm">
            <SelectValue placeholder="Tình Trạng" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="running">Đang diễn ra</SelectItem>
            <SelectItem value="pending">Chưa bắt đầu</SelectItem>
            <SelectItem value="ended">Kết thúc</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white shadow"
            onClick={() => setOpenAdd(true)}
          >
            + Thêm Mùa Giải
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow">
            Xuất Dữ Liệu
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Card className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* HEADER */}
        <CardHeader className="grid grid-cols-[2fr,1fr,1fr,1fr,0.7fr,0.4fr] px-6 py-4 font-semibold text-sm text-gray-700 bg-gray-100">
          <div>Tên Mùa Giải</div>
          <div>Tình Trạng</div>
          <div>Ngày Bắt Đầu</div>
          <div>Ngày Kết Thúc</div>
          <div>Số Đội</div>
          <div className="text-center">Thao Tác</div>
        </CardHeader>

        <CardContent className="px-0">
          {data.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr,1fr,1fr,1fr,0.7fr,0.4fr] px-6 py-4 items-center text-sm 
                hover:bg-gray-50 transition-colors border-b last:border-0"
            >
              {/* Tên */}
              <div className="text-blue-700 font-medium hover:underline cursor-pointer">
                {item.name}
              </div>

              {/* Tình trạng */}
              <div>
               <span
  className={`px-2 py-1 rounded-md text-xs font-medium border
    ${
      item.status === "Đang diễn ra"
        ? "bg-blue-100 text-blue-700 border-blue-300"
        : item.status === "Chưa bắt đầu"
        ? "bg-yellow-100 text-yellow-700 border-yellow-300"
        : item.status === "Kết thúc"
        ? "bg-red-100 text-red-700 border-red-300"
        : "bg-gray-100 text-gray-700 border-gray-300"
    }
  `}
>
  {item.status}
</span>
              </div>

              <div className="text-gray-700">{item.start}</div>
              <div className="text-gray-700">{item.end}</div>

              <div className="font-medium text-gray-800">{item.teams}</div>

              {/* Dropdown 3 chấm */}
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditing(item);
                        setOpenEdit(true);
                      }}
                    >
                      Chỉnh sửa
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-600"
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
          ))}
        </CardContent>
      </Card>

    {/* ADD MODAL */}
<Dialog open={openAdd} onOpenChange={setOpenAdd}>
  <DialogContent className="max-w-md rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold">Thêm Mùa Giải</DialogTitle>
      <p className="text-sm text-gray-500">Điền thông tin bên dưới để tạo mùa giải mới.</p>
    </DialogHeader>

    <div className="space-y-4 py-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Tên mùa giải</label>
        <Input placeholder="VD: Mùa giải 2025" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Ngày bắt đầu</label>
          <Input type="date" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
          <Input type="date" />
        </div>
      </div>
    </div>

    <DialogFooter>
      <Button className="w-full" onClick={() => setOpenAdd(false)}>
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
        <DialogTitle className="text-lg font-semibold">Chỉnh sửa Mùa Giải</DialogTitle>
        <p className="text-sm text-gray-500">Cập nhật thông tin mùa giải.</p>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Tên mùa giải</label>
          <Input defaultValue={editing.name} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Ngày bắt đầu</label>
            <Input type="date" defaultValue={editing.start} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
            <Input type="date" defaultValue={editing.end} />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button className="w-full" onClick={() => setOpenEdit(false)}>
          Cập nhật
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}


      {/* DELETE CONFIRM MODAL */}
      {deleting && (
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Xóa Mùa Giải</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa "
                <span className="font-semibold">{deleting.name}</span>"?
                <br />
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Hủy
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  alert("Đã xóa: " + deleting.name);
                  setOpenDelete(false);
                }}
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
