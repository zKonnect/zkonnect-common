"use server";

import { db } from "@/lib/prisma";

export async function getCreatorData(walletAddress: string) {
  const data = await db.creator.findFirst({
    where: {
      walletAddress,
    },
    include: {
      Events: true,
    },
  });

  return data;
}
