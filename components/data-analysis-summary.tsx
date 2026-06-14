'use client'

import { Users, ShoppingCart, DollarSign, TrendingUp, Sparkles } from 'lucide-react'
import type { CustomerSegment } from '@/lib/types'

interface DataAnalysisSummaryProps {
  data: {
    customersImported: number
    ordersImported: number
    totalRevenue: string
    averageOrderValue?: string
    segments?: CustomerSegment[]
  }
}

export function DataAnalysisSummary({ data }: DataAnalysisSummaryProps) {
  const stats = [
    {
      label: 'Total Customers',
      value: (data.customersImported ?? 0).toLocaleString(),
      icon: Users,
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Total Orders',
      value: (data.ordersImported ?? 0).toLocaleString(),
      icon: ShoppingCart,
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Total Revenue',
      value: data.totalRevenue || '$0.00',
      icon: DollarSign,
      color: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Avg Order Value',
      value: data.averageOrderValue || '$0.00',
      icon: TrendingUp,
      color: 'from-violet-500/20 to-violet-600/10',
      iconColor: 'text-violet-400',
    },
  ];

  const segments = data.segments || [];

  return (
    <div className="space-y-8">
      <div className="relative rounded-xl border border-border/60 bg-gradient-to-br from-accent/10 via-primary/5 to-background p-6 overflow-hidden">
        <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-40" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Your Data, Analyzed for Revenue</h2>
          </div>
          <p className="text-muted-foreground">
            CampaignPilot found {segments.length} customer segments with clear revenue opportunities in your uploaded data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden hover:border-border transition-all duration-300 group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative z-10 space-y-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} border border-border/40 w-fit`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {segments.length > 0 && (() => {
        const top = [...segments].sort((a, b) => b.revenueContribution - a.revenueContribution)[0];
        return (
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-sm text-foreground font-semibold">
              Top opportunity: <span className="text-accent">{top.name}</span> —{' '}
              {top.customerCount.toLocaleString()} customers contributing{' '}
              ${top.revenueContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })} in revenue.
              Tell the AI your goal below to build a campaign for this segment.
            </p>
          </div>
        );
      })()}
    </div>
  );
}
