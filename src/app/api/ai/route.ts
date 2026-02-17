import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    received: true,
    input: body,
    note: "AI processing will be wired in V2",
  });
}
