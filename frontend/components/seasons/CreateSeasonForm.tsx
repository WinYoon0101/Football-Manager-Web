"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function CreateSeasonForm() {
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    teamCount: "",
    rules: false,
  });

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Submit:", form);
  };

  return (
    <div className="w-full flex justify-center py-10 bg-[#0e0f0f]">
      <Card className="w-full max-w-3xl bg-[#111] border border-gray-700 text-white p-6 rounded-2xl shadow-xl">
        <CardHeader>
          <h2 className="text-2xl font-bold mb-2">Thêm Mùa Giải Mới</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Tên mùa giải */}
            <div className="flex flex-col gap-2">
              <Label>Tên Mùa Giải*</Label>
              <Input
                className="bg-[#1b1d1d] border-gray-600 text-white"
                placeholder="Nhập tên mùa giải"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            {/* Ngày bắt đầu / ngày kết thúc */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Ngày Bắt Đầu*</Label>
                <Input
                  type="date"
                  className="bg-[#1b1d1d] border-gray-600 text-white"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Ngày Kết Thúc*</Label>
                <Input
                  type="date"
                  className="bg-[#1b1d1d] border-gray-600 text-white"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>

            {/* Số lượng đội */}
            <div className="flex flex-col gap-2">
              <Label>Số Lượng Đội*</Label>
              <Input
                type="number"
                className="bg-[#1b1d1d] border-gray-600 text-white"
                placeholder="Nhập số đội"
                value={form.teamCount}
                onChange={(e) => handleChange("teamCount", e.target.value)}
              />
            </div>

        

            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2 rounded-md"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
