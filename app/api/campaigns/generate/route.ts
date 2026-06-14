import { NextResponse } from 'next/server';
import { GoalInterpreterAgent } from '@/lib/agents/GoalInterpreterAgent';
import { AudienceAgent } from '@/lib/agents/AudienceAgent';
import { ContentAgent } from '@/lib/agents/ContentAgent';
import { prisma } from '@/lib/prisma';
import { OpenRouterProvider } from '@/lib/ai/OpenRouterProvider';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const provider = new OpenRouterProvider();
    const goalAgent = new GoalInterpreterAgent();
    const audienceAgent = new AudienceAgent();
    const contentAgent = new ContentAgent();

    let strategy = {
      goal: null,
      audience: null,
      content: null,
    };

    const goalRes = await goalAgent.execute(strategy as any, prompt, provider);
    strategy.goal = goalRes as any;

    const audienceRes = await audienceAgent.execute(strategy as any, prompt, provider);
    strategy.audience = audienceRes as any;

    const contentRes = await contentAgent.execute(strategy as any, prompt, provider);
    strategy.content = contentRes as any;

    const campaign = await prisma.campaign.create({
      data: {
        title: `Campaign: ${goalRes.output.objective}`,
        status: 'DRAFT',
        strategy: JSON.stringify(strategy),
      },
    });

    await prisma.campaignMetrics.create({
      data: { campaignId: campaign.id },
    });

    return NextResponse.json({ success: true, campaignId: campaign.id, strategy });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Generation failure:', message);

    return NextResponse.json(
      { error: 'Failed to generate strategy. Please refine your prompt.' },
      { status: 500 }
    );
  }
}
