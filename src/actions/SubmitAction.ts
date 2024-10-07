"use server";

import { z } from "zod";

import { db } from "@/lib/prisma";
import type { creatorSignupFormSchema } from "@/lib/validation";

export async function createCreatorAction(
  values: z.infer<typeof creatorSignupFormSchema> & { walletAddress: string },
) {
  await db.creator.create({
    data: {
      walletAddress: values.walletAddress,
      creatorName: values.creatorName,
      domainOfExpertise: values.domainOfEvent,
      eventsInaYear: values.expectedNumberOfEvents,
    },
  });
  return;
}

export async function updateCreatorFollowers(
  walletAddress: string,
  noOfFollowers: number,
  isVerified: boolean,
) {
  await db.creator.update({
    where: {
      walletAddress,
    },
    data: {
      noOfFollowers,
      isVerified,
    },
  });
  return;
}

export async function getCreatorDataAction(walletAddress: string) {
  const data = await db.creator.findFirst({
    where: {
      walletAddress,
    },
  });

  return {
    creatorName: data?.creatorName,
    creatorDomain: data?.domainOfExpertise,
    isVerified: data?.isVerified,
    creatorId: data?.id,
  };
}

export async function createEventAction(values: any) {
  await db.events.create({
    data: {
      eventName: values.eventName,
      eventDesc: values.eventDescription,
      eventBanner: values.eventBanner,
      eventDate: values.eventDate,
      blink: values.blink,
      meetLink: values.meetLink,
      creatorId: values.creatorId,
      nativeToken: values.nativeToken,
      ticketPrice: values.ticketPrice,
      totalTickets: values.totalTickets,
      collectionAddress: values.collectionAddress,
      roomId: values.roomId,
      hostWalletAddress: values.hostWalletAddress,
      duration: values.duration,
      ticketsSold: 0,
    },
  });
}
