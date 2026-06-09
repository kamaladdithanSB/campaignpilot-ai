'use client'

import { Zap, Users, Send, MessageSquare, TrendingUp, Sparkles } from 'lucide-react'

export function CampaignPlan() {
  return (
    <div className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-7 space-y-6 md:col-span-2 overflow-hidden hover:border-border transition-all duration-300 group">
      {/* Background accent effects */}
      <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-1/2 h-1 w-1/4 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/30">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Campaign Plan</h2>
              <p className="text-xs text-muted-foreground mt-1">Neural-optimized strategy</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Ready to Launch
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recommended Audience */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recommended Audience</label>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60 hover:border-border/80 transition-all duration-300 group/inner">
              <p className="font-semibold text-foreground">VIP Customers + High Frequency Buyers</p>
              <p className="text-sm text-muted-foreground mt-2">12,450 contacts · High-intent segment</p>
            </div>
          </div>

          {/* Recommended Channel */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-accent" />
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recommended Channel</label>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60 hover:border-border/80 transition-all duration-300 group/inner">
              <p className="font-semibold text-foreground">Email + SMS</p>
              <p className="text-sm text-muted-foreground mt-2">Highest engagement for segment</p>
            </div>
          </div>

          {/* Suggested Message */}
          <div className="space-y-2.5 md:col-span-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Suggested Message</label>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60 hover:border-border/80 transition-all duration-300">
              <p className="text-foreground leading-relaxed">
                "Welcome to your exclusive weekend event—premium items curated just for you. Enjoy 24-hour early access and free shipping."
              </p>
              <p className="text-xs text-emerald-400 mt-3 font-semibold">✓ AI-optimized for 34% higher CTR</p>
            </div>
          </div>

          {/* Predicted Conversion */}
          <div className="space-y-2.5 md:col-span-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Predicted Conversion Rate</label>
            </div>
            <div className="flex items-end gap-6 p-4 rounded-xl bg-gradient-to-br from-accent/10 to-primary/5 border border-border/60">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">8.2%</div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">vs 2.1% baseline (+290%)</p>
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-2 rounded-full bg-card/60 border border-border/40 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent via-primary to-accent w-[82%] rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground text-right">82% confidence score</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-primary text-accent-foreground font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 active:scale-98">
          Launch Campaign
        </button>
      </div>
    </div>
  )
}
