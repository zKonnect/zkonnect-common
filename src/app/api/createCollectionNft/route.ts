import { NextRequest, NextResponse } from "next/server";

import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";

const secret = JSON.parse(process.env.NFT_SIGNER_PVT_KEY ?? "") as number[];
const myPrivateKey = Uint8Array.from(secret);

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
  "confirmed",
);

async function getOrCreateCollectionNFT(
  metaplex: Metaplex,
  eventName: string,
  creatorAddr: string,
  nftUri: string,
) {
  const collectionNft = await metaplex.nfts().create({
    uri: nftUri,
    name: eventName,
    sellerFeeBasisPoints: 0,
    updateAuthority: Keypair.fromSecretKey(myPrivateKey),
    mintAuthority: Keypair.fromSecretKey(myPrivateKey),
    tokenStandard: 0,
    symbol: "",
    isMutable: true,
    isCollection: true,
    creators: [
      {
        address: new PublicKey(creatorAddr),
        share: 100,
      },
    ],
  });

  return {
    mint: collectionNft.mintAddress,
    metadata: collectionNft.metadataAddress,
  };
}

const metaplex = new Metaplex(connection);
metaplex.use(keypairIdentity(Keypair.fromSecretKey(myPrivateKey)));

export const POST = async (req: NextRequest) => {
  const { eventName, creatorAddress, nftUri } = await req.json();

  try {
    const { metadata, mint } = await getOrCreateCollectionNFT(
      metaplex,
      eventName,
      creatorAddress,
      nftUri,
    );
    return NextResponse.json(
      {
        metaData: metadata.toString(),
        mint: mint.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating collection", error);
    return NextResponse.json(
      { error: "Error creating collection" },
      { status: 500 },
    );
  }
};
