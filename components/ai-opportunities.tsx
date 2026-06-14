'use client'

import { Crown, Clock, AlertTriangle, Calendar, DollarSign, Users } from 'lucide-react'
import type { CustomerSegment } from '@/lib/types'

interface AIOpportunitiesProps {
  segments?: CustomerSegment[]
  totalRevenue?: string
}

const SEGMENT_ICONS: Record<string, typeof Crown> = {
  'high-value': Crown,
  'recent-buyers': Clock,
  'at-risk': AlertTriangle,
  'weekend-shoppers': Calendar,
}

const SEGMENT_COLORS: Record<string, { gradient: string; iconColor: string }> = {
  'high-value': { gradient: 'from-amber-500/20 to-amber-600/10', iconColor: 'text-amber-400' },
  'recent-buyers': { gradient: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400' },
  'at-risk': { gradient: 'from-red-500/20 to-red-600/10', iconColor: 'text-red-400' },
  'weekend-shoppers': { gradient: 'from-violet-500/20 to-violet-600/10', iconColor: 'text-violet-400' },
}

export function AIOpportunities({ segments = [], totalRevenue }: AIOpportunitiesProps) {
  const totalCustomers = segments.reduce((sum, s) => sum + s.customerCount, 0);

  if (segments.length === 0) {
    return (
      <div className="p-8 rounded-3xl border border-border/40 bg-card/40 text-center">
        <p className="text-muted-foreground">Upload customer and order data to discover revenue opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">AI Revenue Opportunities</h2>
          <p className="text-muted-foreground mt-1 font-medium">
            {segments.length} actionable segments discovered from your data
            {totalRevenue ? ` · ${totalRevenue} total revenue` : ''}
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-black text-accent uppercase tracking-widest">
            {totalCustomers.toLocaleString()} in segments
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segments.map((segment) => {
          const Icon = SEGMENT_ICONS[segment.id] || Crown;
          const colors = SEGMENT_COLORS[segment.id] || SEGMENT_COLORS['high-value'];

          return (
            <div
              key={segment.id}
              className="relative rounded-3xl border border-border/40 bg-card/40 p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 hover:border-accent/30"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-30`}
              />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-background border border-border/40">
                    <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-background border border-border/40 text-accent">
                    {segment.revenuePercent.toFixed(1)}% of revenue
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight">{segment.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{segment.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-background/60 border border-border/40">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Customers</span>
                    </div>
                    <p className="text-2xl font-black text-foreground">{segment.customerCount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background/60 border border-border/40">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Revenue</span>
                    </div>
                    <p className="text-2xl font-black text-foreground">
                      ${segment.revenueContribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
