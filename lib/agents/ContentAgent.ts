import { AIAgent, AgentResponse, CampaignContent, CampaignStrategy } from '../types';
import { LLMProvider } from '../ai/LLMProvider';
import { getSegmentContent, type SegmentId } from '../services/StrategyEngine';

export class ContentAgent extends AIAgent<CampaignContent> {
  name = 'Content Agent';

  async execute(
    strategy: CampaignStrategy,
    userPrompt?: string,
    provider?: LLMProvider
  ): Promise<AgentResponse<CampaignContent>> {
    const goal = strategy.goal?.output as { objective: string; userPrompt?: string; intent?: string } | undefined;
    const prompt = userPrompt || goal?.userPrompt || goal?.objective || 'Increase revenue';
    const objective = goal?.objective || prompt;
    const intent = goal?.intent || 'CAMPAIGN';
    const segmentName = strategy.audience?.output.segmentName || 'valued customers';
    const segmentId = (strategy.audience?.output.segmentIds?.[0] || 'high-value') as SegmentId;
    const audienceCriteria = strategy.audience?.output.criteria || 'Active customers';
    const expectedRevenue = strategy.audience?.output.expectedRevenue || 0;

    const segmentContent = getSegmentContent(segmentId, segmentName, objective);

    if (provider) {
      const aiPrompt = `
        You are a retail marketing copywriter. Write UNIQUE content based on the user's intent.
        
        User Goal: "${prompt}"
        Campaign Objective: "${objective}"
        Intent: ${intent}
        Target Segment: "${segmentName}"
        Audience Profile: "${audienceCriteria}"
        Expected Revenue: $${expectedRevenue}
        
        If intent is CAMPAIGN:
        - Generate email and SMS copy.
        - Reference the segment behavior.
        
        If intent is ANALYSIS:
        - Instead of standard campaign copy, provide a "Strategic Recommendation" in the email field and a "Quick Take" in the SMS field.
        
        Return JSON:
        {
          "subjectLine": "Compelling email subject or Analysis Title",
          "messages": {
            "email": "Content for email or Strategic Recommendation",
            "sms": "SMS or Quick Take"
          },
          "reasoning": "Why this messaging/recommendation is right for this goal"
        }
      `;

      try {
        const response = await provider.generate(aiPrompt);

const jsonMatch = response.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("No JSON found in Content Agent response");
}

const data = JSON.parse(jsonMatch[0]);
        if (data.messages?.email && data.messages?.sms) {
          return {
            output: {
              messages: data.messages,
              subjectLine: data.subjectLine || segmentContent.subjectLine,
              templates: [`${segmentId}-email-v1`, `${segmentId}-sms-v1`],
            },
            reasoning: data.reasoning || segmentContent.reasoning,
          };
        }
      } catch (error) {
        console.error('Content Agent Gemini Error:', error);
      }
    }

    return {
      output: {
        messages: { email: segmentContent.email, sms: segmentContent.sms },
        subjectLine: segmentContent.subjectLine,
        templates: [`${segmentId}-email-v1`, `${segmentId}-sms-v1`],
      },
      reasoning: segmentContent.reasoning,
    };
  }
}
