import { AIAgent, AgentResponse, CampaignGoal, CampaignStrategy } from '../types';
import { LLMProvider } from '../ai/LLMProvider';
import { CustomerIntelligenceService } from '../services/CustomerIntelligenceService';
import { analyzePrompt } from '../services/StrategyEngine';

export class GoalInterpreterAgent extends AIAgent<CampaignGoal & { userPrompt?: string; intent?: string }> {
  name = 'Goal Interpreter Agent';

  async execute(
    strategy: CampaignStrategy,
    prompt: string,
    provider?: LLMProvider
  ): Promise<AgentResponse<CampaignGoal & { userPrompt?: string; intent?: string }>> {
    const intelligence = await CustomerIntelligenceService.discoverSegments();
    const analysis = analyzePrompt(prompt);
    
    let reasoning = `Analyzing your ${intelligence.totalCustomers} customers and $${intelligence.totalRevenue.toLocaleString()} in revenue to interpret your goal: "${prompt}".`;
    let objective = analysis.objective;
    let intent = analysis.intent;

    if (provider) {
      const segmentsSummary = intelligence.segments.map(s => `- ${s.name}: ${s.customerCount} customers, $${s.revenueContribution.toFixed(0)} revenue`).join('\n');
      
      const aiPrompt = `
        You are a retail revenue strategist. Interpret this retailer's goal using their actual business data.
        
        User Goal: "${prompt}"
        
        Business Context:
        - Total Customers: ${intelligence.totalCustomers}
        - Total Revenue: $${intelligence.totalRevenue.toFixed(0)}
        - Average Order Value: $${intelligence.averageOrderValue.toFixed(2)}
        
        Available Segments:
        ${segmentsSummary}
        
        Determine if the user wants to launch a CAMPAIGN or if they are asking for an ANALYSIS of their data.
        
        Return JSON:
        {
          "intent": "CAMPAIGN" or "ANALYSIS",
          "objective": "Clear, data-aware objective based on the user's prompt",
          "kpis": ["KPI 1", "KPI 2"],
          "reasoning": "2 sentences explaining the revenue opportunity or analytical finding"
        }
      `;

      try {
        const response = await provider.generate(aiPrompt);

const jsonMatch = response.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("No JSON found in Goal Agent response");
}

const data = JSON.parse(jsonMatch[0]);
        return {
          output: {
            objective: data.objective || objective,
            kpis: data.kpis || ['Revenue', 'Engagement'],
            userPrompt: prompt,
            intent: data.intent || intent,
          },
          reasoning: data.reasoning || reasoning,
        };
      } catch (error) {
        console.error('Goal Interpreter Agent Gemini Error:', error);
      }
    }

    return {
      output: {
        objective,
        kpis: ['Revenue', 'Engagement'],
        userPrompt: prompt,
        intent,
      },
      reasoning,
    };
  }
}
