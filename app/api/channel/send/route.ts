import { NextResponse } from 'next/server';
import { ChannelService } from '@/lib/services/ChannelService';

export async function POST(req: Request) {
  try {
    const { campaignId, customerIds, callbackUrl } = await req.json();
    
    if (!campaignId || !customerIds || !callbackUrl) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const result = await ChannelService.processCampaign(campaignId, customerIds, callbackUrl);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Channel send error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
