'use client'

import { useState } from 'react'
import {
  Brain,
  Zap,
  Users,
  Target,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

interface AIReasoningEngineProps {
  onLaunch?: () => void
  strategy?: {
    goal?: { output?: { objective?: string; kpis?: string[] }; reasoning?: string }
    audience?: {
      output?: {
        segmentName?: string
        count?: number
        criteria?: string
        expectedRevenue?: number
        businessImpact?: string
      }
      reasoning?: string
    }
    content?: {
      output?: { messages?: { email?: string; sms?: string }; subjectLine?: string }
      reasoning?: string
    }
  }
  isLaunched?: boolean
}

export function AIReasoningEngine({ onLaunch, strategy, isLaunched = false }: AIReasoningEngineProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const objective = strategy?.goal?.output?.objective || 'Increase revenue';
  const goalReasoning = strategy?.goal?.reasoning || 'Analyzing your customer data to find the highest-impact revenue opportunity.';
  const segmentName = strategy?.audience?.output?.segmentName || 'High Value Customers';
  const segmentCount = strategy?.audience?.output?.count || 0;
  const audienceReasoning = strategy?.audience?.reasoning || 'This segment shows the strongest purchase patterns for your goal.';
  const businessImpact = strategy?.audience?.output?.businessImpact || '';
  const expectedRevenue = strategy?.audience?.output?.expectedRevenue || 0;
  const contentReasoning = strategy?.content?.reasoning || 'Messaging tailored to drive action from this segment.';
  const subjectLine = strategy?.content?.output?.subjectLine || 'Your exclusive offer inside';
  const emailBody = strategy?.content?.output?.messages?.email || '';
  const smsBody = strategy?.content?.output?.messages?.sms || '';

  const insights = [
    {
      id: 'opportunity',
      icon: Target,
      title: 'Revenue Opportunity',
      tag: 'What we found',
      content: goalReasoning,
      highlight: objective,
      metric: { label: 'Goal', value: objective },
    },
    {
      id: 'segment',
      icon: Users,
      title: 'Why This Segment',
      tag: 'AI selection',
      content: audienceReasoning,
      highlight: segmentName,
      metric: {
        label: 'Audience Size',
        value: segmentCount.toLocaleString(),
      },
      impact: businessImpact,
      expectedRevenue,
    },
    {
      id: 'content',
      icon: MessageSquare,
      title: 'Campaign Messaging',
      tag: 'What customers will receive',
      content: contentReasoning,
      highlight: 'Email + SMS ready',
      metric: { label: 'Channels', value: 'Email & SMS' },
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-border/40">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-accent/20 border border-accent/30 text-accent">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-accent uppercase tracking-widest">AI Revenue Copilot</span>
          </div>
          <h2 className="text-4xl font-black text-foreground tracking-tighter">Your Campaign, Explained</h2>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl">
            Here is what the AI found in your data, why it chose this segment, and what message will be sent.
          </p>
        </div>

        {!isLaunched ? (
          <button
            onClick={onLaunch}
            className="px-12 py-5 rounded-3xl bg-foreground text-background font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 group"
          >
            <Zap className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform" />
            Launch Campaign
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        ) : (
          <div className="flex items-center gap-4 px-8 py-5 rounded-2xl bg-success/10 border border-success/30 text-success font-black uppercase tracking-widest">
            <CheckCircle2 className="w-7 h-7" />
            Campaign Live
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {insights.map((insight) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className="rounded-[32px] border border-border/40 bg-card/40 p-10 space-y-6 hover:border-accent/30 transition-all"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">{insight.tag}</span>
                    <h3 className="text-2xl font-black text-foreground tracking-tight mt-1">{insight.title}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{insight.metric.label}</p>
                  <p className="text-lg font-black text-foreground">{insight.metric.value}</p>
                </div>
              </div>

              <p className="text-lg text-foreground/90 leading-relaxed font-medium">{insight.content}</p>

              {insight.id === 'segment' && expectedRevenue > 0 && (
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Expected Business Impact</p>
                    <p className="text-lg font-bold text-foreground">
                      {insight.impact || `~$${expectedRevenue.toLocaleString()} projected incremental revenue`}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-400/40 ml-auto" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-accent">
          <Mail className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Generated Campaign Assets — Ready to Send</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card/40 border border-border/60 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Email</span>
              </div>
              <button
                onClick={() => handleCopy(`Subject: ${subjectLine}\n\n${emailBody}`, 'email')}
                className="p-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 text-xs font-bold text-muted-foreground"
              >
                {copied === 'email' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Subject Line</p>
                <p className="font-bold text-foreground text-lg">{subjectLine}</p>
              </div>
              <div className="p-6 rounded-2xl bg-secondary/30 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {emailBody}
              </div>
            </div>
          </div>

          <div className="bg-card/40 border border-border/60 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest">SMS</span>
              </div>
              <button
                onClick={() => handleCopy(smsBody, 'sms')}
                className="p-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 text-xs font-bold text-muted-foreground"
              >
                {copied === 'sms' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                Copy
              </button>
            </div>
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-sm font-medium text-foreground leading-relaxed">
              {smsBody}
            </div>
            <p className="text-[10px] text-muted-foreground">{smsBody.length}/160 characters</p>
          </div>
        </div>
      </div>
    </div>
  );
}
