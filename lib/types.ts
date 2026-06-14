import { LLMProvider } from './ai/LLMProvider';

export interface AgentResponse<T> {
  output: T;
  reasoning: string;
}

export interface CampaignGoal {
  objective: string;
  kpis: string[];
  userPrompt?: string;
}

export interface CampaignAudience {
  segmentIds: string[];
  segmentName: string;
  count: number;
  criteria: string;
  customerIds: string[];
  expectedRevenue?: number;
  businessImpact?: string;
}

export interface CampaignContent {
  messages: Record<string, string>;
  subjectLine?: string;
  templates: string[];
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  revenueContribution: number;
  revenuePercent: number;
}

export interface CampaignStrategy {
  goal: AgentResponse<CampaignGoal> | null;
  audience: AgentResponse<CampaignAudience> | null;
  content: AgentResponse<CampaignContent> | null;
}

export abstract class AIAgent<T> {
  abstract name: string;
  abstract execute(strategy: CampaignStrategy, input?: any, provider?: LLMProvider): Promise<AgentResponse<T>>;
}

