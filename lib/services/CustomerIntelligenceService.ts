import { prisma } from '../prisma';
import { analyzePrompt } from './StrategyEngine';

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  revenueContribution: number;
  revenuePercent: number;
  customerIds: string[];
}

export interface IntelligenceSummary {
  segments: CustomerSegment[];
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export class CustomerIntelligenceService {
  static async discoverSegments(): Promise<IntelligenceSummary> {
    const [totalCustomers, totalOrders, revenueAgg, customers, orders] = await Promise.all([
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { amount: true }, _avg: { amount: true } }),
      prisma.customer.findMany({ select: { id: true } }),
      prisma.order.findMany({
        select: { id: true, amount: true, customerId: true, orderDate: true, createdAt: true },
      }),
    ]);

    const totalRevenue = revenueAgg._sum.amount || 0;
    const averageOrderValue = revenueAgg._avg.amount || 0;

    if (totalCustomers === 0 || orders.length === 0) {
      return {
        segments: [],
        totalCustomers,
        totalOrders,
        totalRevenue,
        averageOrderValue,
      };
    }

    const now = Date.now();
    const customerStats = new Map<
      string,
      { totalSpend: number; orderCount: number; lastOrderDate: Date; weekendOrders: number }
    >();

    for (const customer of customers) {
      customerStats.set(customer.id, {
        totalSpend: 0,
        orderCount: 0,
        lastOrderDate: new Date(0),
        weekendOrders: 0,
      });
    }

    for (const order of orders) {
      const stats = customerStats.get(order.customerId);
      if (!stats) continue;

      const orderDate = order.orderDate || order.createdAt;
      stats.totalSpend += order.amount;
      stats.orderCount += 1;
      if (orderDate > stats.lastOrderDate) stats.lastOrderDate = orderDate;

      const day = orderDate.getDay();
      if (day === 0 || day === 6) stats.weekendOrders += 1;
    }

    const spendValues = [...customerStats.values()]
      .filter((s) => s.orderCount > 0)
      .map((s) => s.totalSpend)
      .sort((a, b) => a - b);

    const highValueThreshold =
      spendValues.length > 0
        ? spendValues[Math.floor(spendValues.length * 0.8)] || averageOrderValue * 1.5
        : averageOrderValue * 1.5;

    const highValueIds: string[] = [];
    const recentBuyerIds: string[] = [];
    const atRiskIds: string[] = [];
    const weekendShopperIds: string[] = [];

    for (const [customerId, stats] of customerStats) {
      if (stats.orderCount === 0) continue;

      if (stats.totalSpend >= highValueThreshold) {
        highValueIds.push(customerId);
      }

      const daysSinceLastOrder = (now - stats.lastOrderDate.getTime()) / MS_PER_DAY;
      if (daysSinceLastOrder <= 30) {
        recentBuyerIds.push(customerId);
      } else if (daysSinceLastOrder >= 60) {
        atRiskIds.push(customerId);
      }

      if (stats.weekendOrders / stats.orderCount >= 0.5) {
        weekendShopperIds.push(customerId);
      }
    }

    const buildSegment = (
      id: string,
      name: string,
      description: string,
      customerIds: string[]
    ): CustomerSegment => {
      const revenueContribution = customerIds.reduce((sum, cid) => {
        return sum + (customerStats.get(cid)?.totalSpend || 0);
      }, 0);

      return {
        id,
        name,
        description,
        customerCount: customerIds.length,
        revenueContribution,
        revenuePercent: totalRevenue > 0 ? (revenueContribution / totalRevenue) * 100 : 0,
        customerIds,
      };
    };

    const segments = [
      buildSegment(
        'high-value',
        'High Value Customers',
        'Top spenders who drive disproportionate revenue — ideal for loyalty and upsell campaigns.',
        highValueIds
      ),
      buildSegment(
        'recent-buyers',
        'Recent Buyers',
        'Customers who purchased in the last 30 days — warm audience ready for cross-sell.',
        recentBuyerIds
      ),
      buildSegment(
        'at-risk',
        'At-Risk Customers',
        'Previously active customers with no purchase in 60+ days — win-back opportunity.',
        atRiskIds
      ),
      buildSegment(
        'weekend-shoppers',
        'Weekend Shoppers',
        'Customers who prefer weekend purchases — perfect for Friday/Saturday promotions.',
        weekendShopperIds
      ),
    ].filter((s) => s.customerCount > 0);

    return {
      segments,
      totalCustomers,
      totalOrders,
      totalRevenue,
      averageOrderValue,
    };
  }

  static selectBestSegment(
    segments: CustomerSegment[],
    prompt: string
  ): CustomerSegment | null {
    if (segments.length === 0) return null;
    // Default to the first segment (usually high-value by revenue sorting in agents)
    // The actual selection is now handled by AI in the agents.
    return segments[0];
  }
}
