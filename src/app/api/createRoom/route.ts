import { NextRequest, NextResponse } from "next/server";

import { API } from "@huddle01/server-sdk/api";
import { PublicKey } from "@solana/web3.js";

import { verifyCreator } from "@/lib/verifyCreator";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title");
  const hostWallet = searchParams.get("hostWallet");

  if (!title) {
    return NextResponse.json(
      {
        error: "Title is required",
      },
      { status: 400 },
    );
  }

  // if (!title || !hostWallet) {
  //   return NextResponse.json(
  //     {
  //       error: `${!hostWallet ? "Host Wallet address is required" : "title is required"}`,
  //     },
  //     { status: 400 },
  //   );
  // }

  // try {
  //   new PublicKey(hostWallet);
  // } catch (e) {
  //   return NextResponse.json(
  //     {
  //       error: "Invalid host wallet address.",
  //     },
  //     { status: 400 },
  //   );
  // }

  // const creatorCheck = await verifyCreator(hostWallet);

  // if (creatorCheck instanceof NextResponse) {
  //   return creatorCheck;
  // }

  const api = new API({
    apiKey: process.env.API_KEY!,
  });

  try {
    const createNewRoom = await api.createRoom({
      roomLocked: false,
      metadata: JSON.stringify({
        title: title,
        chain: "SOLANA",
        tokenType: "SPL",
        hostWalletAddress: `${hostWallet}`,
      }),
    });

    if (!createNewRoom) {
      return NextResponse.json(
        {
          error: "Failed to create room",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        roomId: createNewRoom.roomId,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
