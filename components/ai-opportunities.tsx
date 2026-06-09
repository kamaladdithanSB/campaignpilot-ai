'use client'

import { Zap, TrendingUp, Shield, Target, ArrowRight } from 'lucide-react'

export function AIOpportunities() {
  const opportunities = [
    {
      title: 'Revenue Recovery',
      subtitle: 'At-Risk Customers',
      count: '$89,450',
      description: 'Recover $89K in at-risk revenue by re-engaging lapsed VIP customers with personalized win-back offers.',
      icon: TrendingUp,
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      action: 'Launch Win-Back',
      actionColor: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Churn Prevention',
      subtitle: 'High-Value Retention',
      count: '2,841',
      description: 'Prevent churn of 2,841 high-value customers with proactive engagement before they become inactive.',
      icon: Shield,
      gradient: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      action: 'Activate Retention',
      actionColor: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Upsell Potential',
      subtitle: 'High-Conversion Segment',
      count: '$156,230',
      description: 'Unlock $156K in upsell revenue from customers ready for premium product promotion campaigns.',
      icon: Zap,
      gradient: 'from-violet-500/20 to-violet-600/10',
      iconColor: 'text-violet-400',
      borderColor: 'border-violet-500/20',
      action: 'Start Upsell',
      actionColor: 'from-violet-500 to-violet-600',
    },
    {
      title: 'Frequency Boost',
      subtitle: 'Purchase Acceleration',
      count: '3,562',
      description: 'Increase purchase frequency by 40% for engaged customers using strategic timing and personalization.',
      icon: Target,
      gradient: 'from-orange-500/20 to-orange-600/10',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/20',
      action: 'Enable Frequency',
      actionColor: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI-Identified Opportunities</h2>
        <p className="text-muted-foreground mt-1.5 text-sm">Business outcomes the AI recommends you pursue next</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opportunity) => {
          const Icon = opportunity.icon
          return (
            <div
              key={opportunity.title}
              className={`relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden transition-all duration-300 group hover:border-border hover:shadow-lg hover:shadow-accent/5`}
            >
              {/* Gradient background effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${opportunity.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-all duration-300" />

              <div className="relative z-10 space-y-4">
                {/* Header with icon */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${opportunity.gradient} border ${opportunity.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${opportunity.iconColor}`} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
                    AI Insight
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{opportunity.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{opportunity.subtitle}</p>
                  </div>

                  {/* Revenue/impact number */}
                  <div className="py-3 border-y border-border/40">
                    <p className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                      {opportunity.count}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Potential impact</p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground/80 leading-relaxed">{opportunity.description}</p>

                  {/* Action button */}
                  <button className={`w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r ${opportunity.actionColor} text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 group-hover:gap-3`}>
                    {opportunity.action}
                    <ArrowRight className="w-4 h-4 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommendation summary */}
      <div className="relative rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 to-primary/5 p-6 overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-bold">AI Recommendation:</span> Execute all four opportunities in parallel. The AI models predict a combined impact of <span className="font-bold text-accent">$532,920</span> in incremental revenue over the next 90 days. Start with Revenue Recovery (highest confidence: 94%) and Churn Prevention (highest urgency) this week.
          </p>
        </div>
      </div>
    </div>
  )
}
