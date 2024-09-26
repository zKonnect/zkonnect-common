# zKonnect

zKonnect is a dApp that helps creators for creating token-gated events online where their fans can buy tickets directly from their favourite social for eg X and get cNFT of that event minted on demand onto their wallet address.
This cNFT will be used for token-gating of the event that the creator is hosting and the online event is happening in our platform itself using dRTC with **Huddle01**.
It uses **Huddle01SDK** for token-gated rooms and **Reclaim Protocol** to get a zk-proof of the number of followers of a creator.

zKonnect comes as an all around package for a creator, ie, from ticketing to hosting online events.

## Features

- **Decentralized Event Hosting**: Create and manage events on the Solana blockchain.
- **Seamless Payments**: Utilize Solana's fast and low-cost transactions for ticket purchases.
- **Blinks**: Use Blinks to share the event on your favourite social for your fans to buy tickets.
- **cNFT Ticketing**: Provide attendees with unique NFTs as event tickets and memorabilia.
- **Multi-token Payment**: Currently we give options for creators to accept payments in Sol, USDC, and are willing to expand more.
- **Creator Tools**: Comprehensive tools for event creation, management, and analytics.
- **Audience Engagement**: Interactive features to enhance the event experience for attendees.

## Working Architecture

## Technology Stack

- NextJS
- Solana Web3.js
- Reclaim Protocol
- Huddle01SDK
- Metaplex
- Anchor (for smart contract)
- NextAuth
- Prisma (postgres)

## Figma

- [Figma Link](https://www.figma.com/proto/pPGLD4TiGBRdhMnILmF93e/zKonnect?node-id=1-629&t=Nbt3tm2QqEiG1WmA-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1)

## Blink Working proof:

## Installation

1. Clone the repository
2. Run the command `npm i`.
3. copy the env variables from .env.example and paste into .env
4. Go to [Huddle](https://docs.huddle01.com/docs/api-keys) and get you API_KEY and Project Id and paste under NEXT_PUBLIC_PROJECT_ID AND API_KEY.
5. Go to [Reclaim](https://dev.reclaimprotocol.org/) and create your app by select the Linkedin Dashboard Analytics provider and paste the keys under RECLAIM_APP_ID and RECLAIM_SECRET_KEY respectively.
6. Put NEXT_PUBLIC_ENVIRONMENT value as localhost.
7. Get the DATABASE_URL by creating a db from NeonDB.
8. Get your Pinata_JWT from Pinata Cloud.
9. Get a account whole private key can be used for NFT creating and put it under NFT_SIGNER_PVT_KEY, make sure it has enough SOL.
10. Grab your NEXT_PUBLIC_SOLANA_RPC url from your choice of RPC provider and put the value, or the default solana rpc will be used (I'll suggest get one from [Heilus](https://www.helius.dev/)).
11. Run the command `npx auth secret` to get AUTH_SECRET and paste the base url under NEXTAUTH_URL (in development this should be the locahost).
