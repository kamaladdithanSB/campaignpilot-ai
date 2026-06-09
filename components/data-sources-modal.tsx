'use client'

import { useState } from 'react'
import { X, Upload, Database, Store, Loader2 } from 'lucide-react'

interface DataSourcesModalProps {
  isOpen: boolean
  onClose: () => void
  onDataLoaded: (data: any) => void
}

export function DataSourcesModal({ isOpen, onClose, onDataLoaded }: DataSourcesModalProps) {
  const [step, setStep] = useState<'select' | 'upload' | 'analyzing'>('select')
  const [uploadProgress, setUploadProgress] = useState(0)

  const integrations = [
    {
      id: 'csv-customers',
      icon: Upload,
      label: 'Import Customers CSV',
      description: 'Upload your customer database',
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      id: 'csv-orders',
      icon: Upload,
      label: 'Import Orders CSV',
      description: 'Upload transaction history',
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'shopify',
      icon: Store,
      label: 'Connect Shopify',
      description: 'Sync from Shopify store',
      color: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
    },
    {
      id: 'woocommerce',
      icon: Store,
      label: 'Connect WooCommerce',
      description: 'Sync from WooCommerce',
      color: 'from-purple-500/20 to-purple-600/10',
      iconColor: 'text-purple-400',
    },
    {
      id: 'pos',
      icon: Database,
      label: 'Connect POS System',
      description: 'Integrate with your POS',
      color: 'from-orange-500/20 to-orange-600/10',
      iconColor: 'text-orange-400',
    },
  ]

  const handleConnect = (id: string) => {
    setStep('analyzing')
    
    // Simulate analysis
    setTimeout(() => {
      onDataLoaded({
        source: id,
        customersImported: 12450,
        ordersImported: 45230,
        totalRevenue: '$2.87M',
        vipCustomers: 1247,
        churnRiskCustomers: 2841,
        highValueSegments: 4,
      })
      onClose()
      setStep('select')
    }, 2500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card border border-border/60 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border/40 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Connect Your Data Sources</h2>
            <p className="text-sm text-muted-foreground mt-1">AI will analyze your customer base to identify opportunities</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-3">
              {integrations.map((integration) => {
                const Icon = integration.icon
                return (
                  <button
                    key={integration.id}
                    onClick={() => handleConnect(integration.id)}
                    className={`w-full text-left p-4 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-card/80 transition-all duration-300 group relative overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${integration.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${integration.color} border border-border/40`}>
                        <Icon className={`w-5 h-5 ${integration.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{integration.label}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{integration.description}</p>
                      </div>
                      <div className="text-muted-foreground group-hover:text-accent transition-colors">→</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-border/40 border-t-accent animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-transparent border-r-accent/50 animate-pulse" />
              </div>
              <p className="text-foreground font-semibold">Analyzing your customer base...</p>
              <p className="text-sm text-muted-foreground mt-2">CampaignPilot&apos;s neural engine is discovering patterns</p>
              <div className="w-full bg-border/40 rounded-full h-1 mt-6">
                <div className="bg-gradient-to-r from-accent to-primary h-full rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
