'use client'

import { Send, CheckCircle, AlertCircle, Eye, MousePointerClick, ShoppingCart, Zap } from 'lucide-react'

export function CampaignExecutionCenter() {
  const executionMetrics = [
    {
      label: 'Queued',
      value: 2145,
      percentage: 5,
      icon: Send,
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
      barColor: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Delivered',
      value: 42089,
      percentage: 93,
      icon: CheckCircle,
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
      barColor: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Failed',
      value: 96,
      percentage: 2,
      icon: AlertCircle,
      color: 'from-red-500/20 to-red-600/10',
      iconColor: 'text-red-400',
      barColor: 'from-red-500 to-red-600',
    },
    {
      label: 'Opened',
      value: 28156,
      percentage: 67,
      icon: Eye,
      color: 'from-cyan-500/20 to-cyan-600/10',
      iconColor: 'text-cyan-400',
      barColor: 'from-cyan-500 to-cyan-600',
    },
    {
      label: 'Clicked',
      value: 12742,
      percentage: 45,
      icon: MousePointerClick,
      color: 'from-violet-500/20 to-violet-600/10',
      iconColor: 'text-violet-400',
      barColor: 'from-violet-500 to-violet-600',
    },
    {
      label: 'Converted',
      value: 3892,
      percentage: 31,
      icon: ShoppingCart,
      color: 'from-orange-500/20 to-orange-600/10',
      iconColor: 'text-orange-400',
      barColor: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Campaign Execution Center</h2>
        </div>
        <p className="text-muted-foreground text-sm">Real-time delivery metrics across channels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {executionMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.label}
              className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden hover:border-border transition-all duration-300 group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} border border-border/40 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                  </div>
                </div>

                {/* Value */}
                <div>
                  <p className="text-3xl font-bold text-foreground">{metric.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">{metric.percentage}% of campaign</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full h-2 rounded-full bg-border/40 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${metric.barColor} transition-all duration-500`}
                      style={{ width: `${metric.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-accent/30 via-accent/50 to-transparent transition-all duration-300" />
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="relative rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 to-primary/5 p-6 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-3">
          <h3 className="font-bold text-foreground">Campaign Performance Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Open Rate</p>
              <p className="text-2xl font-bold text-foreground">67%</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Click Rate</p>
              <p className="text-2xl font-bold text-foreground">45%</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Conversion</p>
              <p className="text-2xl font-bold text-foreground">31%</p>
            </div>
          </div>
          <p className="text-sm text-foreground/80 mt-4">The campaign is actively delivering. Real-time metrics update as messages are sent, opened, and converted. All channels are performing within predicted parameters.</p>
        </div>
      </div>
    </div>
  )
}
