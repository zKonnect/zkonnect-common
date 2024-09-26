import { NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function verifyCreator(hostWallet: string) {
  const creator = await db.creator.findFirst({
    where: {
      walletAddress: hostWallet,
    },
  });

  if (!creator) {
    return NextResponse.json(
      {
        error: "Creator not found.",
      },
      { status: 404 },
    );
  }

  if (!creator.isVerified) {
    return NextResponse.json(
      {
        error: "Creator is not verified.",
      },
      { status: 403 },
    );
  }

  return creator;
}
