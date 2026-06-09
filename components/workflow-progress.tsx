'use client'

import { CheckCircle2, Circle, ArrowRight } from 'lucide-react'

export function WorkflowProgress() {
  const stages = [
    { name: 'Goal', status: 'completed', description: 'Define outcome' },
    { name: 'Audience', status: 'completed', description: 'Target segment' },
    { name: 'Message', status: 'completed', description: 'Craft copy' },
    { name: 'Channel', status: 'active', description: 'Select medium' },
    { name: 'Launch', status: 'pending', description: 'Go live' },
    { name: 'Insights', status: 'pending', description: 'Analyze results' },
  ]

  return (
    <div className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-6 md:p-8 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent opacity-50" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-foreground">Campaign Workflow</h2>
          <p className="text-muted-foreground text-sm mt-1.5">Step 4 of 6 · Channel Selection in Progress</p>
        </div>

        {/* Progress steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            {stages.map((stage, index) => (
              <div key={stage.name} className="flex items-center gap-0">
                {/* Stage indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      stage.status === 'completed'
                        ? 'border-accent bg-accent text-accent-foreground'
                        : stage.status === 'active'
                          ? 'border-accent bg-accent/20 text-accent'
                          : 'border-border/40 bg-card text-muted-foreground'
                    }`}
                  >
                    {stage.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : stage.status === 'active' ? (
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-foreground mt-2 whitespace-nowrap">{stage.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
                </div>

                {/* Connector line */}
                {index < stages.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1 md:mx-2 rounded-full transition-all duration-300 ${
                      stage.status === 'completed'
                        ? 'bg-gradient-to-r from-accent to-accent'
                        : 'bg-gradient-to-r from-border/40 to-border/20'
                    }`}
                    style={{ minWidth: '20px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current step details */}
        <div className="mt-8 pt-6 border-t border-border/40 space-y-4">
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold">
                4
              </span>
              Channel Selection
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              The AI has identified the most effective channels for reaching your audience. Email dominates with 92% engagement, while SMS provides rapid re-engagement for time-sensitive offers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-card/40 border border-border/40 hover:border-accent/40 transition-all">
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Primary Channel</p>
              <p className="text-sm font-semibold text-foreground">Email</p>
              <p className="text-xs text-muted-foreground mt-1">92% engagement rate</p>
            </div>
            <div className="p-3 rounded-lg bg-card/40 border border-border/40 hover:border-accent/40 transition-all">
              <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Secondary Channel</p>
              <p className="text-sm font-semibold text-foreground">SMS</p>
              <p className="text-xs text-muted-foreground mt-1">78% open rate</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-2.5 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60 text-accent font-semibold text-sm transition-all duration-300">
              Review Channels
            </button>
            <button className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-accent to-primary text-accent-foreground font-semibold text-sm hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 flex items-center justify-center gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
