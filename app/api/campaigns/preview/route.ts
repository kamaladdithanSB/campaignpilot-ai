import { NextResponse } from 'next/server';
import { CustomerIntelligenceService } from '@/lib/services/CustomerIntelligenceService';
import {
  analyzePrompt,
  buildAudienceReasoning,
  buildGoalReasoning,
  computeExpectedRevenue,
  type SegmentId,
} from '@/lib/services/StrategyEngine';
import { OpenRouterProvider } from '@/lib/ai/OpenRouterProvider';

export async function POST(req: Request) {
  console.log("DEBUG: POST /api/campaigns/preview - Start");
  try {
    const { prompt } = await req.json();
    console.log("DEBUG: Received prompt:", prompt);
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log("DEBUG: Discovering segments...");
    const intelligence = await CustomerIntelligenceService.discoverSegments();
    if (!intelligence.segments.length) {
  return NextResponse.json(
    {
      error: "No customer segments found. Please ingest customer data first.",
    },
    { status: 400 }
  );
}
    console.log("========== SEGMENTS ==========");

intelligence.segments.forEach(s => {
  console.log({
    id: s.id,
    name: s.name,
    customers: s.customerCount,
    revenue: s.revenueContribution
  });
});

console.log("==============================");
    console.log("DEBUG: Segments found:", intelligence.segments.length);
    
    const analysis = analyzePrompt(prompt);
    console.log("DEBUG: Initial analysis:", analysis);
    
    const provider = new OpenRouterProvider();

    // AI-driven Segment Selection and Analysis
    let segment = null as typeof intelligence.segments[number] | null;
    let reasoning = `Analyzing your customer data for: "${prompt}"`;
    let goalReasoning = '';
    let objective = analysis.objective;
    let intent = analysis.intent;
    let aiData: any = {};
    try {
      console.log("DEBUG: Preparing AI prompt...");
      const segmentsSummary = intelligence.segments.map(s => `- ID: ${s.id}, Name: ${s.name}, Size: ${s.customerCount}, Revenue: $${s.revenueContribution.toFixed(0)}`).join('\n');
      
      const aiPrompt = `
You are a senior CRM strategist for a retail company.

A retailer has uploaded customer and order data.

Retailer's Goal:
"${prompt}"

Available Customer Segments:

${segmentsSummary}

Your task:

1. Understand the retailer's business goal.
2. Select the BEST segment.
3. Explain WHY.
4. Recommend a campaign.
5. Predict business impact.

Return ONLY valid JSON.

{
  "intent": "CAMPAIGN",
  "objective": "",
  "selectedSegmentId": "",
  "segmentReasoning": "",
  "goalReasoning": "",
  "businessImpact": "",
  "recommendedAction": "",
  "emailSubject": "",
  "emailCopy": "",
  "smsCopy": ""
}
`;
      
      console.log("DEBUG: Calling OpenRouter...");
      const response = await provider.generate(aiPrompt);

console.log("========== RAW GEMINI ==========");
console.log(response);
console.log("================================");

const jsonMatch = response.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error("No JSON found in AI response");
}

aiData = JSON.parse(jsonMatch[0]);
      console.log("DEBUG: Parsed Gemini data:", aiData);
      
      if (aiData.intent) intent = aiData.intent;
      if (aiData.objective) objective = aiData.objective;
      if (aiData.selectedSegmentId) {
        const found = intelligence.segments.find(s => s.id === aiData.selectedSegmentId);
        if (found) {
          segment = found;
          console.log("DEBUG: AI selected segment:", segment.name);
        }
      }
      
      if (aiData.segmentReasoning) reasoning = aiData.segmentReasoning;
      if (aiData.goalReasoning) goalReasoning = aiData.goalReasoning;
   } catch (e: any) {
  console.error("DEBUG: Preview AI error:", e);

  return NextResponse.json(
    {
      error:
        "AI service unavailable. Please check OpenRouter API key or model configuration.",
    },
    { status: 503 }
  );
}

    if (!segment) {
      console.log("DEBUG: Error - No segment found");
      return NextResponse.json({ error: 'No customer data found. Upload CSV first.' }, { status: 400 });
    }

    console.log("DEBUG: Computing expected revenue...");
    const expectedRevenue = computeExpectedRevenue(
      segment,
      intelligence,
      segment.id as any
    );
    console.log("DEBUG: Expected revenue:", expectedRevenue);

    const averageSpend =
      segment.customerCount > 0
        ? segment.revenueContribution / segment.customerCount
        : intelligence.averageOrderValue;

    const emailSubject = aiData.emailSubject ?? "";
    const emailCopy = aiData.emailCopy ?? "";
    const smsCopy = aiData.smsCopy ?? "";
    const recommendedAction = aiData.recommendedAction ?? "";
    
    const result = {
      success: true,
      userPrompt: prompt,
      analysis: {
        segmentId: segment.id,
        intent: intent,
        objective: objective,
        matchReason: reasoning, // Provide matchReason which frontend expects
      },
      segment: {
        id: segment.id,
        name: segment.name,
        description: segment.description,
        customerCount: segment.customerCount,
        averageSpend, // ADDED THIS
        revenueContribution: segment.revenueContribution,
        revenuePercent: segment.revenuePercent,
      },
      aiAssets: {
  recommendedAction,
  emailSubject,
  emailCopy,
  smsCopy,
},
      expectedRevenue,
      reasoning,
      goalReasoning,
      businessImpact:
  aiData.businessImpact ??
  `Projected $${expectedRevenue.toLocaleString()} in incremental revenue.`,
    };
    
    console.log("DEBUG: Returning success result");
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('DEBUG: POST /api/campaigns/preview - Fatal error:', error.message);
    const message = error instanceof Error ? error.message : 'Preview failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
