import { NextRequest } from "next/server";

import {
  keypairIdentity,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import {
  mintToCollectionV1,
  MPL_BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";

import { PublicKey as UmiPublicKey, Umi } from "@metaplex-foundation/umi";

const secret = JSON.parse(process.env.NFT_SIGNER_PVT_KEY ?? "") as number[];
const myPrivateKey = Uint8Array.from(secret);

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
  "confirmed",
);

function mintToCollection(
  umi: Umi,
  creator: UmiPublicKey,
  eventName: string,
  userAddr: UmiPublicKey,
  merkleTree: UmiPublicKey,
  collectionMint: UmiPublicKey,
  nftUri: string,
) {
  const mintTx = mintToCollectionV1(umi, {
    leafOwner: userAddr,
    merkleTree: merkleTree,
    leafDelegate: publicKey(PublicKey.default),
    collectionAuthority: umi.payer,
    collectionAuthorityRecordPda: MPL_BUBBLEGUM_PROGRAM_ID,
    collectionMint: collectionMint,
    compressionProgram: publicKey(SPL_ACCOUNT_COMPRESSION_PROGRAM_ID),
    logWrapper: publicKey(SPL_NOOP_PROGRAM_ID),
    treeCreatorOrDelegate: umi.payer,
    tokenMetadataProgram: publicKey(MPL_TOKEN_METADATA_PROGRAM_ID),
    metadata: {
      name: eventName,
      symbol: "",
      uri: nftUri,
      sellerFeeBasisPoints: 500,
      collection: {
        key: publicKey(collectionMint),
        verified: false,
      },
      creators: [
        {
          address: creator,
          verified: false,
          share: 100,
        },
      ],
    },
  });

  return mintTx;
}

const umi = createUmi(connection);
umi.use(keypairIdentity(umi.eddsa.createKeypairFromSecretKey(myPrivateKey)));

export const POST = async (req: NextRequest) => {
  const {
    creatorAddress,
    merkleTreeAddr,
    collectionNFTAddr,
    toUserAddr,
    eventName,
    nftUri,
  } = await req.json();

  if (
    !creatorAddress ||
    !merkleTreeAddr ||
    !collectionNFTAddr ||
    !toUserAddr ||
    !eventName ||
    !nftUri
  ) {
    return new Response("Invalid parameters", {
      status: 400,
    });
  }
  if (
    !publicKey(creatorAddress) ||
    !publicKey(merkleTreeAddr) ||
    !publicKey(collectionNFTAddr) ||
    !publicKey(toUserAddr)
  ) {
    return new Response("Invalid keys", {
      status: 400,
    });
  }

  const merkleTree = {
    publicKey: publicKey(merkleTreeAddr!),
  };

  const mintInstructions = [];
  mintInstructions.push(
    mintToCollection(
      umi,
      publicKey(creatorAddress!),
      eventName,
      publicKey(toUserAddr!),
      merkleTree.publicKey,
      publicKey(collectionNFTAddr!),
      nftUri,
    ),
  );

  try {
    await transactionBuilder().add(mintInstructions).sendAndConfirm(umi);

    return new Response("Success", {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response("Error", {
      status: 400,
    });
  }
};
