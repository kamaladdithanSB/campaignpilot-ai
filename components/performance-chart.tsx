'use client'

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Activity } from 'lucide-react'

export function PerformanceChart() {
  const data = [
    { day: 'Mon', sent: 2400, delivered: 2240, opened: 1420, clicked: 580 },
    { day: 'Tue', sent: 2210, delivered: 2140, opened: 1221, clicked: 680 },
    { day: 'Wed', sent: 2290, delivered: 2200, opened: 1529, clicked: 720 },
    { day: 'Thu', sent: 2000, delivered: 1980, opened: 1400, clicked: 640 },
    { day: 'Fri', sent: 2181, delivered: 2100, opened: 1200, clicked: 750 },
    { day: 'Sat', sent: 2500, delivered: 2450, opened: 1800, clicked: 890 },
    { day: 'Sun', sent: 2100, delivered: 2050, opened: 1600, clicked: 820 },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-semibold text-sm">{payload[0].payload.day}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs mt-1" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-7 overflow-hidden hover:border-border transition-all duration-300 group">
      {/* Background accent effect */}
      <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-center justify-between mb-8 pb-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Campaign Performance</h2>
            <p className="text-xs text-muted-foreground mt-1">7-day neural-powered insights</p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
          <XAxis dataKey="day" stroke="hsl(var(--color-muted-foreground))" />
          <YAxis stroke="hsl(var(--color-muted-foreground))" />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="sent"
            stroke="hsl(var(--color-primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="delivered"
            stroke="hsl(var(--color-accent))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="opened"
            stroke="hsl(var(--color-chart-3))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="clicked"
            stroke="hsl(var(--color-chart-4))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
