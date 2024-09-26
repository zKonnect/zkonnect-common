import { NextRequest } from "next/server";

import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  ValidDepthSizePair,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";

import {
  generateSigner,
  publicKey,
  keypairIdentity,
} from "@metaplex-foundation/umi";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
  "confirmed",
);

const depthBufferSizeChart: ValidDepthSizePair[] = [
  { maxDepth: 3, maxBufferSize: 8 },
  { maxDepth: 5, maxBufferSize: 8 },
  { maxDepth: 14, maxBufferSize: 64 },
  { maxDepth: 14, maxBufferSize: 256 },
  { maxDepth: 14, maxBufferSize: 1024 },
  { maxDepth: 14, maxBufferSize: 2048 },
  { maxDepth: 15, maxBufferSize: 64 },
  { maxDepth: 16, maxBufferSize: 64 },
  { maxDepth: 17, maxBufferSize: 64 },
  { maxDepth: 18, maxBufferSize: 64 },
  { maxDepth: 19, maxBufferSize: 64 },
  { maxDepth: 20, maxBufferSize: 64 },
  { maxDepth: 20, maxBufferSize: 256 },
  { maxDepth: 20, maxBufferSize: 1024 },
  { maxDepth: 20, maxBufferSize: 2048 },
  { maxDepth: 24, maxBufferSize: 64 },
  { maxDepth: 24, maxBufferSize: 256 },
  { maxDepth: 24, maxBufferSize: 512 },
  { maxDepth: 24, maxBufferSize: 1024 },
  { maxDepth: 24, maxBufferSize: 2048 },
  { maxDepth: 26, maxBufferSize: 512 },
  { maxDepth: 26, maxBufferSize: 1024 },
  { maxDepth: 26, maxBufferSize: 2048 },
  { maxDepth: 30, maxBufferSize: 512 },
  { maxDepth: 30, maxBufferSize: 1024 },
  { maxDepth: 30, maxBufferSize: 2048 },
];

function getMaxDepthAndBufferSize(totalTickets: number): ValidDepthSizePair {
  for (const entry of depthBufferSizeChart) {
    if (totalTickets <= 2 ** entry.maxDepth) {
      return entry;
    }
  }
  throw new Error(
    "Total number of tickets exceeds the maximum supported value.",
  );
}

async function createMerkleTree(totalNFTs: number) {
  const { maxDepth, maxBufferSize } = getMaxDepthAndBufferSize(totalNFTs);
  const maxDepthSizePair: ValidDepthSizePair = {
    maxDepth: maxDepth,
    maxBufferSize: maxBufferSize,
  } as ValidDepthSizePair;
  const secret = JSON.parse(process.env.NFT_SIGNER_PVT_KEY ?? "") as number[];
  const myPrivateKey = Uint8Array.from(secret);
  const umi = createUmi(connection);
  umi.use(keypairIdentity(umi.eddsa.createKeypairFromSecretKey(myPrivateKey)));
  const merkleTree = generateSigner(umi);

  const createTreeIx = createTree(umi, {
    merkleTree,
    maxDepth: maxDepthSizePair.maxDepth,
    maxBufferSize: maxDepthSizePair.maxBufferSize,
    public: false,
    canopyDepth: 0,
    compressionProgram: publicKey(SPL_ACCOUNT_COMPRESSION_PROGRAM_ID),
    logWrapper: publicKey(SPL_NOOP_PROGRAM_ID),
  });
  (await createTreeIx).sendAndConfirm(umi);

  return merkleTree.publicKey;
}

export const POST = async (req: NextRequest) => {
  const { totalNFTs } = await req.json();
  if (!totalNFTs) {
    return new Response("Invalid parameters", {
      status: 400,
    });
  }

  const merkleTreeAddr = await createMerkleTree(Number(totalNFTs));

  return new Response(JSON.stringify({ merkleTreeAddr }), {
    status: 200,
  });
};
