"use client"

import { resultApi } from "@/lib/api/matches";
import type { StandingTeam } from "@/lib/types";
import { useEffect, useState } from "react";
import Image from "next/image"
import { toast } from "react-toastify";

export function Rankings() {
    const [standings, setStandings] = useState<StandingTeam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
        try {
            setLoading(true);
            // Get standings from API (no seasonId param)
            const response = await resultApi.getStandings(); 
            
            if (response && response.data) {
                setStandings(response.data);
            }
        } catch (error) {
            console.error("Error fetching standings:", error);
            toast.error("Không thể tải bảng xếp hạng");
        } finally {
            setLoading(false);
        }
    };

    fetchStandings();
    }, []);

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h3 className="text-lg font-bold text-white">Bảng Xếp Hạng</h3>
                <div className="flex gap-1 p-1 bg-black/20 rounded-full border border-white/5 backdrop-blur-md">
                    <button className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition">Mùa mới</button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow-lg shadow-blue-500/30">V-League 1</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs uppercase bg-white/5 text-slate-300">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg text-center font-semibold">#</th>
                            <th className="px-4 py-3 font-semibold">Đội Bóng</th>
                            <th className="px-4 py-3 text-center font-semibold">T-H-B</th>
                            <th className="px-4 py-3 text-center font-semibold">+/-</th>
                            <th className="px-4 py-3 rounded-r-lg text-center font-bold text-white">Điểm</th>
                        </tr>
                    </thead>
                    
                    <tbody className="">
                        {/* Loading State */}
                        {loading && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Đang tải dữ liệu...</td>
                            </tr>
                        )}

                        {/* Empty State */}
                        {!loading && standings.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">Chưa có dữ liệu bảng xếp hạng</td>
                            </tr>
                        )}

                        {/* Data Mapping */}
                        {!loading && standings.map((team, index) => (
                            <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                <td className="px-4 py-4 text-center">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded font-bold text-xs shadow-lg
                                        ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                                        index <= 2 ? 'bg-blue-400 text-blue-950' : 'bg-white/10 text-white'}`}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="px-4 py-4 font-medium text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden border border-white/10 relative bg-white/5">
                                        {team.team.image ? (
                                            <Image 
                                                src={team.team.image} 
                                                alt={team.team.name} 
                                                fill 
                                                className="object-cover p-0.5"
                                                sizes="32px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                                                {team.team.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>                            
                                    {team.team.name}
                                </td>
                                <td className="px-4 py-4 text-center font-mono text-slate-400">
                                    {team.won}-{team.drawn}-{team.lost}
                                </td>
                                <td className="px-4 py-4 text-center font-medium">
                                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg font-bold border border-emerald-500/20">
                                        {team.points}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}