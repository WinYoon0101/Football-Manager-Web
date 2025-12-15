"use client"

import { StatCards } from "@/components/overview/StatCards"
import { SeasonChart } from "@/components/overview/SeasonChart"
import {Rankings} from "@/components/overview/Ranking"
import { UpcomingMatches } from "@/components/overview/UpcomingMatches"

export default function OverviewModule() {
  return (
    <div className="min-h-screen p-6 space-y-6 text-white relative bg-cover bg-center bg-fixed font-sans">
      <div className="absolute inset-0 pointer-events-none z-0" />
      <div className="fixed -top-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed top-[20%] -right-[10%] w-[400px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed -bottom-[10%] left-[10%] w-[600px] h-[400px] bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
      <div className="relative z-10 max-w-[1600px] mx-auto">
          <div className="mb-8 pl-2 border-l-4 border-blue-500/80">
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
              Tổng Quan
            </h1>
            {/* <p className="text-blue-200/70 text-sm mt-1 font-medium">Tổng quan hệ thống quản lý giải đấu</p> */}
          </div>

          <StatCards />
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start mt-6">
            <div className="xl:col-span-7 space-y-6">
                <SeasonChart />
                <Rankings />
            </div>

            <div className="xl:col-span-5 h-full">
                <UpcomingMatches />
            </div>
          </div>
      </div>
    </div>
  )
}