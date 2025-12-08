"use client"
import { useState, useEffect } from "react"
import { resultApi } from "@/lib/api/matches" 
import type { Match } from "@/lib/types"
import type { Team } from "@/lib/types"
import Image from "next/image";
export function UpcomingMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch upcoming matches 
    const fetchMatches = async () => {
      try {
        setIsLoading(true)
        const response = await resultApi.getUpcomingMatches()
        setMatches(response.data) 
      } catch (err) {
        console.error("Lỗi tải lịch thi đấu:", err)
        setError("Không thể tải lịch thi đấu.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [])
  // Get Time (HH:MM) from Date
  const formatTime = (dateInput: string | Date) => {
      const date = new Date(dateInput);
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  // Get Date (DD/MM) from Date
  const formatDate = (dateInput: string | Date) => {
      const date = new Date(dateInput);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }
  return (
    <div className="flex flex-col h-full p-6 rounded-[24px] border border-white/20 shadow-2xl relative overflow-hidden bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70" />

      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h3 className="text-lg font-bold text-white drop-shadow-md">Lịch Thi Đấu</h3>
          <button className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10">
            Xem tất cả
          </button>
      </div>
      
      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[450px]">
        {matches.map((match, idx) => (
            <div key={idx} className="flex items-center p-3 rounded-2xl bg-black/20 hover:bg-white/10 transition duration-300 border border-white/5 group cursor-pointer backdrop-blur-sm">
                
                {/* Column Time */}
                <div className="text-center w-14 flex-shrink-0 border-r border-white/10 pr-2 mr-2">
                    <div className="text-white font-bold text-sm group-hover:text-blue-300 transition">{formatTime(match.matchTime)}</div>
                    <div className="text-[10px] text-slate-300 mt-1">{formatDate(match.matchTime)}</div>
                </div>
                
                {/* Column Teams */}
                <div className="flex items-center justify-between flex-1 gap-2">
                     
                     {/* Team 1: Right aligned (Text -> Logo) */}
                     <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-white text-left hidden sm:block leading-tight line-clamp-2 break-words">
                            {match.team1?.name}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/10 ring-2 ring-white/10 flex-shrink-0 overflow-hidden relative flex items-center justify-center">
                            {match.team1?.image ? (
                                <Image 
                                    src={match.team1.image} 
                                    alt={match.team1.name} 
                                    fill 
                                    className="object-cover p-0.5" 
                                    sizes="32px"
                                />
                            ) : (
                                <span className="text-[10px] font-bold text-slate-300">
                                    {match.team1?.name.charAt(0)}
                                </span>
                            )}
                        </div>
                      </div>

                     <span className="text-slate-500 text-[10px] font-bold px-1">VS</span>

                     {/* Team 2: Left aligned (Logo -> Text) */}
                     <div className="flex items-center justify-start gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-white/10 ring-2 ring-white/10 flex-shrink-0 overflow-hidden relative flex items-center justify-center">
                            {match.team2?.image ? (
                                <Image 
                                    src={match.team2.image} 
                                    alt={match.team2.name} 
                                    fill 
                                    className="object-cover p-0.5" 
                                    sizes="32px"
                                />
                            ) : (
                                <span className="text-[10px] font-bold text-slate-300">
                                    {match.team2?.name.charAt(0)}
                                </span>
                            )}
                        </div>  
                                              
                        <span className="text-[11px] font-bold text-white text-left hidden sm:block leading-tight line-clamp-2 break-words">
                            {match.team2?.name}
                        </span>
                     </div>

                </div>
            </div>
        ))}
      </div>
    </div>
  )
}