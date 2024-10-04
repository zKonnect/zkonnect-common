import { NextRequest, NextResponse } from "next/server";

import { API } from "@huddle01/server-sdk/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get("title");
  const hostWallet = searchParams.get("hostWallet");
  const dateTime = searchParams.get("dateTime");

  if (!title) {
    return NextResponse.json(
      {
        error: "Title is required",
      },
      { status: 400 },
    );
  }

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
        dateTime: dateTime,
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
