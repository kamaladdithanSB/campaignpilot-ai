import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SnapshotService } from '@/lib/services/SnapshotService';

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    let customerIds: string[] = [];
    try {
      const strategy = JSON.parse(campaign.strategy);
      customerIds = strategy?.audience?.output?.customerIds || [];
    } catch {
      customerIds = [];
    }

    if (customerIds.length === 0) {
      const customers = await prisma.customer.findMany({ select: { id: true } });
      customerIds = customers.map((c) => c.id);
    }

    const snapshot = await SnapshotService.createSnapshot(customerIds);

    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: 'QUEUED',
        snapshotId: snapshot.id,
      },
    });

    await prisma.campaignMetrics.update({
      where: { campaignId },
      data: { sent: customerIds.length },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/callbacks/channel`;

    await fetch(`${baseUrl}/api/channel/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId,
        customerIds,
        callbackUrl,
        audienceSize: customerIds.length,
      }),
    });

    return NextResponse.json({
      success: true,
      status: 'QUEUED',
      audienceSize: customerIds.length,
    });
  } catch (error) {
    console.error('Launch error:', error);
    return NextResponse.json({ error: 'Failed to launch campaign' }, { status: 500 });
  }
}
