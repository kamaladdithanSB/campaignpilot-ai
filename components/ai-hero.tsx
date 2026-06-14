'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, Brain, Loader2, Database, Search, AlertCircle } from 'lucide-react'

interface AIHeroProps {
  onAnalyze?: (prompt: string) => void
  hasData?: boolean
  isAnalyzing?: boolean
  isGenerating?: boolean
  loadingStage?: 'goal' | 'audience' | 'content' | null
  initialPrompt?: string
  error?: string | null
}

export function AIHero({
  onAnalyze,
  hasData = false,
  isAnalyzing = false,
  isGenerating = false,
  loadingStage = null,
  initialPrompt = '',
  error = null,
}: AIHeroProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const busy = isAnalyzing || isGenerating

  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt)
  }, [initialPrompt])

  const quickSuggestions = [
    { icon: '📅', label: 'Boost weekend sales', segment: 'Weekend Shoppers' },
    { icon: '🔄', label: 'Win back inactive customers', segment: 'At-Risk Customers' },
    { icon: '📈', label: 'Increase average order value', segment: 'High Value Customers' },
    { icon: '✨', label: 'Promote new products', segment: 'Recent Buyers' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("DEBUG: AIHero - handleSubmit called", { prompt, hasData, busy });
    if (prompt.trim() && hasData && !busy) {
      console.log("DEBUG: AIHero - calling onAnalyze...");
      onAnalyze?.(prompt)
    } else {
      console.log("DEBUG: AIHero - handleSubmit validation failed", { promptTrim: prompt.trim(), hasData, busy });
    }
  }

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-accent/10 via-primary/5 to-background p-8 md:p-14 backdrop-blur-2xl shadow-2xl shadow-accent/5">
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse opacity-40" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-30" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 backdrop-blur-md">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-accent uppercase tracking-widest">AI Revenue Copilot</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-balance leading-[1.1] text-foreground tracking-tighter">
              Tell us your goal. We&apos;ll show you why before we build.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-medium">
              The AI analyzes your data, explains which segment it chose and why, then generates a tailored campaign.
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="relative group">
              <div
                className={`flex gap-3 p-2 rounded-2xl bg-card/60 border-2 transition-all duration-500 backdrop-blur-xl ${
                  !hasData
                    ? 'border-dashed border-muted-foreground/30'
                    : 'border-border/40 group-focus-within:border-accent/50 group-focus-within:shadow-2xl group-focus-within:shadow-accent/10'
                }`}
              >
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={!hasData || busy}
                  placeholder={hasData ? "E.g., 'Boost weekend sales' or 'Win back inactive customers'" : 'Upload data first...'}
                  className="flex-1 px-4 py-3 rounded-xl bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed font-medium"
                />
                <button
                  type="submit"
                  disabled={!prompt.trim() || !hasData || busy}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-accent-foreground font-bold flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all duration-300 shadow-xl shadow-accent/20"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="hidden sm:inline">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">Analyze Opportunity</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4" />
                  AI analysis failed: {error}
                </div>
              )}

              {!hasData && (
                <div className="absolute -bottom-10 left-4 flex items-center gap-2 text-warning">
                  <Database className="w-4 h-4" />
                  <p className="text-xs font-bold uppercase tracking-wider">Connect customer data to enable analysis</p>
                </div>
              )}
            </form>

            {isGenerating && (
              <div className="p-8 rounded-2xl bg-background/90 backdrop-blur-xl border border-accent/20 text-center space-y-6 animate-in fade-in">
                <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto" />
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-foreground">
                    {loadingStage === 'goal' && 'Interpreting your business goal...'}
                    {loadingStage === 'audience' && 'Building audience strategy...'}
                    {loadingStage === 'content' && 'Writing email & SMS copy...'}
                  </h3>
                  <div className="h-1.5 w-full max-w-xs mx-auto bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-1000"
                      style={{ width: loadingStage === 'goal' ? '33%' : loadingStage === 'audience' ? '66%' : '100%' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!busy && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border/40" />
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border/40 bg-card/40">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Try these goals</p>
            </div>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => setPrompt(suggestion.label)}
                disabled={!hasData || busy}
                className="text-left p-4 rounded-xl bg-card/30 border border-border/40 hover:border-accent/40 hover:bg-card/60 transition-all duration-300 group disabled:opacity-50"
              >
                <div className="text-xl mb-2">{suggestion.icon}</div>
                <h3 className="text-xs font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                  {suggestion.label}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1">→ {suggestion.segment}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
