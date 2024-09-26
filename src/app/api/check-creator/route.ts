import { NextRequest, NextResponse } from "next/server";

import { PublicKey } from "@solana/web3.js";

import { db } from "@/lib/prisma";
import { verifyCreator } from "@/lib/verifyCreator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hostWallet = searchParams.get("hostWallet");

  if (!hostWallet) {
    return NextResponse.json(
      { error: "Host wallet not provided" },
      { status: 400 },
    );
  }

  try {
    new PublicKey(hostWallet);
  } catch (e) {
    return NextResponse.json(
      {
        error: "Invalid host wallet address.",
      },
      { status: 400 },
    );
  }

  try {
    const creatorCheck = await verifyCreator(hostWallet);

    if (creatorCheck instanceof NextResponse) {
      return creatorCheck;
    }

    return NextResponse.json({ creatorId: creatorCheck.id }, { status: 200 });
  } catch (error) {
    console.error("Error checking creator:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await db.$disconnect();
  }
}
