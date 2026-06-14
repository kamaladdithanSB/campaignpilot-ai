import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { metrics: true }
  });

  return NextResponse.json(campaign);
}
