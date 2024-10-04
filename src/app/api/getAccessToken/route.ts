import { NextRequest, NextResponse } from "next/server";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import { API } from "@huddle01/server-sdk/api";
import { PublicKey, clusterApiUrl } from "@solana/web3.js";

import { JoinMeetMessage } from "@/lib/JoinMeetMessage";

type MetaData = {
  title: string;
  chain: string;
  tokenType: string;
  hostWalletAddress: string;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    roomId,
    address,
    displayName,
    expirationTime,
    signature,
    domain,
    collectionAddress,
  } = body;

  if (!roomId || !address) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  if (expirationTime < Date.now()) {
    return NextResponse.json({ error: "Signature expired" }, { status: 400 });
  }

  const api = new API({
    apiKey: process.env.API_KEY!,
  });

  const { metadata } = await api.getRoomDetails({
    roomId: roomId,
  });

  if (!metadata) {
    return NextResponse.json(
      { error: "Room is not token gated" },
      { status: 400 },
    );
  }

  const roomDetails = metadata as MetaData;

  const message = new JoinMeetMessage({
    domain,
    publicKey: address,
    expTime: new Date(expirationTime).toISOString(),
    statement: `Thanks for joining the meeting. Please sign in to verify your wallet.`,
  });

  const isVerified = await message.validate(signature);

  if (!isVerified) {
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }

  const umi = createUmi(
    process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
  ).use(mplBubblegum());
  umi.use(dasApi());
  const rpcAssetList = await umi.rpc.getAssetsByOwner({
    // @ts-expect-error: owner is not defined in the type
    owner: new PublicKey(address),
  });

  const exists = rpcAssetList.items.some((nft) =>
    nft.grouping.some((group) => {
      return group.group_value === collectionAddress.collectionAddress;
    }),
  );

  if (!exists) {
    return NextResponse.json(
      { error: "You don't own the required NFT." },
      { status: 400 },
    );
  }

  const isHost = address === roomDetails.hostWalletAddress;

  const accessToken = new AccessToken({
    apiKey: process.env.API_KEY!,
    roomId: roomId as string,
    role: isHost ? Role.HOST : Role.GUEST,
    permissions: {
      admin: isHost ? true : false,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: isHost ? true : false,
        screen: isHost ? true : false,
      },
      canRecvData: isHost ? true : false,
      canSendData: true,
      canUpdateMetadata: isHost ? true : false,
    },
    options: {
      metadata: {
        displayName: displayName,
        walletAddress: address,
      },
    },
  });

  const token = await accessToken.toJwt();

  return NextResponse.json({ token });
}
