import type { CustomerSegment, IntelligenceSummary } from './CustomerIntelligenceService';

export type SegmentId = 'high-value' | 'recent-buyers' | 'at-risk' | 'weekend-shoppers';
export type UserIntent = 'CAMPAIGN' | 'ANALYSIS';

export interface PromptAnalysis {
  intent: UserIntent;
  objective: string;
}

export function analyzePrompt(prompt: string): PromptAnalysis {
  const lower = prompt.toLowerCase().trim();

  // Basic intent detection
  const isAnalysis = lower.includes('analyze') || lower.includes('why') || lower.includes('reason') || lower.includes('dropped') || lower.includes('fell');
  
  return {
    intent: isAnalysis ? 'ANALYSIS' : 'CAMPAIGN',
    objective: prompt.length > 10 ? prompt : 'Increase customer engagement',
  };
}

export function computeExpectedRevenue(
  segment: CustomerSegment,
  intelligence: IntelligenceSummary,
  segmentId: SegmentId
): number {
  // Data-driven prediction based on historical segment behavior
  const avgOrderValue = intelligence.averageOrderValue || 45;
  const segmentAOV = segment.customerCount > 0 ? segment.revenueContribution / segment.customerCount : avgOrderValue;

  // Dynamic lift factors based on segment type and size
  const baseLiftMap: Record<SegmentId, number> = {
    'high-value': 0.05,        // 5% lift for VIPs (harder to move significantly)
    'recent-buyers': 0.12,     // 12% lift (warm audience)
    'at-risk': 0.25,           // 25% lift (high recovery potential)
    'weekend-shoppers': 0.18,  // 18% lift
  };

  const lift = baseLiftMap[segmentId] || 0.1;
  const predictedConversions = Math.ceil(segment.customerCount * (lift * 0.8)); // Realistic conversion rate from lift

  return Math.round(predictedConversions * segmentAOV * 1.15); // Projected revenue with a small premium for campaign impact
}

export function buildAudienceReasoning(
  prompt: string,
  segment: CustomerSegment,
  intelligence: IntelligenceSummary,
  expectedRevenue: number
): string {
  const avgSpend =
    segment.customerCount > 0
      ? (segment.revenueContribution / segment.customerCount).toFixed(2)
      : intelligence.averageOrderValue.toFixed(2);

  return `Our analysis shows ${segment.customerCount} customers in this segment with an average order value of $${avgSpend}. By targeting this specific group for your goal — "${prompt}" — we project a revenue opportunity of $${expectedRevenue.toLocaleString()}. This segment accounts for ${segment.revenuePercent.toFixed(1)}% of your total revenue.`;
}

export function buildGoalReasoning(
  prompt: string,
  segment: CustomerSegment | null,
  intelligence: IntelligenceSummary
): string {
  if (!segment) {
    return `Analyzing ${intelligence.totalCustomers} customers to identify the optimal path for: "${prompt}".`;
  }
  return `The goal "${prompt}" is best achieved by targeting your "${segment.name}". This segment represents $${segment.revenueContribution.toLocaleString()} in existing revenue and has high conversion potential for this specific objective.`;
}

export function getSegmentContent(segmentId: SegmentId, segmentName: string, objective: string) {
  // Generic fallbacks for ContentAgent when AI is unavailable
  const templates: Record<SegmentId, { subjectLine: string; email: string; sms: string; offerCode: string; discount: string }> = {
    'weekend-shoppers': {
      subjectLine: 'Exclusive Weekend Offer for You',
      email: `Hi,\n\nWe noticed you enjoy shopping with us on weekends. As a thank you, here is a 15% discount for your next weekend purchase.\n\nUse code WEEKEND15 at checkout.\n\nHappy shopping!`,
      sms: `Weekend VIP: Get 15% off your next weekend order with code WEEKEND15!`,
      offerCode: 'WEEKEND15',
      discount: '15%',
    },
    'at-risk': {
      subjectLine: 'We miss you! Here is 20% off',
      email: `Hi,\n\nIt has been a while since your last visit. We'd love to see you again! Enjoy 20% off your next order.\n\nUse code WELCOMEBACK20 at checkout.\n\nHope to see you soon!`,
      sms: `We miss you! Use code WELCOMEBACK20 for 20% off your next order.`,
      offerCode: 'WELCOMEBACK20',
      discount: '20%',
    },
    'high-value': {
      subjectLine: 'A Special VIP Reward',
      email: `Hi,\n\nAs one of our most valued customers, we have a special offer for you. Get 10% off plus free shipping on your next order.\n\nUse code VIP10 at checkout.\n\nThank you for being a part of our community!`,
      sms: `VIP Exclusive: 10% off + Free Shipping with code VIP10. Thanks for being a VIP!`,
      offerCode: 'VIP10',
      discount: '10%',
    },
    'recent-buyers': {
      subjectLine: 'Thanks for your recent purchase!',
      email: `Hi,\n\nWe hope you're loving your recent purchase. Here's a 10% discount for your next order to help you find something new.\n\nUse code NEW10 at checkout.\n\nSee you again soon!`,
      sms: `Enjoyed your recent order? Get 10% off your next one with code NEW10!`,
      offerCode: 'NEW10',
      discount: '10%',
    },
  };

  const content = templates[segmentId] || templates['high-value'];
  return {
    ...content,
    reasoning: `Targeting "${segmentName}" with a ${content.discount} offer aligns with the goal of "${objective}" by incentivizing repeat behavior tailored to this audience's historical patterns.`,
  };
}

export function projectSimulationMetrics(audienceSize: number, avgOrderValue: number) {
  // Mathematically consistent simulation based on audience size
  const deliveryRate = 0.985;
  const openRate = 0.35 + Math.random() * 0.1; // 35-45%
  const clickRate = 0.12 + Math.random() * 0.05; // 12-17%
  const conversionRate = 0.05 + Math.random() * 0.03; // 5-8%

  const sent = audienceSize;
  const delivered = Math.round(sent * deliveryRate);
  const opened = Math.round(delivered * openRate);
  const clicked = Math.round(opened * clickRate);
  const conversions = Math.round(clicked * conversionRate);
  const revenue = Math.round(conversions * avgOrderValue * 1.05); // Assume slight AOV increase from offer

  return { sent, delivered, opened, clicked, conversions, revenue };
}

export function getNextRecommendation(
  currentSegmentId: SegmentId,
  segments: Pick<CustomerSegment, 'id' | 'name' | 'customerCount' | 'revenueContribution'>[]
): { title: string; description: string; segmentId: SegmentId } {
  const priority: SegmentId[] = ['at-risk', 'weekend-shoppers', 'recent-buyers', 'high-value'];
  const nextId = priority.find((id) => id !== currentSegmentId && segments.some((s) => s.id === id));

  if (!nextId) {
    return {
      title: 'Scale this campaign',
      description: 'Expand your targeting to adjacent segments to compound your revenue gains.',
      segmentId: currentSegmentId,
    };
  }

  const next = segments.find((s) => s.id === nextId)!;
  return {
    title: `Target ${next.name}`,
    description: `This segment represents $${next.revenueContribution.toLocaleString()} in historical revenue. Focus on this group next to drive further growth.`,
    segmentId: nextId,
  };
}
