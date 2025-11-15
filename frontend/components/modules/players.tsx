"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

export default function PlayersModule() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Quản lý cầu thủ</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Thêm cầu thủ
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm cầu thủ..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Tên cầu thủ</th>
              <th className="p-3 text-left">Đội</th>
              <th className="p-3 text-left">Loại</th>
              <th className="p-3 text-left">Ghi chú</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>

          {/* Không có dữ liệu */}
          <tbody>
            <tr>
              <td colSpan={5} className="text-center p-6 text-muted-foreground">
                Chưa có cầu thủ nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
