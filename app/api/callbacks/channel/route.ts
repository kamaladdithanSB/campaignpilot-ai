import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { campaignId, event, channel, timestamp, conversionValue, batchCount } = await req.json();

    if (event === 'COMPLETED') {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'COMPLETED' },
      });
      return NextResponse.json({ success: true });
    }

    const count = batchCount || 1;
    const revenueIncrement = event === 'CONVERSION' ? (conversionValue ?? 45) * count : 0;

    await prisma.$transaction([
      prisma.deliveryLog.create({
        data: {
          campaignId,
          status: event,
          channel: channel || 'EMAIL',
          timestamp: new Date(timestamp),
        },
      }),
      prisma.campaignMetrics.update({
        where: { campaignId },
        data: {
          delivered: { increment: event === 'DELIVERED' ? count : 0 },
          opened: { increment: event === 'OPENED' ? count : 0 },
          clicked: { increment: event === 'CLICKED' ? count : 0 },
          conversions: { increment: event === 'CONVERSION' ? count : 0 },
          revenue: { increment: revenueIncrement },
        },
      }),
      prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'EXECUTING' },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
