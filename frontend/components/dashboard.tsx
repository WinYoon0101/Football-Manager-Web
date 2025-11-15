"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trophy, Users, FileText, Settings, Menu, X, Home, UserCircle, Shield } from "lucide-react"

import OverviewModule from "./modules/overview"
import TeamsModule from "./modules/teams"
import PlayersModule from "./modules/players"
import SeasonsModule from "./modules/seasons"
import ReportsModule from "./modules/reports"
import SettingsModule from "./modules/settings"
import UsersModule from "./modules/users"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { id: "overview", label: "Tổng Quan", icon: Home },
    { id: "teams", label: "Đội Bóng", icon: Shield },
    { id: "players", label: "Cầu Thủ", icon: Users },
    { id: "seasons", label: "Mùa Giải", icon: Trophy },
    { id: "reports", label: "Báo Cáo", icon: FileText },
    { id: "users", label: "Người Dùng", icon: UserCircle },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white 
        border-r border-border transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">FOOTBALL</h1>
                <p className="text-xs text-muted-foreground">SERIES</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
       
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && <OverviewModule />}
          {activeTab === "teams" && <TeamsModule />}
          {activeTab === "players" && <PlayersModule />}
          {activeTab === "seasons" && <SeasonsModule />}
          {activeTab === "reports" && <ReportsModule />}
          {activeTab === "settings" && <SettingsModule />}
          {activeTab === "users" && <UsersModule />}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}