"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Home,
  UserCircle,
  Shield,
} from "lucide-react";

import OverviewModule from "./modules/overview";
import TeamsModule from "./modules/teams";
import PlayersModule from "./modules/players";
import SeasonsModule from "./modules/seasons";
import ReportsModule from "./modules/reports";
import UsersModule from "./modules/users";
import SettingsModule from "./modules/settings";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/utils/auth";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

   const router = useRouter();

   const handleLogout = () => {
    // Xóa token/user ở localStorage và cookie
    clearAuth();
    localStorage.removeItem("dashboardActiveTab");

    // Redirect về login
    router.push("/login");
  };

  const navItems = [
    { id: "overview", label: "Tổng Quan", icon: Home },
    { id: "teams", label: "Đội Bóng", icon: Shield },
    { id: "players", label: "Cầu Thủ", icon: Users },
    { id: "seasons", label: "Mùa Giải", icon: Trophy },
    { id: "reports", label: "Báo Cáo", icon: FileText },
    { id: "users", label: "Người Dùng", icon: UserCircle },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ];

  const pageBackgroundStyle = {
    backgroundImage:
      'linear-gradient(rgba(8, 21, 56, 0.5), rgba(8, 21, 56, 0.55)), url("/bg.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  } as const;

  // Load tab gần nhất khi component mount
  useEffect(() => {
    const lastTab = localStorage.getItem("dashboardActiveTab");
    if (lastTab) setActiveTab(lastTab);
  }, []);

  // Hàm đổi tab và lưu vào localStorage
  const handleSetTab = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("dashboardActiveTab", tab);
  };

  return (
    <div className="flex h-screen" style={pageBackgroundStyle}>
      <aside
  className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64
    border-r transition-transform duration-300 ease-in-out flex flex-col
    border border-[#3872ec]/40 bg-gradient-to-br from-[#1e3c8f] via-[#3872ec] to-[#2c417f] text-white shadow-2xl`}
>
  {/* Sidebar Header */}
  <div className="p-6 border-b border-white/20">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">FOOTBALL</h1>
          <p className="text-xs text-gray-200">SERIES</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden hover:bg-gray-100"
        onClick={() => setSidebarOpen(false)}
      >
        <X className="h-5 w-5 text-gray-700" />
      </Button>
    </div>
  </div>

  {/* Sidebar Navigation + Logout */}
  <div className="flex flex-col justify-between flex-1 p-4 overflow-y-auto">
    {/* Navigation Items */}
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              handleSetTab(item.id);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-white text-blue-600 shadow-sm text-lg"
                : "text-white hover:bg-white/10 text-sm hover:text-white"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-white"}`} />
            {item.label}
          </button>
        );
      })}
    </div>

    {/* Logout */}
    <button
       onClick={handleLogout}
      className="w-full flex items-center gap-3 px-6 py-4 mt-4 rounded-lg text-base text-white/80 bg-white/20 hover:bg-red-400/40 transition-all"
    >
      <UserCircle className="h-6 w-6" />
      Đăng xuất
    </button>
  </div>
</aside>


      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <main className="flex-1 overflow-y-auto p-6 bg-black/30 min-h-0">
          {activeTab === "overview" && <OverviewModule />}
          {activeTab === "teams" && <TeamsModule />}
          {activeTab === "players" && <PlayersModule />}
          {activeTab === "seasons" && <SeasonsModule />}
          {activeTab === "reports" && <ReportsModule />}
          {activeTab === "users" && <UsersModule />}
          {activeTab === "settings" && <SettingsModule />}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}