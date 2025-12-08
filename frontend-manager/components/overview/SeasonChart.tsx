"use client"

import { useState, useEffect, useMemo } from "react"
import { seasonApi } from "@/lib/api/seasons"
import type { Season } from "@/lib/types"

export function SeasonChart() {
    const [seasons, setSeasons] = useState<Season[]>([])
    const [loading, setLoading] = useState(true)

    // Get All seasons
    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                setLoading(true)
                const response = await seasonApi.getAll()
                setSeasons(response.data)
            } catch (error) {
                console.error("Error fetching seasons:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSeasons()
    }, [])

    // Build chart data
    const chartSegments = useMemo(() => {
        if (seasons.length === 0) return [];

        const now = new Date();
        let ongoing = 0;
        let upcoming = 0;
        let finished = 0;

        seasons.forEach((season) => {
            if (!season.startDate || !season.endDate) {
                upcoming++;
                return;
            }
            const start = new Date(season.startDate);
            const end = new Date(season.endDate);

            if (now < start) upcoming++;
            else if (now > end) finished++;
            else ongoing++;
        });

        const total = seasons.length;
        
        return [
            { label: "Đang diễn ra", count: ongoing, percent: (ongoing / total) * 100, color: "#34d399", glow: "rgba(52,211,153,0.5)" },
            { label: "Chưa bắt đầu", count: upcoming, percent: (upcoming / total) * 100, color: "#94a3b8", glow: "rgba(148,163,184,0.3)" },
            { label: "Đã kết thúc", count: finished, percent: (finished / total) * 100, color: "#f87171", glow: "rgba(248,113,113,0.4)" },
        ];
    }, [seasons]);
    const size = 160; 
    const strokeWidth = 16; 
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;
    const overlapAmount = 1; 
    let accumulatedLength = 0;

    if (loading) return <div className="h-full flex items-center justify-center text-slate-400 p-6 bg-white/5 rounded-[24px]">Đang tải...</div>;
    
    return (
        <div className="flex flex-col h-full p-6 rounded-[24px] 
                        bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        
            {/* Header */}
            <div className="mb-4 relative z-10">
                <h3 className="text-lg font-bold text-white">Mùa Giải</h3>
            </div>
            
            <div className="flex items-center justify-center gap-8 relative z-10 h-full">
                
                {/* Chart */}
                <div className="relative flex-shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />

                    <div className="relative" style={{ width: size, height: size }}>
                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 drop-shadow-lg">
                            <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
                            {chartSegments.map((seg, i) => {
                                if (seg.percent === 0) return null;
                                const segmentLength = (seg.percent / 100) * circumference;     
                                const drawLength = segmentLength + overlapAmount;
                                const currentOffset = accumulatedLength;                                
                                accumulatedLength += segmentLength;
                                return (
                                    <circle
                                        key={i}
                                        cx={center} cy={center} r={radius}
                                        fill="none"
                                        stroke={seg.color}
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={`${drawLength} ${circumference - drawLength}`}
                                        strokeDashoffset={-currentOffset} 
                                        strokeLinecap="butt"  // head of segment style
                                        className="transition-all duration-500 hover:stroke-[18px] cursor-pointer"
                                        style={{ filter: `drop-shadow(0 0 4px ${seg.glow})` }}
                                    >
                                        <title>{seg.label}: {seg.count} mùa</title>
                                    </circle>
                                );
                            })}
                        </svg>
                            
                        {/* Data in the center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black text-white drop-shadow-md">{seasons.length}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-[-2px]">Mùa giải</span>
                        </div>
                    </div>
                </div>

                {/* Legend of chart */}
                <div className="flex flex-col justify-center gap-4">
                    {chartSegments.map((seg, i) => (
                        <div key={i} className="flex items-center gap-3 group cursor-pointer">
                            <div 
                                className="w-3 h-3 rounded-full shadow-sm transition-transform group-hover:scale-125 duration-300 flex-shrink-0"
                                style={{ backgroundColor: seg.color, boxShadow: `0 0 8px ${seg.glow}` }} 
                            />
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">
                                    {seg.label}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                    {seg.count} mùa 
                                </span>
                            </div>
                        </div>
                    ))}
                    {chartSegments.length === 0 && (
                        <span className="text-sm text-slate-500">Chưa có dữ liệu</span>
                    )}
                </div>

            </div>
        </div>
    )
}