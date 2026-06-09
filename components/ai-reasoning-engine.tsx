'use client'

import { Brain, Zap, Users, Target, MessageSquare, TrendingUp } from 'lucide-react'

interface AIReasoningEngineProps {
  onLaunch?: () => void
}

export function AIReasoningEngine({ onLaunch }: AIReasoningEngineProps = {}) {
  const reasoningSteps = [
    {
      icon: Brain,
      label: 'Goal Interpretation',
      description: 'Analyzing your business objective to identify the core outcome drivers and key success metrics.',
      insights: 'Detected: Revenue growth through customer frequency increase',
      color: 'from-violet-500/20 to-violet-600/10',
      iconColor: 'text-violet-400',
    },
    {
      icon: Users,
      label: 'Audience Analysis',
      description: 'Evaluating your customer base to find the highest-potential segments with behavioral patterns.',
      insights: '12,450 VIP customers identified • 89% historical response rate',
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      icon: MessageSquare,
      label: 'Message Optimization',
      description: 'Crafting personalized messaging that resonates with segment psychology and purchase triggers.',
      insights: 'Personalization detected: +34% CTR improvement vs. standard messaging',
      color: 'from-cyan-500/20 to-cyan-600/10',
      iconColor: 'text-cyan-400',
    },
    {
      icon: Target,
      label: 'Channel Selection',
      description: 'Determining optimal channels based on engagement patterns and segment preferences.',
      insights: 'Email (92% engagement) + SMS (78% open rate) recommended',
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Zap,
      label: 'Conversion Prediction',
      description: 'AI model predicting campaign performance based on historical data and market conditions.',
      insights: 'Projected conversion rate: 8.2% (290% lift vs. baseline)',
      color: 'from-orange-500/20 to-orange-600/10',
      iconColor: 'text-orange-400',
    },
    {
      icon: TrendingUp,
      label: 'Revenue Impact',
      description: 'Estimating financial impact and ROI based on predicted conversions and average order value.',
      insights: 'Estimated revenue: $287,450 • Confidence: 94%',
      color: 'from-pink-500/20 to-pink-600/10',
      iconColor: 'text-pink-400',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Reasoning Engine</h2>
        <p className="text-muted-foreground mt-1.5 text-sm">See how CampaignPilot&apos;s neural network analyzes your goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reasoningSteps.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.label}
              className={`relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 overflow-hidden transition-all duration-300 group hover:border-border hover:shadow-lg hover:shadow-accent/5`}
            >
              {/* Gradient background effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-all duration-300" />

              <div className="relative z-10 space-y-4">
                {/* Header with icon and step number */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} border border-border/40 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${step.iconColor}`} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
                    Neural Step
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{step.label}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{step.description}</p>
                  </div>

                  {/* Insights box */}
                  <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <p className="text-xs font-semibold text-accent">{step.insights}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary insight */}
      <div className="relative rounded-xl border border-border/60 bg-gradient-to-r from-accent/5 via-primary/3 to-background p-6 overflow-hidden">
        <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-40" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            <p className="font-bold text-foreground text-sm uppercase tracking-wider">AI Conclusion</p>
          </div>
          <p className="text-foreground leading-relaxed">
            The AI engine recommends launching this campaign immediately. With 94% confidence, this strategy will outperform your baseline by 290%. The combination of precise audience targeting, personalized messaging, and optimal channel mix creates a powerful conversion vector.
          </p>
          <button
            onClick={onLaunch}
            className="mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-accent to-primary text-accent-foreground font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
          >
            Launch Strategy
          </button>
        </div>
      </div>
    </div>
  )
}
