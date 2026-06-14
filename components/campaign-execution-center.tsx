'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Send,
  CheckCircle,
  Eye,
  MousePointerClick,
  TrendingUp,
  Activity,
  Users,
  Radio,
  Clock,
} from 'lucide-react'

const SIMULATION_DURATION_MS = 10000

interface CampaignExecutionCenterProps {
  metrics?: {
    sent?: number
    delivered?: number
    opened?: number
    clicked?: number
    revenue?: number
    conversions?: number
  }
  audienceSize?: number
  expectedRevenue?: number
  avgOrderValue?: number
  onSimulationComplete?: () => void
}

export function CampaignExecutionCenter({
  metrics,
  audienceSize = 0,
  expectedRevenue = 0,
  avgOrderValue = 45,
  onSimulationComplete,
}: CampaignExecutionCenterProps) {
  const [elapsed, setElapsed] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Analyzing customer behavior...')
  const completedRef = useRef(false)

  const audienceCount = audienceSize || metrics?.sent || 0
  const revenueProjection = Math.max(expectedRevenue, Math.round(audienceCount * avgOrderValue * 0.18))
  const campaignCost = Math.max(Math.round(audienceCount * 0.08), 250)
  const roiPercent = Math.max(Math.round(((revenueProjection - campaignCost) / campaignCost) * 100), 0)
  const conversionRateFinal = Math.min(14, 4 + Math.round((revenueProjection / Math.max(audienceCount, 1)) * 0.04))
  const conversionsProjection = Math.max(Math.round((audienceCount * conversionRateFinal) / 100), 1)

  const openRate = 32 + Math.min(16, Math.max(0, (elapsed / SIMULATION_DURATION_MS) * 18))
  const clickRate = 10 + Math.min(12, Math.max(0, (elapsed / SIMULATION_DURATION_MS) * 10))
  const conversionRate = 4 + Math.min(10, Math.max(0, (elapsed / SIMULATION_DURATION_MS) * 8))

  const progress = Math.min(elapsed / SIMULATION_DURATION_MS, 1)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - start
      setElapsed(elapsedMs)

      if (elapsedMs < 2500) {
        setStatusMessage('Analyzing audience and customer behavior...')
      } else if (elapsedMs < 5500) {
        setStatusMessage('Predicting campaign performance and engagement...')
      } else if (elapsedMs < 8500) {
        setStatusMessage('Estimating revenue impact and optimization...')
      } else if (elapsedMs < SIMULATION_DURATION_MS) {
        setStatusMessage('Finalizing the campaign summary...')
      } else {
        setStatusMessage('Simulation complete — review the recommendation below.')
        if (!completedRef.current) {
          completedRef.current = true
          onSimulationComplete?.()
        }
      }
    }, 50)

    return () => clearInterval(interval)
  }, [audienceCount, onSimulationComplete])

  const stageSets = [
    {
      title: 'Analyzing Audience',
      active: progress < 0.25,
      details: [
        { label: 'Segment', value: 'High-value shoppers' },
        { label: 'Customer count', value: audienceCount.toLocaleString() },
        { label: 'Revenue contribution', value: `$${Math.round(revenueProjection * 0.22).toLocaleString()}` },
      ],
    },
    {
      title: 'Predicting Campaign Performance',
      active: progress >= 0.25 && progress < 0.55,
      details: [
        { label: 'Expected open rate', value: `${openRate.toFixed(1)}%` },
        { label: 'Expected click rate', value: `${clickRate.toFixed(1)}%` },
        { label: 'Expected conversion rate', value: `${conversionRate.toFixed(1)}%` },
      ],
    },
    {
      title: 'Estimating Revenue Impact',
      active: progress >= 0.55 && progress < 0.85,
      details: [
        { label: 'Estimated revenue', value: `$${revenueProjection.toLocaleString()}` },
        { label: 'Campaign cost', value: `$${campaignCost.toLocaleString()}` },
        { label: 'Expected ROI', value: `${roiPercent}%` },
      ],
    },
    {
      title: 'Final Simulation Summary',
      active: progress >= 0.85,
      details: [
        { label: 'Selected audience', value: `${audienceCount.toLocaleString()} customers` },
        { label: 'Expected reach', value: `${Math.max(Math.round(audienceCount * 0.95), 0).toLocaleString()}` },
        { label: 'Revenue projection', value: `$${revenueProjection.toLocaleString()}` },
        { label: 'Risk level', value: roiPercent >= 80 ? 'Low' : roiPercent >= 50 ? 'Moderate' : 'Managed' },
      ],
    },
  ]

  const funnelCards = [
    { label: 'Audience', value: audienceCount, pct: 100, icon: Users, color: 'text-accent', bg: 'bg-accent/10', bar: 'bg-accent' },
    { label: 'Sent', value: Math.max(Math.round(audienceCount * Math.min(progress, 1)), 0), pct: audienceCount > 0 ? Math.round(Math.min(progress, 1) * 100) : 0, icon: Send, color: 'text-cyan-400', bg: 'bg-cyan-500/10', bar: 'bg-cyan-500' },
    { label: 'Opened', value: Math.max(Math.round(audienceCount * (openRate / 100) * Math.min(progress, 1)), 0), pct: audienceCount > 0 ? Math.round(openRate) : 0, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10', bar: 'bg-blue-500' },
    { label: 'Clicked', value: Math.max(Math.round(audienceCount * (clickRate / 100) * Math.min(progress, 1)), 0), pct: audienceCount > 0 ? Math.round(clickRate) : 0, icon: MousePointerClick, color: 'text-violet-400', bg: 'bg-violet-500/10', bar: 'bg-violet-500' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Live simulation
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tighter">Campaign Simulation</h2>
          </div>
          <p className="text-muted-foreground text-lg font-medium flex items-center gap-2">
            <Radio className="w-4 h-4 text-accent animate-pulse" />
            {statusMessage}
          </p>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Elapsed</p>
            <p className="text-sm font-bold text-foreground">{(elapsed / 1000).toFixed(1)}s / 10s</p>
          </div>
          <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-100" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/40 bg-card/40 p-6">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Simulation progress</p>
        <div className="grid gap-4 md:grid-cols-4">
          {stageSets.map((stage, index) => {
            const stageProgress = progress >= (index + 1) * 0.25
            return (
              <div key={stage.title} className={`rounded-3xl p-4 border ${stage.active ? 'border-accent/30 bg-accent/10 shadow-accent/10' : stageProgress ? 'border-success/30 bg-success/10' : 'border-border/30 bg-background/80'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Step {index + 1}</p>
                <p className={`mt-3 text-sm font-bold ${stage.active ? 'text-accent' : stageProgress ? 'text-success' : 'text-muted-foreground'}`}>{stage.title}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          {stageSets.map((stage) => (
            <div key={stage.title} className={`rounded-3xl border p-6 transition-all ${stage.active ? 'border-accent/30 bg-accent/10 shadow-xl shadow-accent/10' : 'border-border/40 bg-card/40'}`}>
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stage</p>
                  <h3 className="text-2xl font-black text-foreground mt-2">{stage.title}</h3>
                </div>
                {stage.active && <span className="text-[10px] font-black uppercase tracking-widest text-accent">In progress</span>}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {stage.details.map((detail) => (
                  <div key={detail.label} className="rounded-3xl bg-background/90 border border-border/40 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{detail.label}</p>
                    <p className="text-lg font-black text-foreground mt-2">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-border/40 bg-gradient-to-br from-background to-card/90 p-6 shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Simulation summary</p>
            <div className="space-y-4">
              <div className="rounded-3xl bg-card/40 border border-border/40 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revenue projection</p>
                <p className="text-4xl font-black text-foreground mt-3">${revenueProjection.toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-card/40 border border-border/40 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Projected conversions</p>
                <p className="text-4xl font-black text-foreground mt-3">{conversionsProjection.toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-accent/10 border border-accent/20 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent">Predicted ROI</p>
                <p className="text-5xl font-black text-foreground mt-3">{roiPercent}%</p>
                <p className="text-sm text-muted-foreground mt-2">Calculated from campaign cost and projected revenue.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border/40 bg-card/40 p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Risk profile</p>
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-emerald-500/10 p-3 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-foreground">{roiPercent >= 80 ? 'Low risk' : roiPercent >= 50 ? 'Moderate risk' : 'Managed risk'}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  The model is using segment behavior and campaign reach to make a recommendation that is tuned for your current objective.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {funnelCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="p-6 rounded-3xl bg-card/40 border border-border/40">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-black text-foreground/20">{card.pct}%</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{card.label}</p>
                  <p className="text-3xl font-black text-foreground tracking-tighter tabular-nums">{card.value.toLocaleString()}</p>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${card.bar} transition-all duration-150`} style={{ width: `${Math.min(card.pct, 100)}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {progress < 1 && (
        <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-3">
          <Activity className="w-5 h-5 text-accent animate-pulse" />
          <p className="text-sm text-muted-foreground font-medium">
            Campaign running — {Math.max(Math.round(audienceCount * Math.min(progress, 1)), 0).toLocaleString()} of {audienceCount.toLocaleString()} messages simulated...
          </p>
        </div>
      )}
    </div>
  )
}

function easeOut(t: number, start: number, end: number): number {
  if (t <= start) return 0
  if (t >= end) return 1
  const local = (t - start) / (end - start)
  return 1 - Math.pow(1 - local, 3)
}
