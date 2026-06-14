import { AIAgent, AgentResponse, CampaignAudience, CampaignStrategy } from '../types';
import { LLMProvider } from '../ai/LLMProvider';
import { CustomerIntelligenceService, CustomerSegment } from '../services/CustomerIntelligenceService';
import {
  computeExpectedRevenue,
} from '../services/StrategyEngine';

export class AudienceAgent extends AIAgent<CampaignAudience> {
  name = 'Audience Agent';

  async execute(
    strategy: CampaignStrategy,
    userPrompt?: string,
    provider?: LLMProvider
  ): Promise<AgentResponse<CampaignAudience>> {

    const goal = strategy.goal?.output as {
      objective: string;
      userPrompt?: string;
      intent?: string;
    } | undefined;

    const prompt =
      userPrompt ||
      goal?.userPrompt ||
      goal?.objective ||
      'Increase revenue';

    const intent = goal?.intent || 'CAMPAIGN';

    console.log("========== AUDIENCE AGENT ==========");
    console.log("Prompt:", prompt);
    console.log("Intent:", intent);
    console.log("Provider exists:", !!provider);

    const intelligence =
      await CustomerIntelligenceService.discoverSegments();

    let segment: CustomerSegment =
      intelligence.segments.sort(
        (a, b) => b.revenueContribution - a.revenueContribution
      )[0] || {
        id: 'all-customers',
        name: 'All Customers',
        description: 'Full customer base',
        customerCount: intelligence.totalCustomers,
        revenueContribution: intelligence.totalRevenue,
        revenuePercent: 100,
        customerIds: [],
      };

    console.log(
      "DEFAULT SEGMENT BEFORE AI:",
      segment.id,
      segment.name
    );

    let reasoning =
      `Selecting the optimal audience for your ${
        intent === 'ANALYSIS'
          ? 'analysis'
          : 'campaign'
      }.`;

    let criteria = segment.description;
    let businessImpact = '';

    if (provider) {

      const segmentsSummary =
        intelligence.segments
          .map(
            s =>
              `- ID: ${s.id}, Name: ${s.name}, Size: ${s.customerCount}, Revenue: $${s.revenueContribution.toFixed(0)}`
          )
          .join('\n');

      const aiPrompt = `
You are a retail revenue strategist.

User Goal:
"${prompt}"

Intent:
${intent}

Available Segments:

${segmentsSummary}

Select the BEST segment.

Return ONLY JSON:

{
  "selectedSegmentId": "",
  "criteria": "",
  "reasoning": "",
  "businessImpact": ""
}
`;

      try {

        console.log("Calling Audience AI...");

        const response =
          await provider.generate(aiPrompt);

        console.log(
          "========== AUDIENCE AI RAW =========="
        );
        console.log(response);
        console.log(
          "====================================="
        );

        const jsonMatch =
          response.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
          throw new Error(
            "No JSON found in AI response"
          );
        }

        const data =
          JSON.parse(jsonMatch[0]);

        console.log(
          "========== AUDIENCE AI PARSED =========="
        );
        console.log(data);
        console.log(
          "========================================"
        );

        if (data.selectedSegmentId) {

          const found =
            intelligence.segments.find(
              s =>
                s.id ===
                data.selectedSegmentId
            );

          if (found) {
            segment = found;
          }

          console.log(
            "AUDIENCE AGENT SELECTED:",
            segment.id,
            segment.name
          );
        }

        if (data.reasoning) {
          reasoning = data.reasoning;
        }

        if (data.criteria) {
          criteria = data.criteria;
        }

        if (data.businessImpact) {
          businessImpact =
            data.businessImpact;
        }

      } catch (error) {

        console.error(
          "AUDIENCE AGENT AI ERROR:",
          error
        );

      }
    }

    const expectedRevenue =
      computeExpectedRevenue(
        segment,
        intelligence,
        segment.id as any
      );

    if (!businessImpact) {
      businessImpact =
        `Projected $${expectedRevenue.toLocaleString()} in incremental revenue from ${segment.customerCount} customers.`;
    }

    return {
      output: {
        segmentIds: [segment.id],
        segmentName: segment.name,
        count: segment.customerCount,
        criteria,
        customerIds: segment.customerIds,
        expectedRevenue,
        businessImpact,
      },
      reasoning,
    };
  }
}