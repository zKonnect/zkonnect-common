"use client";

import { useMemo } from "react";

import { toast } from "sonner";
import { AnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { BN, Program } from "@coral-xyz/anchor";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import {
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

import idl from "@/lib/solana/idl.json";
import { Zkonnect } from "@/types/anchor_zkonnect";
import useAnchorProvider from "./useAnchorProvider";

export const useZkonnect = () => {
  const wallet = useWallet();
  const anchorProvider = useAnchorProvider();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
    "confirmed",
  );

  const anchorWallet = wallet as AnchorWallet;
  const umi = createUmi(connection).use(mplBubblegum());
  umi.use(walletAdapterIdentity(wallet));

  const program = useMemo(() => {
    if (anchorWallet) {
      return new Program<Zkonnect>(idl as Zkonnect, anchorProvider);
    }
  }, [anchorWallet, anchorProvider]);

  const isToken2022 = async (mint: PublicKey) => {
    const mintInfo = await anchorProvider.connection.getAccountInfo(mint);
    return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
  };

  const getMintInfo = async (mint: PublicKey) => {
    const tokenProgram = (await isToken2022(mint))
      ? TOKEN_2022_PROGRAM_ID
      : TOKEN_PROGRAM_ID;

    return getMint(anchorProvider.connection, mint, undefined, tokenProgram);
  };

  const createTheEvent = async ({
    eventName,
    eventDescription,
    creatorName,
    creatorDomain,
    bannerUrl,
    dateTime,
    location,
    nftUri,
    ticketPrice,
    totalTickets,
    tokenType,
    collectionNft,
    merkleTreeAddr,
  }: {
    eventName: string;
    eventDescription: string;
    creatorName: string;
    creatorDomain: string;
    bannerUrl: string;
    dateTime: number;
    location: string;
    nftUri: string;
    ticketPrice: number;
    totalTickets: number;
    tokenType: string;
    collectionNft: string;
    merkleTreeAddr: PublicKey;
  }) => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    if (!wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    const usdcMintAddr = new PublicKey(
      "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    );
    const tokenProgram = (await isToken2022(usdcMintAddr))
      ? TOKEN_2022_PROGRAM_ID
      : TOKEN_PROGRAM_ID;

    const mintInfo = await getMintInfo(new PublicKey(usdcMintAddr));
    const mintAmount = new BN(ticketPrice).mul(
      new BN(10).pow(new BN(mintInfo.decimals)),
    );

    try {
      return program.methods
        .createEvent(
          eventName,
          creatorName,
          creatorDomain,
          eventDescription,
          bannerUrl,
          new BN(dateTime),
          location,
          nftUri,
          mintAmount,
          new BN(totalTickets),
          tokenType === "USDC" ? new BN(1) : new BN(0),
        )
        .accounts({
          creator: wallet.publicKey,
          collectionNft: new PublicKey(collectionNft),
          mint: usdcMintAddr,
          tokenProgram: tokenProgram,
          merkleTree: merkleTreeAddr,
        })
        .rpc();
    } catch (e) {
      toast.error("Error creating event");
      console.error(e);
    }
  };

  const payforTicket = async (eventName: string) => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    if (!wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    const [profilePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("zkonnect"),
        wallet.publicKey.toBuffer(),
        Buffer.from(utf8.encode(eventName)),
      ],
      program.programId,
    );

    const data = await getCreatorInfo(profilePda);

    const isSOL = data.paySol;

    try {
      if (!isSOL) {
        return program.methods
          .paySolForTicket()
          .accountsPartial({
            to: data.creator,
            from: wallet.publicKey,
            event: profilePda,
          })
          .rpc();
      } else {
        const tokenProgram = (await isToken2022(data.mint))
          ? TOKEN_2022_PROGRAM_ID
          : TOKEN_PROGRAM_ID;

        return program.methods
          .payForTicket()
          .accountsPartial({
            to: data.creator,
            from: wallet.publicKey,
            event: profilePda,
            tokenProgram,
            fromAta: getAssociatedTokenAddressSync(
              data.mint,
              wallet.publicKey,
              false,
              tokenProgram,
            ),
            toAta: getAssociatedTokenAddressSync(
              data.mint,
              data.creator,
              false,
              tokenProgram,
            ),
            mint: data.mint,
          })
          .rpc();
      }
    } catch (e) {
      toast.error("Error paying for ticket");
      console.error(e);
    }
  };

  const closeAccount = async (eventName: string) => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    if (!wallet.publicKey) {
      toast.error("Wallet not connected");
      return;
    }

    const [profilePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("zkonnect"),
        wallet.publicKey.toBuffer(),
        Buffer.from(utf8.encode(eventName)),
      ],
      program.programId,
    );

    try {
      return program.methods
        .closeAccount()
        .accounts({
          account: profilePda,
          receiver: wallet.publicKey,
        })
        .rpc();
    } catch (e) {
      toast.error("Error closing account");
      console.error(e);
    }
  };

  const getCreatorInfo = async (eventId: PublicKey) => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    return program.account.event.fetch(eventId);
  };

  const getAllCreatorAccounts = async () => {
    if (!program) {
      throw new Error("Program not initialized");
    }
    const creatorAccounts = await program.account.event.all();

    return creatorAccounts;
  };

  return {
    program,
    createTheEvent,
    payforTicket,
    closeAccount,
    getCreatorInfo,
    getAllCreatorAccounts,
  };
};
