"use server";

import { db } from "@/lib/prisma";

export async function getEventCollectionAddress(roomId: string) {
  const data = await db.events.findFirst({
    where: {
      roomId,
    },
  });

  return {
    collectionAddress: data?.collectionAddress,
  };
}
