"use client"

import { Trophy, Users, User, Newspaper } from "lucide-react"

import { useEffect, useState } from "react"
import { seasonApi } from "@/lib/api/seasons"
import type { Season } from "@/lib/types"
import { toast } from "react-toastify"
import {teamsAPI} from "@/lib/api/teams"
import type { Team } from "@/lib/types"
import {playersAPI} from "@/lib/api/players"
import type { Player } from "@/lib/types"
import { matchApi } from "@/lib/api/matches"
import type { Match } from "@/lib/types"
export function StatCards() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<Team[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  useEffect(() => {
    // Featch number of seasons
    const fetchSeasons = async () => {
      try {
        setLoading(true)
        const response = await seasonApi.getAll()
        setSeasons(response.data)
      } catch (error) {
        console.error("Error fetching seasons:", error)
        toast.error("Không thể tải thông tin mùa giải")
      } finally {
        setLoading(false)
      }
    }
    // Fetch number of teams
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const response = await teamsAPI.getAll()
        setTeams(response)
      } catch (error) {
        console.error("Error fetching teams:", error)
        toast.error("Không thể tải thông tin đội bóng")
      } finally {
        setLoading(false)
      }
    }
    // Fetch number of players
    const fetchPlayers = async () => {
      try {
        setLoading(true)
        const response = await playersAPI.getAll()
        setPlayers(response)
      } catch (error) {
        console.error("Error fetching players:", error)
        toast.error("Không thể tải thông tin cầu thủ")
      } finally {
        setLoading(false)
      }
    }
    // Fetch number of matches
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const response = await matchApi.getAll()
        setMatches(response.data)
      } catch (error) {
        console.error("Error fetching matches:", error)
        toast.error("Không thể tải thông tin trận đấu")
      } finally {
        setLoading(false)
      }
    }

    fetchSeasons()
    fetchTeams()
    fetchPlayers()
    fetchMatches()
  }, [])

  const stats = [
    { label: "Mùa Giải", value: seasons.length.toString(), icon: Trophy, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
    { label: "Đội Bóng", value: teams.length.toString(), icon: Users, color: "from-orange-500 to-orange-600", shadow: "shadow-orange-500/20" },
    { label: "Cầu Thủ", value: players.length.toString(), icon: User, color: "from-red-500 to-red-600", shadow: "shadow-red-500/20" },
    { label: "Trận Đấu", value: matches.length.toString(), icon: Newspaper, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div 
          key={index} 
          className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${item.color} shadow-lg ${item.shadow} text-white`}
        >
          <item.icon className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 rotate-12" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-sm font-medium text-white/80 uppercase tracking-wider">{item.label}</p>
              <h3 className="text-4xl font-bold mt-2">{item.value}</h3>
            </div>
            <div className="mt-4 p-2 bg-white/20 w-fit rounded-lg backdrop-blur-sm">
                <item.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}