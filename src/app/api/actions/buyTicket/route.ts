import { NextRequest } from "next/server";

import {
  ActionPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
  ActionError,
  createPostResponse,
} from "@solana/actions";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Program, web3 } from "@coral-xyz/anchor";

import { Zkonnect } from "@/types/anchor_zkonnect";
import idl from "@/lib/solana/idl.json";

const isToken2022 = async (mint: PublicKey) => {
  const mintInfo = await connection.getAccountInfo(mint);
  return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
};
const getMintInfo = async (mint: PublicKey) => {
  const tokenProgram = (await isToken2022(mint))
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;

  return getMint(connection, mint, undefined, tokenProgram);
};

const connection = new web3.Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC! || clusterApiUrl("devnet"),
);

const program = new Program<Zkonnect>(idl as Zkonnect, {
  connection,
});

const headers = createActionHeaders();

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const eventName = searchParams.get("eventName");
  const address = searchParams.get("address");

  if (!eventName) {
    return new Response("Invalid eventId", {
      status: 400,
      headers: headers,
    });
  }

  const [profilePda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("zkonnect"),
      new PublicKey(address!).toBuffer(),
      Buffer.from(utf8.encode(eventName)),
    ],
    program.programId,
  );

  const eventAccount = await program.account.event.fetch(profilePda);

  if (!eventAccount) {
    return new Response("Event not found", {
      status: 404,
      headers: headers,
    });
  } else {
    try {
      let actualPrice;

      if (eventAccount.paySol === 1) {
        const usdcMintAddr = new PublicKey(
          "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        );
        const mintInfo = await getMintInfo(usdcMintAddr);

        // Convert the BN ticket price to its actual value
        actualPrice =
          eventAccount.ticketPrice.toNumber() / Math.pow(10, mintInfo.decimals);
      } else {
        actualPrice = eventAccount.ticketPrice;
      }

      const payload: ActionGetResponse = {
        title: eventAccount.eventName,
        icon: eventAccount.banner,
        description: eventAccount.eventDescription,
        label: "Get Your Ticket", // this value will be ignored since `links.actions` exists
        links: {
          actions: [
            {
              label: `Buy ticket with ${actualPrice} ${eventAccount.paySol === 0 ? "SOL" : "USDC"}`,
              href: `/api/actions/buyTicket?eventAccountPda=${profilePda.toString()}`,
            },
          ],
        },
      };

      return Response.json(payload, {
        headers: headers,
      });
    } catch (err) {
      console.log(err);
      let message = "An unknown error occurred";
      if (typeof err == "string") message = err;
      return new Response(message, {
        status: 400,
        headers: headers,
      });
    }
  }
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const eventAccountPda = searchParams.get("eventAccountPda");

  try {
    const body: ActionPostRequest = await req.json();
    const { account } = body;
    const authority = new web3.PublicKey(account);
    const eventAccount = await program.account.event.fetch(eventAccountPda!);
    const [profilePda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("zkonnect"),
        eventAccount.creator.toBuffer(),
        Buffer.from(utf8.encode(eventAccount.eventName)),
      ],
      program.programId,
    );

    let ix: web3.TransactionInstruction;

    try {
      if (eventAccount.paySol === 0) {
        ix = await program.methods
          .paySolForTicket()
          .accountsPartial({
            to: eventAccount.creator,
            from: authority,
            event: profilePda,
          })
          .instruction();
      } else {
        const tokenProgram = (await isToken2022(eventAccount.mint))
          ? TOKEN_2022_PROGRAM_ID
          : TOKEN_PROGRAM_ID;

        const fromAta = getAssociatedTokenAddressSync(
          eventAccount.mint,
          authority,
          false,
          tokenProgram,
        );

        const toAta = getAssociatedTokenAddressSync(
          eventAccount.mint,
          eventAccount.creator,
          false,
          tokenProgram,
        );

        ix = await program.methods
          .payForTicket()
          .accountsPartial({
            to: eventAccount.creator,
            from: authority,
            event: profilePda,
            tokenProgram,
            fromAta,
            toAta,
            mint: eventAccount.mint,
          })
          .instruction();
      }

      const blockhash = await connection.getLatestBlockhash({
        commitment: "max",
      });

      const messageV0 = new web3.TransactionMessage({
        payerKey: authority,
        recentBlockhash: blockhash.blockhash,
        instructions: [ix],
      }).compileToV0Message();
      const transaction = new web3.VersionedTransaction(messageV0);

      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: `Paid Successfully`,
          links: {
            next: {
              type: "post",
              href: `/api/actions/buyTicket/next-action?profilePda=${profilePda.toString()}`,
            },
          },
        },
      });

      return Response.json(payload, {
        headers,
      });
    } catch (err) {
      console.log(err);
      return new Response('Invalid "account" provided', {
        status: 400,
        headers,
      });
    }
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
