import { NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function GET() {

  console.log("Hello i am log");

  return NextResponse.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
