"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data to simulate historical server activity
const data = [
  { name: 'Mon', views: 4000, interactions: 2400 },
  { name: 'Tue', views: 3000, interactions: 1398 },
  { name: 'Wed', views: 2000, interactions: 9800 },
  { name: 'Thu', views: 2780, interactions: 3908 },
  { name: 'Fri', views: 1890, interactions: 4800 },
  { name: 'Sat', views: 2390, interactions: 3800 },
  { name: 'Sun', views: 3490, interactions: 4300 },
];

export default function AdminCharts() {
  return (
    <div className="bg-black/50 border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-10 shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#007fd4]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 text-white">
          <div className="w-3 h-3 bg-[#007fd4] animate-pulse rounded-full shadow-[0_0_10px_#007fd4]"></div>
          Live Network Traffic
        </h2>
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold border border-white/10 px-3 py-1 rounded-full">
          Last 7 Days (Simulated)
        </div>
      </div>

      <div className="h-[300px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007fd4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#007fd4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#9c27b0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="interactions" stroke="#9c27b0" strokeWidth={2} fillOpacity={1} fill="url(#colorInteractions)" />
            <Area type="monotone" dataKey="views" stroke="#007fd4" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
