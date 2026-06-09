'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, Zap, Brain } from 'lucide-react'

interface AIHeroProps {
  onLaunchStrategy?: () => void
}

export function AIHero({ onLaunchStrategy }: AIHeroProps = {}) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const quickSuggestions = [
    { icon: '📈', label: 'Increase repeat purchases', desc: 'AI-optimized loyalty strategies' },
    { icon: '🔄', label: 'Win back inactive customers', desc: 'Predictive re-engagement' },
    { icon: '📅', label: 'Boost weekend sales', desc: 'Temporal optimization' },
    { icon: '✨', label: 'Promote premium products', desc: 'Smart upsell pathways' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setPrompt('')
        onLaunchStrategy?.()
      }, 1200)
    }
  }

  return (
    <div className="space-y-10">
      {/* Premium AI Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-accent/5 via-primary/3 to-background p-8 md:p-12 backdrop-blur-xl">
        {/* Animated gradient orbs */}
        <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse opacity-40" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse opacity-30" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 space-y-6">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-sm">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">AI-Powered Intelligence</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight text-foreground">
              Tell me the outcome you want.
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                CampaignPilot handles the strategy.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Describe what customer behavior you&apos;d like to change, and let AI build a hyper-personalized campaign strategy in seconds.
            </p>
          </div>

          {/* Input Section */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="flex gap-2 max-w-4xl">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., 'Increase purchase frequency for VIP customers in the last 30 days'"
                className="flex-1 px-5 py-3.5 rounded-xl bg-card/50 border border-border/60 hover:border-border text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 transition-all duration-300 backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-accent to-primary text-accent-foreground font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Generate</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Popular starting points
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickSuggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => setPrompt(suggestion.label)}
              className="text-left p-4 rounded-xl bg-card/40 border border-border/60 hover:border-accent/40 hover:bg-card/80 backdrop-blur-sm transition-all duration-300 cursor-pointer group relative overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-2xl mb-2">{suggestion.icon}</div>
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                    {suggestion.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5">{suggestion.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 opacity-50 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
