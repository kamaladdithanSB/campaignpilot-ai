'use client'

import { Send, CheckCircle, Eye, MousePointerClick, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export function MetricsCards() {
  const metrics = [
    {
      label: 'Sent',
      value: '45,230',
      icon: Send,
      change: '+12%',
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Delivered',
      value: '44,891',
      icon: CheckCircle,
      change: '+12%',
      color: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
    },
    {
      label: 'Opened',
      value: '28,156',
      icon: Eye,
      change: '+8%',
      color: 'from-cyan-500/20 to-cyan-600/10',
      iconColor: 'text-cyan-400',
    },
    {
      label: 'Clicked',
      value: '12,742',
      icon: MousePointerClick,
      change: '+15%',
      color: 'from-violet-500/20 to-violet-600/10',
      iconColor: 'text-violet-400',
    },
    {
      label: 'Conversions',
      value: '3,892',
      icon: ShoppingCart,
      change: '+23%',
      color: 'from-orange-500/20 to-orange-600/10',
      iconColor: 'text-orange-400',
    },
    {
      label: 'Revenue',
      value: '$287,450',
      icon: DollarSign,
      change: '+31%',
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.label}
            className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden transition-all duration-300 group hover:border-border hover:shadow-xl hover:shadow-accent/5"
          >
            {/* Background gradient accent */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{metric.label}</p>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{metric.value}</h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{metric.change} from last week</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} border border-border/40 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                <Icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-accent/30 via-accent/50 to-transparent transition-all duration-300" />
          </div>
        )
      })}
    </div>
  )
}
