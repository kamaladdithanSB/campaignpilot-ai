import { prisma } from '../prisma';
import { projectSimulationMetrics } from './StrategyEngine';

const SIMULATION_MS = 10000;

export class ChannelService {
  static async processCampaign(
    campaignId: string,
    customerIds: string[],
    callbackUrl: string
  ) {
    this.simulateDelivery(campaignId, customerIds.length, callbackUrl);
    return { status: 'Accepted', jobId: campaignId };
  }

  private static async simulateDelivery(
    campaignId: string,
    audienceSize: number,
    callbackUrl: string
  ) {
    (async () => {
      const intelligence = await prisma.order.aggregate({ _avg: { amount: true } });
      const avgOrderValue = intelligence._avg.amount || 45;

      const metrics = projectSimulationMetrics(audienceSize, avgOrderValue);

      const phases: { delay: number; event: string; count: number; conversionValue?: number }[] = [
        { delay: 1500, event: 'DELIVERED', count: metrics.delivered },
        { delay: 3500, event: 'OPENED', count: metrics.opened },
        { delay: 6000, event: 'CLICKED', count: metrics.clicked },
        { delay: 8500, event: 'CONVERSION', count: metrics.conversions, conversionValue: avgOrderValue * 1.05 },
      ];

      const start = Date.now();

      for (const phase of phases) {
        const wait = phase.delay - (Date.now() - start);
        if (wait > 0) await sleep(wait);

        try {
          await fetch(callbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campaignId,
              event: phase.event,
              channel: 'EMAIL',
              timestamp: new Date().toISOString(),
              batchCount: phase.count,
              conversionValue: phase.conversionValue,
            }),
          });
        } catch {
          /* continue */
        }
      }

      const remaining = SIMULATION_MS - (Date.now() - start);
      if (remaining > 0) await sleep(remaining);

      try {
        await fetch(callbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId,
            event: 'COMPLETED',
            timestamp: new Date().toISOString(),
          }),
        });
      } catch {
        /* best effort */
      }
    })();
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

