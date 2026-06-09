'use client'

import { Crown, AlertTriangle, User, Zap, ArrowRight } from 'lucide-react'

export function CustomerInsights() {
  const insights = [
    {
      title: 'VIP Customers',
      count: '1,247',
      subtitle: 'Top 5% spenders',
      description: 'High-value customers with consistent purchase history',
      icon: Crown,
      gradientFrom: 'from-yellow-500/20 to-yellow-600/10',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
      action: 'Segment for exclusive offers',
    },
    {
      title: 'At-Risk Customers',
      count: '2,841',
      subtitle: 'Inactive 30+ days',
      description: 'Previously active customers showing declining engagement',
      icon: AlertTriangle,
      gradientFrom: 'from-red-500/20 to-red-600/10',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/20',
      action: 'Launch win-back campaign',
    },
    {
      title: 'One-Time Buyers',
      count: '8,920',
      subtitle: 'Single purchase',
      description: 'First-time purchasers with high repeat potential',
      icon: User,
      gradientFrom: 'from-cyan-500/20 to-cyan-600/10',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
      action: 'Send loyalty introduction',
    },
    {
      title: 'High-Value Shoppers',
      count: '3,562',
      subtitle: 'Avg. order $150+',
      description: 'Customers with consistent high-value purchases',
      icon: Zap,
      gradientFrom: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      action: 'Upsell premium products',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Customer Insights</h2>
        <p className="text-muted-foreground mt-1.5 text-sm">Neural-powered audience segmentation & AI recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div
              key={insight.title}
              className={`relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden transition-all duration-300 group hover:border-border hover:shadow-lg hover:shadow-accent/5`}
            >
              {/* Gradient background effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${insight.gradientFrom} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-all duration-300" />

              <div className="relative z-10 space-y-4">
                {/* Header with icon */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.gradientFrom} border ${insight.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${insight.iconColor}`} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
                    AI Segment
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{insight.title}</p>
                    <h3 className="text-3xl font-bold text-foreground mt-2">{insight.count}</h3>
                    <p className="text-xs text-muted-foreground mt-1.5 font-medium">{insight.subtitle}</p>
                  </div>

                  <p className="text-sm text-foreground/80 leading-relaxed">{insight.description}</p>

                  {/* Action button */}
                  <button className="w-full mt-4 py-2.5 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60 text-accent font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 group-hover:gap-3">
                    {insight.action}
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
