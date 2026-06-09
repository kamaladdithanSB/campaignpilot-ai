'use client'

import { MoreHorizontal, TrendingUp } from 'lucide-react'

export function CampaignsTable() {
  const campaigns = [
    {
      id: 1,
      name: 'VIP Weekend Early Access',
      audience: '12,450',
      sent: '11,920',
      conversions: '978',
      revenue: '$145,200',
      status: 'Active',
      performance: '+28%',
    },
    {
      id: 2,
      name: 'Win Back Campaign - Q2',
      audience: '8,320',
      sent: '7,980',
      conversions: '445',
      revenue: '$82,450',
      status: 'Active',
      performance: '+15%',
    },
    {
      id: 3,
      name: 'Premium Product Launch',
      audience: '25,600',
      sent: '24,340',
      conversions: '1,247',
      revenue: '$298,920',
      status: 'Completed',
      performance: '+42%',
    },
    {
      id: 4,
      name: 'Seasonal Sale - Flash Deal',
      audience: '31,200',
      sent: '29,850',
      conversions: '1,892',
      revenue: '$412,180',
      status: 'Completed',
      performance: '+38%',
    },
    {
      id: 5,
      name: 'Loyalty Program Boost',
      audience: '5,670',
      sent: '5,420',
      conversions: '612',
      revenue: '$98,340',
      status: 'Draft',
      performance: '+22%',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/10 text-green-400'
      case 'Completed':
        return 'bg-blue-500/10 text-blue-400'
      case 'Draft':
        return 'bg-yellow-500/10 text-yellow-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="relative rounded-xl border border-border/60 bg-gradient-to-br from-card to-card/80 p-7 overflow-hidden hover:border-border transition-all duration-300 group">
      {/* Background accent effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-center justify-between mb-6 pb-6 border-b border-border/40">
        <div>
          <h2 className="text-xl font-bold text-foreground">Recent Campaigns</h2>
          <p className="text-xs text-muted-foreground mt-1.5">AI-orchestrated campaign performance</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-semibold border border-border/60 hover:border-accent/40 hover:bg-card/80 text-muted-foreground hover:text-accent transition-all duration-300">
          View all
        </button>
      </div>

      <div className="relative z-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="text-left py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Campaign</th>
              <th className="text-left py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Audience</th>
              <th className="text-left py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Sent</th>
              <th className="text-left py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Conversions</th>
              <th className="text-left py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Revenue</th>
              <th className="text-left py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-left py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Performance</th>
              <th className="text-center py-3.5 px-4" />
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-border/30 hover:bg-accent/5 transition-all duration-200 cursor-pointer group/row"
              >
                <td className="py-4 px-4 font-semibold text-foreground group-hover/row:text-accent transition-colors">
                  {campaign.name}
                </td>
                <td className="py-4 px-4 text-foreground">{campaign.audience}</td>
                <td className="py-4 px-4 text-foreground">{campaign.sent}</td>
                <td className="py-4 px-4 font-semibold text-emerald-400">{campaign.conversions}</td>
                <td className="py-4 px-4 font-semibold text-foreground">{campaign.revenue}</td>
                <td className="py-4 px-4">
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    {campaign.performance}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <button className="p-2 rounded-lg hover:bg-accent/10 transition-all opacity-0 group-hover/row:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
