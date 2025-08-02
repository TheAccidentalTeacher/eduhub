import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[HEALTH-CHECK] Health check endpoint called');
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    version: '1.0.0'
  };
  
  console.log('[HEALTH-CHECK] Health status:', health);
  
  return NextResponse.json(health);
}
