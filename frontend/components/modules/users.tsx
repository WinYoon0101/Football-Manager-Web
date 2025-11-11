"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, ArrowLeft, Mail, UserIcon, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/lib/types"

interface UsersModuleProps {
  users: User[]
  setUsers: (users: User[]) => void
}

export default function UsersModule({ users, setUsers }: UsersModuleProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "manager" | "viewer",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }
    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      username: newUser.email.split("@")[0], // Generate username from email
      role: newUser.role,
      createdAt: new Date().toISOString(),
    }
    setUsers([...users, user])
    setNewUser({ name: "", email: "", password: "", role: "viewer" })
    setShowAddDialog(false)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">Quản Trị Viên</Badge>
      case "manager":
        return <Badge variant="secondary">Quản Lý Đội Bóng</Badge>
      default:
        return <Badge variant="outline">Người Xem</Badge>
    }
  }

  const getRolePermissions = (role: string) => {
    switch (role) {
      case "admin":
        return [
          "Quản lý toàn bộ hệ thống",
          "Thêm/Xóa/Sửa người dùng",
          "Quản lý mùa giải và quy định",
          "Quản lý đội bóng và cầu thủ",
          "Xem báo cáo và thống kê",
        ]
      case "manager":
        return [
          "Quản lý đội bóng được phân công",
          "Thêm/Sửa cầu thủ trong đội",
          "Ghi nhận kết quả trận đấu",
          "Xem báo cáo và thống kê",
        ]
      default:
        return ["Xem thông tin giải đấu", "Xem bảng xếp hạng", "Xem lịch thi đấu"]
    }
  }

  if (showDetail && selectedUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
            <p className="text-muted-foreground">{selectedUser.email}</p>
          </div>
          <Button variant="outline" onClick={() => setShowDetail(false)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay Lại
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Tài Khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedUser.name}</p>
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tên đăng nhập</p>
                    <p className="font-medium">{selectedUser.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày tạo</p>
                    <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quyền Hạn</CardTitle>
              <CardDescription>
                Các quyền hạn của vai trò{" "}
                {selectedUser.role === "admin"
                  ? "Quản Trị Viên"
                  : selectedUser.role === "manager"
                    ? "Quản Lý Đội Bóng"
                    : "Người Xem"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {getRolePermissions(selectedUser.role).map((permission, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs">✓</span>
                    </div>
                    <p className="text-sm">{permission}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt Động Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Chưa có hoạt động nào được ghi nhận</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm Người Dùng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
              <DialogDescription>Nhập thông tin người dùng</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Họ Tên *</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <Label>Mật Khẩu *</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <div>
                <Label>Vai Trò *</Label>
                <Select value={newUser.role} onValueChange={(v: any) => setNewUser({ ...newUser, role: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Quản Trị Viên</SelectItem>
                    <SelectItem value="manager">Quản Lý Đội Bóng</SelectItem>
                    <SelectItem value="viewer">Người Xem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full">
                Thêm Người Dùng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Người Dùng</CardTitle>
          <CardDescription>Quản lý tài khoản và phân quyền người dùng hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ Tên</TableHead>
                <TableHead>Tên Đăng Nhập</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai Trò</TableHead>
                <TableHead>Ngày Tạo</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedUser(user)
                    setShowDetail(true)
                  }}
                >
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Edit functionality
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => handleDelete(user.id, e)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
