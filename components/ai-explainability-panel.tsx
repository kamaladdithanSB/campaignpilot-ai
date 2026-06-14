'use client'

import { Brain, Users, DollarSign, TrendingUp, Sparkles, ArrowRight, Target, Zap } from 'lucide-react'

export interface CampaignPreview {
  userPrompt: string
  analysis: {
    segmentId: string
    matchReason: string
    objective: string
  }
  segment: {
    id: string
    name: string
    description: string
    customerCount: number
    averageSpend: number
    revenueContribution: number
    revenuePercent: number
  }
  expectedRevenue: number
  reasoning: string
  goalReasoning: string
  businessImpact: string
}

interface AIExplainabilityPanelProps {
  preview: CampaignPreview
  onGenerate: () => void
  isGenerating?: boolean
}

export function AIExplainabilityPanel({ preview, onGenerate, isGenerating = false }: AIExplainabilityPanelProps) {
  const conversionLift = Math.round((preview.expectedRevenue / Math.max(preview.segment.revenueContribution, 1)) * 100 - 100)
  const averageSpend = preview.segment.averageSpend
  const projectedProfit = Math.max(preview.expectedRevenue - Math.round(preview.segment.customerCount * 0.09 * averageSpend), 0)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative overflow-hidden rounded-[32px] border border-accent/30 bg-gradient-to-br from-accent/10 via-primary/5 to-background p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid gap-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-accent">
                <Sparkles className="h-4 w-4" />
                AI Analysis Complete
              </div>
              <h3 className="text-4xl font-extrabold text-foreground tracking-tight">Why this campaign is the right move.</h3>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Your goal — <span className="font-semibold text-foreground">&ldquo;{preview.userPrompt}&rdquo;</span> — is matched to the best audience, projected revenue, and action plan below.
              </p>
            </div>

            <div className="rounded-[28px] border border-border/50 bg-background/80 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Selected audience</p>
              <p className="mt-4 text-3xl font-black text-foreground">{preview.segment.name}</p>
              <p className="mt-2 text-base text-muted-foreground">{preview.segment.customerCount.toLocaleString()} customers</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Customer count', value: preview.segment.customerCount.toLocaleString(), icon: Users },
              { label: 'Average spend', value: `$${preview.segment.averageSpend.toFixed(0)}`, icon: DollarSign },
              { label: 'Segment revenue', value: `$${preview.segment.revenueContribution.toLocaleString()}`, icon: TrendingUp },
              { label: 'Lift opportunity', value: `${conversionLift}%`, icon: Target },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="rounded-[28px] border border-border/40 bg-background/75 p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    {stat.label}
                  </div>
                  <p className="mt-4 text-3xl font-black text-foreground">{stat.value}</p>
                </div>
              )
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-border/40 bg-background/80 p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Campaign Goal</p>
              <h4 className="mt-4 text-2xl font-black text-foreground">Convert the selected segment with high-value, targeted messaging.</h4>
              <p className="mt-4 text-base leading-7 text-muted-foreground">The campaign is designed to shift customer behavior from awareness to purchase while preserving a premium, trusted brand experience.</p>
            </div>

            <div className="rounded-[32px] border border-border/40 bg-background/80 p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Recommended audience</p>
              <h4 className="mt-4 text-2xl font-black text-foreground">{preview.segment.name}</h4>
              <p className="mt-4 text-base leading-7 text-muted-foreground">A high-value group with proven purchase history and strong potential for incremental revenue growth.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[32px] border border-border/40 bg-emerald-500/10 p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-400">Why this works</p>
              <ul className="mt-4 space-y-3 text-base leading-7 text-foreground">
                <li>• The audience is high-value and aligned with your campaign objective.</li>
                <li>• Messaging will leverage repeat purchase behavior and segmentation signals.</li>
                <li>• The projected revenue lift is backed by historical spend and customer count.</li>
              </ul>
            </div>
            <div className="rounded-[32px] border border-border/40 bg-background/80 p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Business impact</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl bg-secondary/10 p-4">
                  <p className="text-sm text-muted-foreground">Revenue opportunity</p>
                  <p className="mt-2 text-2xl font-black text-foreground">${preview.expectedRevenue.toLocaleString()}</p>
                </div>
                <div className="rounded-3xl bg-secondary/10 p-4">
                  <p className="text-sm text-muted-foreground">Profit potential</p>
                  <p className="mt-2 text-2xl font-black text-foreground">${projectedProfit.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-border/40 bg-background/80 p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Recommended action</p>
                <h4 className="mt-3 text-2xl font-black text-foreground">Launch an audience-first email + SMS campaign.</h4>
              </div>
              <div className="rounded-3xl bg-accent/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-accent">Ready to run</div>
            </div>
            <p className="mt-4 text-base leading-7 text-muted-foreground">Use personalized messaging, strong incentive triggers, and the selected segment to maximize conversion and revenue with a premium feel.</p>
          </div>

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full rounded-[32px] bg-foreground px-8 py-5 text-lg font-black text-background transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isGenerating ? 'Generating campaign strategy...' : 'Generate Full Campaign'}
          </button>
        </div>
      </div>
    </div>
  )
}
