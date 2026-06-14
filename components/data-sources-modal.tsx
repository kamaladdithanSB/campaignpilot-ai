'use client'

import { useState, useRef } from 'react'
import { X, Upload, Database, Store, Loader2, FileText, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react'

interface DataSourcesModalProps {
  isOpen: boolean
  onClose: () => void
  onDataLoaded: (data: any) => void
}

export function DataSourcesModal({ isOpen, onClose, onDataLoaded }: DataSourcesModalProps) {
  const [step, setStep] = useState<'select' | 'csv-upload' | 'shopify-setup' | 'shopify-connecting' | 'shopify-success' | 'analyzing' | 'success'>('select')
  const [customersFile, setCustomersFile] = useState<File | null>(null)
  const [ordersFile, setOrdersFile] = useState<File | null>(null)
  const [shopifyStore, setShopifyStore] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [ingestionMessage, setIngestionMessage] = useState('Uploading files...')

  const customersRef = useRef<HTMLInputElement>(null)
  const ordersRef = useRef<HTMLInputElement>(null)

  const integrations = [
    {
      id: 'csv-local',
      icon: FileText,
      label: 'Local CSV Upload',
      description: 'Import customers.csv and orders.csv',
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
    },
    {
      id: 'shopify',
      icon: Store,
      label: 'Connect Shopify',
      description: 'Sync orders & customers from your Shopify store',
      color: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
    },
  ]

  const handleCsvIngest = async () => {
    if (!customersFile) {
      setError('Please provide at least a customers.csv file.')
      return
    }

    setIsUploading(true)
    setError(null)
    setStep('analyzing')
    setIngestionMessage('Uploading files...')

    const messages = [
      'Processing customers...',
      'Processing orders...',
      'Building segments...',
      'Generating insights...',
      'Optimizing neural paths...'
    ]
    
    let msgIndex = 0
    const msgInterval = setInterval(() => {
      if (msgIndex < messages.length) {
        setIngestionMessage(messages[msgIndex])
        msgIndex++
      }
    }, 1500)

    try {
      const formData = new FormData()
      formData.append('customers', customersFile)
      if (ordersFile) formData.append('orders', ordersFile)

      const response = await fetch('/api/data/ingest', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIngestionMessage('Complete')
        setTimeout(() => {
          setStats(data)
          setStep('success')
          onDataLoaded(data)
        }, 800)
      } else {
        setError(data.error || 'Failed to ingest data')
        setStep('csv-upload')
      }
    } catch (err) {
      setError('An unexpected error occurred during upload.')
      setStep('csv-upload')
    } finally {
      clearInterval(msgInterval)
      setIsUploading(false)
    }
  }

  const handleShopifyConnect = async () => {
    if (!shopifyStore.trim()) {
      setError('Enter your Shopify store name to continue.')
      return
    }

    setIsUploading(true)
    setError(null)
    setStep('shopify-connecting')
    setIngestionMessage('Connecting to Shopify...')

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    try {
      await delay(1800)
      await delay(1200)

      const customersImported = 980 + Math.round(shopifyStore.length * 4)
      const ordersImported = 420 + Math.round(shopifyStore.length * 3)
      const revenueValue = 62000 + Math.round(shopifyStore.length * 270)
      const averageOrderValue = `$${Math.max(38, Math.round(revenueValue / Math.max(ordersImported, 1))).toFixed(0)}`
      const lastSync = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())

      const data = {
        success: true,
        customersImported,
        ordersImported,
        totalRevenue: `$${revenueValue.toLocaleString()}`,
        averageOrderValue,
        averageOrderValueRaw: revenueValue / Math.max(ordersImported, 1),
        segments: [],
        shopify: {
          storeName: shopifyStore,
          customers: customersImported,
          orders: ordersImported,
          revenue: revenueValue,
          lastSync,
        },
      }

      setStats(data)
      setIngestionMessage('Shopify connection established')
      setTimeout(() => {
        setStep('shopify-success')
        onDataLoaded(data)
      }, 800)
    } catch (err) {
      setError('Unable to connect to Shopify. Please check the store name and try again.')
      setStep('shopify-setup')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card border border-border/40 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-card border-b border-border/20 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Connect Data Sources</h2>
            <p className="text-sm text-muted-foreground mt-1">Power your AI with customer behavior data</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-secondary/50 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'select' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {integrations.map((integration) => {
                const Icon = integration.icon
                return (
                  <button
                    key={integration.id}
                    onClick={() => {
                      if (integration.id === 'csv-local') {
                        setStep('csv-upload')
                      } else if (integration.id === 'shopify') {
                        setError(null)
                        setStep('shopify-setup')
                      }
                    }}
                    className="w-full text-left rounded-[28px] border border-border/40 bg-background/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-accent/5 group"
                  >
                    <div className="relative z-10 flex items-center gap-5">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${integration.color} border border-border/20 shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon className={`w-6 h-6 ${integration.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground text-lg">{integration.label}</h3>
                          {'badge' in integration && integration.badge && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-secondary border border-border/40 text-muted-foreground">
                              {integration.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{integration.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                )
              })}
            </div>
          )}


          {step === 'csv-upload' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customers CSV */}
                <div 
                  onClick={() => customersRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer group ${
                    customersFile ? 'border-accent/50 bg-accent/5' : 'border-border/40 hover:border-accent/30 hover:bg-accent/5'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={customersRef} 
                    onChange={(e) => setCustomersFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    accept=".csv"
                  />
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`p-3 rounded-full ${customersFile ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">customers.csv</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Required</p>
                    </div>
                    {customersFile && (
                      <p className="text-xs font-bold text-accent truncate max-w-full italic px-2">{customersFile.name}</p>
                    )}
                  </div>
                </div>

                {/* Orders CSV */}
                <div 
                  onClick={() => ordersRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer group ${
                    ordersFile ? 'border-success/50 bg-success/5' : 'border-border/40 hover:border-success/30 hover:bg-success/5'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={ordersRef} 
                    onChange={(e) => setOrdersFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    accept=".csv"
                  />
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`p-3 rounded-full ${ordersFile ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">orders.csv</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Optional</p>
                    </div>
                    {ordersFile && (
                      <p className="text-xs font-bold text-success truncate max-w-full italic px-2">{ordersFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="bg-accent/5 rounded-2xl p-5 border border-accent/10">
                <h4 className="text-xs font-black text-accent uppercase tracking-widest mb-3">CSV Format Guidance</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">customers.csv</span>: email, name</p>
                    <div className="h-px flex-1 bg-accent/10" />
                    <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">orders.csv</span>: email, amount</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('select')}
                  className="flex-1 py-4 px-6 rounded-2xl border border-border/40 font-bold text-muted-foreground hover:bg-secondary/50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleCsvIngest}
                  disabled={!customersFile || isUploading}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-gradient-to-r from-accent to-primary text-accent-foreground font-black text-lg shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  Start Ingestion
                </button>
              </div>
            </div>
          )}

          {step === 'shopify-setup' && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <Store className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-foreground">Connect your Shopify store</h3>
                  <p className="text-muted-foreground">Enter your store name to simulate a Shopify connection and import sales metrics.</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-[0.24em]">
                  Store name
                </label>
                <input
                  value={shopifyStore}
                  onChange={(event) => setShopifyStore(event.target.value)}
                  placeholder="e.g. my-store"
                  className="w-full rounded-3xl border border-border/40 bg-background px-4 py-4 text-foreground shadow-sm focus:border-accent focus:outline-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShopifyStore('')
                    setStep('select')
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl border border-border/40 font-bold text-muted-foreground hover:bg-secondary/50 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleShopifyConnect}
                  disabled={isUploading}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isUploading ? 'Connecting...' : 'Connect Shopify'}
                </button>
              </div>
            </div>
          )}

          {step === 'shopify-connecting' && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-10 animate-in zoom-in-95">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                <Store className="w-12 h-12 text-emerald-500 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-4 w-full max-w-xs">
                <h3 className="text-2xl font-black text-foreground tracking-tight">Connecting your Shopify store...</h3>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-progress-indeterminate rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Verifying your store and syncing metrics.</p>
              </div>
            </div>
          )}

          {step === 'shopify-success' && stats && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center text-success animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-foreground tracking-tight">Shopify Connected</h3>
                  <p className="text-muted-foreground mt-1">
                    {shopifyStore} is now connected and synced with your campaign data.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Customers', val: stats.shopify.customers.toLocaleString() },
                  { label: 'Orders', val: stats.shopify.orders.toLocaleString() },
                  { label: 'Revenue', val: `$${stats.shopify.revenue.toLocaleString()}` },
                  { label: 'Last sync', val: stats.shopify.lastSync },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-2xl bg-secondary/30 border border-border/40 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                    <p className="text-base font-bold text-foreground mt-1">{s.val}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={onClose}
                className="w-full py-5 rounded-2xl bg-foreground text-background font-black text-xl hover:scale-[1.02] transition-all shadow-xl shadow-foreground/10"
              >
                Start Building a Campaign
              </button>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-10 animate-in zoom-in-95">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
                <Database className="w-12 h-12 text-accent absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-4 w-full max-w-xs">
                <h3 className="text-2xl font-black text-foreground tracking-tight">{ingestionMessage}</h3>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-accent animate-progress-indeterminate rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Neural Engine Synthesizing...</p>
              </div>
            </div>
          )}

          {step === 'success' && stats && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center text-success animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                   <h3 className="text-3xl font-black text-foreground tracking-tight">Data Integrated Successfully</h3>
                   <p className="text-muted-foreground mt-1">
                     Completed in <span className="text-accent font-bold">{(stats.ingestionTimeMs / 1000).toFixed(1)}s</span>
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Customers', val: stats.customersImported },
                  { label: 'Orders', val: stats.ordersImported },
                  { label: 'Revenue', val: stats.totalRevenue },
                  { label: 'Avg Order', val: stats.averageOrderValue }
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-2xl bg-secondary/30 border border-border/40 text-center">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                    <p className="text-base font-bold text-foreground mt-1">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Error Logs if any */}
              {stats.failedRows && stats.failedRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-warning uppercase tracking-widest flex items-center gap-2">
                       <AlertCircle className="w-4 h-4" />
                       Ingestion Logs ({stats.totalErrors} Rows Skipped)
                    </h4>
                  </div>
                  <div className="max-h-32 overflow-y-auto px-4 py-3 rounded-xl bg-warning/5 border border-warning/20 space-y-2 scrollbar-thin scrollbar-thumb-warning/20">
                     {stats.failedRows.map((err: any, i: number) => (
                       <p key={i} className="text-[11px] text-warning/80 font-mono">
                         <span className="font-bold">Row {err.row}</span>: {err.error} ({err.type})
                       </p>
                     ))}
                     {stats.totalErrors > 50 && (
                       <p className="text-[10px] text-muted-foreground italic pt-2">...and {stats.totalErrors - 50} more errors</p>
                     )}
                  </div>
                </div>
              )}

              <button 
                onClick={onClose}
                className="w-full py-5 rounded-2xl bg-foreground text-background font-black text-xl hover:scale-[1.02] transition-all shadow-xl shadow-foreground/10"
              >
                Proceed to Strategy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
