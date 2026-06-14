'use client'

import { CheckCircle2, Database, Search, Brain, Rocket, BarChart3 } from 'lucide-react'

interface WorkflowProgressProps {
  currentStep: number
}

export function WorkflowProgress({ currentStep }: WorkflowProgressProps) {
  const stages = [
    { id: 1, label: 'Upload Data', icon: Database, description: 'Connect your CSV' },
    { id: 2, label: 'Find Opportunities', icon: Search, description: 'AI discovers segments' },
    { id: 3, label: 'AI Explains', icon: Brain, description: 'Review strategy' },
    { id: 4, label: 'Simulate Launch', icon: Rocket, description: 'Live campaign' },
    { id: 5, label: 'View ROI', icon: BarChart3, description: 'Results & next steps' },
  ];

  return (
    <div className="relative">
      <div className="hidden md:flex items-center justify-between gap-4 p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-md shadow-xl">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = currentStep === stage.id;
          const isCompleted = currentStep > stage.id;
          const isUpcoming = currentStep < stage.id;

          return (
            <div key={stage.id} className="flex flex-1 items-center gap-4 group">
              <div className="flex items-center gap-4 relative">
                <div
                  className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                  ${isActive ? 'bg-accent text-accent-foreground border-accent scale-110 shadow-lg shadow-accent/20' : ''}
                  ${isCompleted ? 'bg-success/20 text-success border-success/40' : ''}
                  ${isUpcoming ? 'bg-secondary/40 text-muted-foreground border-border/40' : ''}
                `}
                >
                  {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
                </div>

                <div className="flex flex-col">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isActive ? 'text-accent' : 'text-muted-foreground'}`}
                  >
                    Step {stage.id}
                  </span>
                  <span
                    className={`text-sm font-bold whitespace-nowrap tracking-tight ${isActive ? 'text-foreground' : 'text-muted-foreground/60'}`}
                  >
                    {stage.label}
                  </span>
                </div>
              </div>

              {index < stages.length - 1 && (
                <div className="flex-1 px-4">
                  <div
                    className={`h-1 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-success/30' : 'bg-border/20'}`}
                  >
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-1000"
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="md:hidden flex items-center justify-between p-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md">
        {stages.map((stage) => {
          const isActive = currentStep === stage.id;
          const isCompleted = currentStep > stage.id;
          if (!isActive && !isCompleted && stage.id !== currentStep + 1) return null;

          return (
            <div key={stage.id} className={`flex items-center gap-3 ${isActive ? 'flex-1' : ''}`}>
              <div
                className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all
                ${isActive ? 'bg-accent text-accent-foreground border-2 border-accent' : ''}
                ${isCompleted ? 'bg-success/20 text-success' : 'bg-secondary/40 text-muted-foreground'}
              `}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <stage.icon className="w-5 h-5" />}
              </div>
              {isActive && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-tight text-accent">Active</span>
                  <span className="text-xs font-bold text-foreground">{stage.label}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
