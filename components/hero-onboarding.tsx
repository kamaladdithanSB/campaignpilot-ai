'use client'

import { Database, ArrowRight, Sparkles } from 'lucide-react'

interface HeroOnboardingProps {
  onConnect: () => void
}

export function HeroOnboarding({ onConnect }: HeroOnboardingProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-[3rem] border border-border/40 bg-card/30 p-6 shadow-[0_40px_120px_-50px_rgba(15,23,42,0.65)]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-0 top-12 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-float-slow" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl animate-float-reverse" />
        <div className="absolute left-1/2 top-1/4 h-56 w-56 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl animate-float-slow" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 lg:px-12 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          <div className="space-y-8 lg:max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent shadow-sm shadow-accent/10">
              <Sparkles className="h-4 w-4" />
              AI Revenue Copilot
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
                AI-powered campaign intelligence for modern retailers.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                Upload customer data, unlock audience insights, and launch revenue-driving campaigns in minutes with precision forecasting and business-first automation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onConnect}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-primary px-8 py-4 text-base font-black text-accent-foreground shadow-2xl shadow-accent/30 transition duration-300 hover:-translate-y-0.5"
              >
                <Database className="mr-3 h-5 w-5" />
                Upload customer data
              </button>
              <button
                onClick={onConnect}
                className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background/90 px-8 py-4 text-base font-semibold text-foreground transition hover:border-accent"
              >
                Connect Shopify
                <ArrowRight className="ml-3 h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              { label: 'Customers', value: '18.2K', accent: 'bg-indigo-500/10 text-indigo-400' },
              { label: 'Revenue', value: '$1.4M', accent: 'bg-emerald-500/10 text-emerald-400' },
              { label: 'ROI', value: '4.6x', accent: 'bg-fuchsia-500/10 text-fuchsia-400' },
            ].map((card) => (
              <div
                key={card.label}
                className={`group relative overflow-hidden rounded-[32px] border border-border/40 bg-background/90 p-6 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${card.accent}`}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">{card.label}</p>
                <p className="mt-4 text-3xl font-black tracking-tight text-foreground">{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] bg-secondary/10 border border-border/30 p-5 text-base font-semibold text-muted-foreground">
            Designed for premium investor demos and fast decision making.
          </div>
          <div className="rounded-[28px] bg-secondary/10 border border-border/30 p-5 text-base font-semibold text-muted-foreground">
            Built to tell a clean business story in minutes.
          </div>
        </div>
      </div>
    </section>
  )
}
