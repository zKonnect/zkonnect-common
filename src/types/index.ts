import type { PropsWithChildren } from "react";

import { PublicKey } from "@solana/web3.js";

export interface ExtraTWClassProps {
  className?: string;
}

export type ComponentProps = PropsWithChildren<ExtraTWClassProps>;

export type CollectionDetails = {
  mint: PublicKey;
  metadata: PublicKey;
  masterEditionAccount?: PublicKey;
};

export type EventData = {
  id: string;
  roomId: string;
  eventName: string;
  eventDesc: string;
  eventBanner: string;
  eventDate: Date;
  totalTickets: number;
  ticketPrice: number;
  nativeToken: string;
  meetLink: string;
  blink: string;
  hostWalletAddress: string;
  collectionAddress: string | null;
  creatorId: string;
  ticketsSold: number | null;
  duration: number;
};
