'use client'

import { CheckCircle, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react'

export function CampaignSummaryCard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Campaign Results</h2>
        <p className="text-muted-foreground text-sm mt-1">Summary of completed campaign performance</p>
      </div>

      {/* Main Result Card */}
      <div className="relative rounded-xl border border-accent/30 bg-gradient-to-br from-accent/15 via-primary/5 to-background p-8 overflow-hidden">
        <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl opacity-30" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 space-y-6">
          {/* Success Metric */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <p className="text-lg font-semibold text-emerald-400">Campaign Complete</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Revenue Generated</p>
              <p className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">$287,450</p>
              <p className="text-sm text-muted-foreground mt-2">In influenced revenue from campaign</p>
            </div>
          </div>

          {/* Performance vs Prediction */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Open Rate Performance</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">67%</p>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs 55% predicted</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Conversion Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-foreground">8.2%</p>
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  +15%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">vs 7.1% predicted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="space-y-3">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          AI Insights & Recommendations
        </h3>

        <div className="space-y-3">
          {/* Insight 1 */}
          <div className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-5 overflow-hidden group hover:border-border transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <p className="font-semibold text-foreground">Why Performance Exceeded Predictions</p>
              <p className="text-sm text-muted-foreground mt-2">The VIP customer segment responded 23% better than baseline. Your personalized messaging resonated with high-intent buyers, and email timing on Tuesday mornings drove optimal engagement.</p>
              <p className="text-xs text-emerald-400 font-semibold mt-3">✓ Confidence: 94%</p>
            </div>
          </div>

          {/* Insight 2 */}
          <div className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-5 overflow-hidden group hover:border-border transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <p className="font-semibold text-foreground">Next Recommended Action</p>
              <p className="text-sm text-muted-foreground mt-2">Launch a retention campaign for the 2,841 churn-risk customers identified in your data. AI predicts a 40% improvement in retention with personalized win-back offers and strategic timing.</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/60 text-accent font-semibold text-sm flex items-center gap-2 transition-all">
                Launch Retention Campaign
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
        <p className="font-semibold text-foreground">Ready for your next campaign?</p>
        <p className="text-sm text-muted-foreground">Scroll up and tell CampaignPilot your next business goal. The AI is ready with recommendations.</p>
      </div>
    </div>
  )
}
