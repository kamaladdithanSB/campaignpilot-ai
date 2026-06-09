'use client'

import { Database, Users, ShoppingCart, Crown, AlertTriangle, Sparkles } from 'lucide-react'

interface DataAnalysisSummaryProps {
  data: {
    customersImported: number
    ordersImported: number
    totalRevenue: string
    vipCustomers: number
    churnRiskCustomers: number
    highValueSegments: number
  }
}

export function DataAnalysisSummary({ data }: DataAnalysisSummaryProps) {
  const stats = [
    {
      label: 'Customers Imported',
      value: data.customersImported.toLocaleString(),
      icon: Users,
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Orders Analyzed',
      value: data.ordersImported.toLocaleString(),
      icon: ShoppingCart,
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Revenue Processed',
      value: data.totalRevenue,
      icon: Database,
      color: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-400',
    },
  ]

  const insights = [
    {
      title: 'VIP Customers Found',
      value: data.vipCustomers.toLocaleString(),
      description: 'Top 5% high-value customers',
      icon: Crown,
      color: 'from-yellow-500/20 to-yellow-600/10',
      iconColor: 'text-yellow-400',
    },
    {
      title: 'Churn-Risk Identified',
      value: data.churnRiskCustomers.toLocaleString(),
      description: 'Inactive 30+ days',
      icon: AlertTriangle,
      color: 'from-red-500/20 to-red-600/10',
      iconColor: 'text-red-400',
    },
    {
      title: 'Valuable Segments',
      value: data.highValueSegments,
      description: 'Discovery ready for targeting',
      icon: Sparkles,
      color: 'from-violet-500/20 to-violet-600/10',
      iconColor: 'text-violet-400',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative rounded-xl border border-border/60 bg-gradient-to-br from-accent/10 via-primary/5 to-background p-6 overflow-hidden">
        <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-40" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Your Data Has Been Analyzed</h2>
          </div>
          <p className="text-muted-foreground">CampaignPilot's neural engine discovered actionable insights in your customer data. You&apos;re ready to launch campaigns.</p>
        </div>
      </div>

      {/* Import Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden hover:border-border transition-all duration-300 group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} border border-border/40`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-all duration-300" />
            </div>
          )
        })}
      </div>

      {/* Discovered Insights */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">AI-Discovered Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => {
            const Icon = insight.icon
            return (
              <div
                key={insight.title}
                className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden transition-all duration-300 group hover:border-border hover:shadow-lg hover:shadow-accent/5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${insight.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-all duration-300" />

                <div className="relative z-10 space-y-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.color} border border-border/40 w-fit`}>
                    <Icon className={`w-6 h-6 ${insight.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{insight.value}</p>
                    <p className="text-sm font-semibold text-muted-foreground mt-1">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-2">{insight.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
        <p className="text-sm text-foreground font-semibold">Your data is loaded and ready. Now tell CampaignPilot your first marketing goal above.</p>
      </div>
    </div>
  )
}
