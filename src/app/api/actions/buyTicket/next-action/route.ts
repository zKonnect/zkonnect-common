import { NextRequest } from "next/server";

import {
  createActionHeaders,
  NextActionPostRequest,
  ActionError,
  CompletedAction,
} from "@solana/actions";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Program, web3 } from "@coral-xyz/anchor";

import { Zkonnect } from "@/types/anchor_zkonnect";
import idl from "@/lib/solana/idl.json";

const connection = new web3.Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
);

const program = new Program<Zkonnect>(idl as Zkonnect, {
  connection,
});

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);

    const profilePda = url.searchParams.get("profilePda") as string;

    const body: NextActionPostRequest = await req.json();

    let account: PublicKey;
    let imageUrl: string = "";
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }

    let signature: string;
    try {
      signature = body.signature;
      if (!signature) throw "Invalid signature";
    } catch (err) {
      throw 'Invalid "signature" provided';
    }

    try {
      let status = await connection.getSignatureStatus(signature);

      if (!status) throw "Unknown signature status";

      // only accept `confirmed` and `finalized` transactions
      if (status.value?.confirmationStatus) {
        if (
          status.value.confirmationStatus != "confirmed" &&
          status.value.confirmationStatus != "finalized"
        ) {
          throw "Unable to confirm the transaction";
        }
      }
      try {
        await program.account.event
          .fetch(profilePda)
          .then(async (eventAccount) => {
            imageUrl = eventAccount.banner;
            await fetch(
              `${process.env.NEXT_PUBLIC_ENVIRONMENT === "localhost" ? "http://localhost:3000" : "https://zkonnect.social"}/api/getNFT`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  creatorAddress: eventAccount.creator.toString(),
                  merkleTreeAddr: eventAccount.merkleTree.toString(),
                  collectionNFTAddr: eventAccount.collectionNft.toString(),
                  toUserAddr: account,
                  eventName: eventAccount.eventName,
                  nftUri: eventAccount.nfturi,
                }),
              },
            );
          });
      } catch (error) {
        console.error("Error minting nft", error);
        throw "Error minting nft";
      }
    } catch (err) {
      if (typeof err == "string") throw err;
      throw "Unable to confirm the provided signature";
    }

    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    const payload: CompletedAction = {
      type: "completed",
      title: "Ticket Successfully Minted!",
      icon: imageUrl,
      label: "Ticket Minted!",
      description: `Your ticket has been successfully minted and is now available in your wallet.`,
    };

    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    let actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof err == "string") actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};
