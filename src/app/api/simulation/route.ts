import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    balance: 100000,
    holdings: [],
    note: "Simulation only",
  });
}
