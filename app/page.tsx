'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AIHero } from '@/components/ai-hero'
import { AIReasoningEngine } from '@/components/ai-reasoning-engine'
import { AIExplainabilityPanel, type CampaignPreview } from '@/components/ai-explainability-panel'
import { WorkflowProgress } from '@/components/workflow-progress'
import { AIOpportunities } from '@/components/ai-opportunities'
import { DataSourcesModal } from '@/components/data-sources-modal'
import { DataAnalysisSummary } from '@/components/data-analysis-summary'
import { CampaignExecutionCenter } from '@/components/campaign-execution-center'
import { HeroOnboarding } from '@/components/hero-onboarding'
import { ExecutiveDashboard } from '@/components/executive-dashboard'
import { Zap, Database, Users, Mail, Activity, DollarSign, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import type { CustomerSegment } from '@/lib/types'

export default function Dashboard() {
  const [showDataModal, setShowDataModal] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [dataAnalysis, setDataAnalysis] = useState<{
    customersImported: number
    ordersImported: number
    totalRevenue: string
    averageOrderValue?: string
    averageOrderValueRaw?: number
    segments?: CustomerSegment[]
  } | null>(null)
  const [campaignStatus, setCampaignStatus] = useState<'draft' | 'queued' | 'executing' | 'completed'>('draft')
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [currentStrategy, setCurrentStrategy] = useState<Record<string, unknown> | null>(null)
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null)
  const [audienceSize, setAudienceSize] = useState(0)
  const [campaignPreview, setCampaignPreview] = useState<CampaignPreview | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'goal' | 'audience' | 'content' | null>(null)
  const [savedPrompt, setSavedPrompt] = useState('')
  const [simulationComplete, setSimulationComplete] = useState(false)
  const [backendComplete, setBackendComplete] = useState(false)
  const [shopifyConnection, setShopifyConnection] = useState<{
    storeName: string
    customers: number
    orders: number
    revenue: number
    lastSync: string
  } | null>(null)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || ''

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const strategyRef = useRef<HTMLDivElement>(null)
  const executionRef = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleDataLoaded = (data: typeof dataAnalysis & { shopify?: { storeName: string; customers: number; orders: number; revenue: number; lastSync: string } }) => {
    const sortedSegments = [...(data?.segments || [])].sort(
      (a, b) => b.revenueContribution - a.revenueContribution
    )
    setDataAnalysis({ ...data!, segments: sortedSegments })
    if (data.shopify) {
      setShopifyConnection(data.shopify)
    }
    setHasData(true)
    setCurrentStep(2)
    setTimeout(() => {
      promptRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 500)
  }

  const pollStatus = useCallback(async () => {
    if (!campaignId) return
    console.log('DEBUG: pollStatus - polling status for campaign', { campaignId, campaignStatus, currentStep })
    try {
      const res = await fetch(`${apiBaseUrl}/api/campaigns/status?id=${campaignId}`)
      const data = await res.json()
      console.log('DEBUG: pollStatus - response', data)

      if (data.status) {
        const status = data.status.toLowerCase()
        console.log('DEBUG: pollStatus - status parsed', status)
        setCampaignStatus(status)
        if (data.metrics) {
          setMetrics(data.metrics)
          console.log('DEBUG: pollStatus - metrics updated', data.metrics)
        }

        if (data.strategy && typeof data.strategy === 'string') {
          try {
            setCurrentStrategy(JSON.parse(data.strategy))
          } catch (e) {
            console.error('Failed to parse strategy', e)
          }
        } else if (data.strategy) {
          setCurrentStrategy(data.strategy)
        }

        if (status === 'executing' || status === 'queued') {
          setCurrentStep((prevStep) => Math.max(prevStep, 4))
        }

        if (status === 'completed') {
          console.log('DEBUG: pollStatus - backend reports completed')
          setBackendComplete(true)
          setCurrentStep(5)
        }
      }
    } catch (e) {
      console.error('Polling error', e)
    }
  }, [apiBaseUrl, campaignId, campaignStatus, currentStep])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (campaignId && campaignStatus !== 'completed') {
      console.log('DEBUG: polling effect - starting poll interval', { campaignId, campaignStatus })
      interval = setInterval(pollStatus, 1500)
      pollStatus().catch((e) => console.error('DEBUG: initial poll failed', e))
    }
    return () => {
      console.log('DEBUG: polling effect - clearing poll interval', { campaignId, campaignStatus })
      clearInterval(interval)
    }
  }, [campaignId, campaignStatus, pollStatus])

  useEffect(() => {
    if (backendComplete && currentStep === 4) {
      console.log('DEBUG: completion effect - switching to ROI because backendComplete is true')
      setCurrentStep(5)
    }
  }, [backendComplete, currentStep])

  const handleAnalyze = async (prompt: string) => {
    console.log("DEBUG: handleAnalyze - Starting analysis for:", prompt);
    setSavedPrompt(prompt)
    setIsAnalyzing(true)
    setCampaignPreview(null)
    setAnalysisError(null)

    try {
      console.log("DEBUG: handleAnalyze - Fetching /api/campaigns/preview...");
      const res = await fetch(`${apiBaseUrl}/api/campaigns/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      
      console.log("DEBUG: handleAnalyze - Response status:", res.status);
      const data = await res.json()
      
      if (data.success) {
        console.log("DEBUG: handleAnalyze - Analysis successful", data);
        setCampaignPreview(data)
        setTimeout(() => {
          console.log("DEBUG: handleAnalyze - Scrolling to preview");
          previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 200)
      } else {
        console.error("DEBUG: handleAnalyze - Server returned error:", data.error);
        setAnalysisError(data.error || 'Unknown error');
      }
    } catch (e: any) {
      console.error('DEBUG: handleAnalyze - Exception during fetch:', e.message);
      setAnalysisError(e.message);
    } finally {
      setIsAnalyzing(false)
      console.log("DEBUG: handleAnalyze - Finished");
    }
  }

  const handleGenerateStrategy = async () => {
    if (!savedPrompt) return
    setIsGenerating(true)
    setLoadingStage('goal')

    const progressTimer = setTimeout(() => setLoadingStage('audience'), 2500)
    const progressTimer2 = setTimeout(() => setLoadingStage('content'), 5500)

    try {
      const res = await fetch(`${apiBaseUrl}/api/campaigns/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: savedPrompt }),
      })
      const data = await res.json()

      clearTimeout(progressTimer)
      clearTimeout(progressTimer2)

      setCampaignId(data.campaignId)
      setCurrentStrategy(data.strategy)
      setAudienceSize(data.strategy?.audience?.output?.count || 0)
      setIsGenerating(false)
      setLoadingStage(null)
      setCurrentStep(3)

      setTimeout(() => {
        strategyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } catch (e) {
      console.error('Generation failed', e)
      setIsGenerating(false)
      setLoadingStage(null)
    }
  }

  const handleLaunch = async () => {
    if (!campaignId) return
    setSimulationComplete(false)
    setBackendComplete(false)
    setCampaignStatus('queued')
    setCurrentStep(4)

    setTimeout(() => {
      executionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    try {
      const res = await fetch(`${apiBaseUrl}/api/campaigns/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      })
      const data = await res.json()
      if (data.audienceSize) setAudienceSize(data.audienceSize)
    } catch (e) {
      console.error('Launch failed', e)
    }
  }

  const strategy = currentStrategy as {
    goal?: { output?: { objective?: string; userPrompt?: string }; reasoning?: string }
    audience?: {
      output?: { segmentName?: string; criteria?: string; count?: number; expectedRevenue?: number }
      reasoning?: string
    }
    content?: { output?: { messages?: Record<string, string> } }
  } | null

  const expectedRevenue =
    campaignPreview?.expectedRevenue ||
    (strategy?.audience?.output?.expectedRevenue as number | undefined) ||
    0

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/20">
              <Zap className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tighter">CampaignPilot</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Revenue Copilot</p>
            </div>
          </div>
          {currentStep > 1 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-widest">
                <Database className="w-3.5 h-3.5" />
                Data Active
              </div>
              <button
                onClick={() => setShowDataModal(true)}
                className="px-4 py-2 rounded-lg bg-secondary/50 border border-border hover:border-accent/40 text-xs font-bold transition-all"
              >
                Switch Source
              </button>
            </div>
          )}
        </div>
      </header>

      {currentStep >= 3 && strategy && (
        <aside 
          className={`hidden xl:block fixed top-32 left-0 z-40 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? '-translate-x-[220px]' : 'translate-x-8'
          }`}
        >
          <div className="relative w-64 p-6 rounded-3xl bg-card/80 backdrop-blur-2xl border border-border/40 shadow-2xl">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="absolute -right-12 top-6 p-2 rounded-xl bg-card/80 border border-border/40 text-muted-foreground hover:text-accent transition-all shadow-lg backdrop-blur-xl"
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            
            <div className={`space-y-6 transition-opacity duration-300 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <div className="pb-4 border-b border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest">Active Campaign</p>
                </div>
                <h4 className="font-extrabold text-foreground leading-tight">
                  {strategy.goal?.output?.objective || 'Revenue Campaign'}
                </h4>
              </div>
              <div className="space-y-5">
                {[
                  { label: 'Target Segment', val: strategy.audience?.output?.segmentName || '—', icon: Users, color: 'text-blue-400' },
                  { label: 'Channels', val: 'Email + SMS', icon: Mail, color: 'text-cyan-400' },
                  { label: 'Status', val: campaignStatus === 'executing' ? 'Sending...' : campaignStatus.toUpperCase(), icon: Activity, color: campaignStatus === 'completed' ? 'text-success' : 'text-accent' },
                  { label: 'Revenue', val: metrics?.revenue ? `$${metrics.revenue.toLocaleString()}` : 'Simulating...', icon: DollarSign, color: 'text-emerald-400' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-muted-foreground/60">
                      <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <p className="text-[11px] font-bold text-foreground/90 pl-5 leading-tight">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-24 transition-all duration-300 ${currentStep >= 3 && strategy && !isSidebarCollapsed ? 'xl:pl-72' : ''}`}>
        {currentStep === 1 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <HeroOnboarding onConnect={() => setShowDataModal(true)} />
          </section>
        )}

        {currentStep > 1 && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-700">
            <WorkflowProgress currentStep={currentStep} />
          </section>
        )}

        {currentStep > 1 && shopifyConnection && (
          <section className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="rounded-[32px] border border-border/40 bg-card/70 p-6 text-foreground shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.23em] text-accent">Connected Data Source</p>
                  <h2 className="text-3xl font-black mt-3">Shopify Demo Integration</h2>
                  <p className="text-muted-foreground mt-2">{shopifyConnection.storeName} is connected and synced with your campaign data.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                  {[
                    { label: 'Customers', value: shopifyConnection.customers.toLocaleString() },
                    { label: 'Orders', value: shopifyConnection.orders.toLocaleString() },
                    { label: 'Revenue', value: `$${shopifyConnection.revenue.toLocaleString()}` },
                    { label: 'Last sync', value: shopifyConnection.lastSync },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl bg-background/80 border border-border/40 p-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
                      <p className="text-lg font-black text-foreground mt-2">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {currentStep === 2 && hasData && dataAnalysis && (
          <div className="space-y-24 animate-in fade-in duration-1000">
            <section>
              <DataAnalysisSummary data={dataAnalysis} />
            </section>
            <section>
              <AIOpportunities segments={dataAnalysis.segments} totalRevenue={dataAnalysis.totalRevenue} />
            </section>
            <section ref={promptRef} className="pt-10 scroll-mt-24">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-black text-foreground tracking-tight mb-4">What do you want to achieve?</h2>
                  <p className="text-muted-foreground text-lg">
                    The AI will analyze your data, explain its choice, then build your campaign.
                  </p>
                </div>
                <AIHero
                  onAnalyze={handleAnalyze}
                  hasData={hasData}
                  isAnalyzing={isAnalyzing}
                  isGenerating={isGenerating}
                  loadingStage={loadingStage}
                  initialPrompt={savedPrompt}
                  error={analysisError}
                />
                {campaignPreview && (
                  <div ref={previewRef}>
                    <AIExplainabilityPanel
                      preview={campaignPreview}
                      onGenerate={handleGenerateStrategy}
                      isGenerating={isGenerating}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {currentStep === 3 && currentStrategy && (
          <section ref={strategyRef} className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="max-w-5xl mx-auto">
              <AIReasoningEngine onLaunch={handleLaunch} strategy={currentStrategy} isLaunched={false} />
            </div>
          </section>
        )}

        {currentStep === 4 && (
          <section ref={executionRef} className="animate-in zoom-in-95 duration-1000 max-w-6xl mx-auto">
            <CampaignExecutionCenter
              metrics={metrics ?? undefined}
              audienceSize={audienceSize}
              expectedRevenue={expectedRevenue}
              avgOrderValue={dataAnalysis?.averageOrderValueRaw || 45}
              onSimulationComplete={() => {
                setSimulationComplete(true)
                if (!backendComplete) {
                  setTimeout(() => setBackendComplete(true), 500)
                }
              }}
            />
          </section>
        )}

        {currentStep === 5 && (
          <div className="space-y-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <section className="max-w-6xl mx-auto">
              <ExecutiveDashboard metrics={metrics ?? undefined} strategy={currentStrategy ?? undefined} segments={dataAnalysis?.segments} />
            </section>
            <div className="flex justify-center pb-20">
              <button
                onClick={() => {
                  setCurrentStep(2)
                  setCampaignId(null)
                  setCampaignStatus('draft')
                  setMetrics(null)
                  setCurrentStrategy(null)
                  setAudienceSize(0)
                  setCampaignPreview(null)
                  setSimulationComplete(false)
                  setBackendComplete(false)
                }}
                className="px-12 py-5 rounded-3xl bg-foreground text-background font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3"
              >
                <Zap className="w-6 h-6 fill-current" />
                Run Another Campaign
              </button>
            </div>
          </div>
        )}
      </main>

      <DataSourcesModal isOpen={showDataModal} onClose={() => setShowDataModal(false)} onDataLoaded={handleDataLoaded} />

      <footer className="border-t border-border bg-card/30 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-sm font-bold text-muted-foreground text-center">
            CampaignPilot AI Revenue Copilot — Turn data into revenue
          </p>
        </div>
      </footer>
    </div>
  )
}
