'use client'

import { useState } from 'react'
import { AIHero } from '@/components/ai-hero'
import { PerformanceChart } from '@/components/performance-chart'
import { AIReasoningEngine } from '@/components/ai-reasoning-engine'
import { WorkflowProgress } from '@/components/workflow-progress'
import { AIOpportunities } from '@/components/ai-opportunities'
import { DataSourcesModal } from '@/components/data-sources-modal'
import { DataAnalysisSummary } from '@/components/data-analysis-summary'
import { CampaignExecutionCenter } from '@/components/campaign-execution-center'
import { CampaignSummaryCard } from '@/components/campaign-summary-card'
import { Zap, Database } from 'lucide-react'

export default function Dashboard() {
  const [showDataModal, setShowDataModal] = useState(false)
  const [hasData, setHasData] = useState(false)
  const [dataAnalysis, setDataAnalysis] = useState<any>(null)
  const [campaignStatus, setCampaignStatus] = useState<'draft' | 'queued' | 'executing' | 'completed'>('draft')

  const handleDataLoaded = (data: any) => {
    setDataAnalysis(data)
    setHasData(true)
  }

  const handleLaunchStrategy = () => {
    setCampaignStatus('queued')
    setTimeout(() => setCampaignStatus('executing'), 1000)
    setTimeout(() => setCampaignStatus('completed'), 4000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <Zap className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CampaignPilot AI</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Marketing Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setShowDataModal(true)}
            className="px-4 py-2 rounded-lg bg-secondary border border-border hover:border-accent text-foreground text-sm font-medium transition-all flex items-center gap-2 group"
          >
            <Database className="w-4 h-4 group-hover:text-accent transition-colors" />
            <span>{hasData ? 'Data Sources' : 'Connect Data'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Data Analysis Summary */}
        {hasData && !dataAnalysis && (
          <section>
            <DataAnalysisSummary data={dataAnalysis} />
          </section>
        )}

        {/* AI Hero Section */}
        <section>
          <AIHero onLaunchStrategy={handleLaunchStrategy} />
        </section>

        {/* AI Reasoning Engine */}
        {campaignStatus === 'draft' && (
          <section>
            <AIReasoningEngine onLaunch={handleLaunchStrategy} />
          </section>
        )}

        {/* Workflow Progress or Execution Center */}
        {campaignStatus === 'draft' && (
          <section>
            <WorkflowProgress />
          </section>
        )}

        {(campaignStatus === 'queued' || campaignStatus === 'executing') && (
          <section>
            <CampaignExecutionCenter />
          </section>
        )}

        {/* Performance Visualization */}
        {(campaignStatus === 'executing' || campaignStatus === 'completed') && (
          <section>
            <PerformanceChart />
          </section>
        )}

        {/* Campaign Summary */}
        {campaignStatus === 'completed' && (
          <section>
            <CampaignSummaryCard />
          </section>
        )}

        {/* AI Opportunities */}
        {campaignStatus !== 'queued' && (
          <section>
            <AIOpportunities />
          </section>
        )}
      </main>

      {/* Data Sources Modal */}
      <DataSourcesModal
        isOpen={showDataModal}
        onClose={() => setShowDataModal(false)}
        onDataLoaded={handleDataLoaded}
      />

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 CampaignPilot AI. AI-native marketing for retail.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
