# zKonnect

![Profile banner - 2](https://github.com/user-attachments/assets/ede5036f-8d4c-4c2e-9213-422ef922433b)


zKonnect is a dApp that helps creators for creating token-gated events online where their fans can buy tickets directly from their favorite social for eg X and get cNFT of that event minted on demand onto their wallet address.
This cNFT will be used for token-gating of the event that the creator is hosting and the online event is happening in our platform itself using dRTC with **Huddle01**.
It uses **Huddle01SDK** for token-gated rooms and **Reclaim Protocol** to get a zk-proof of the number of followers of a creator.

zKonnect comes as an all around package for a creator, ie, from ticketing to hosting online events.

## Features

- **Decentralized Event Hosting**: Create and manage events on the Solana blockchain.
- **Seamless Payments**: Utilize Solana's fast and low-cost transactions for ticket purchases.
- **Blinks**: Use Blinks to share the event on your favorite social for your fans to buy tickets.
- **cNFT Ticketing**: Provide attendees with unique NFTs as event tickets and memorabilia.
- **Multi-token Payment**: Currently we give options for creators to accept payments in Sol, USDC, and are willing to expand more.
- **Audience Engagement**: Interactive features to enhance the event experience for attendees.

## Airdrop yourself some USDC to try out

Go to Circle USDC faucet and select solana Devnet:
[Circle USDC faucet](https://faucet.circle.com/)

Mint address of USDC: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`

## Working Architecture
![working arch](https://github.com/user-attachments/assets/2ade728b-71ba-4a0c-99f9-e4d7745bb9b1)

## Technology Stack

- NextJS
- Solana Web3.js
- Reclaim Protocol
- Huddle01SDK
- Metaplex (DasAPI, mpl-bubblegum for cNFT)
- Anchor (for smart contract)
- NextAuth
- Prisma (postgres)


## Blinks Working:
![blink_working](https://github.com/user-attachments/assets/014a91e2-27d4-4ea6-9b79-1d9c1eca6df8)
We are verified on Blinks registry as well. </br>
Here's a Link to test it out: [Blink](https://x.com/itami_69/status/1843288087696462203)

## Figma
[Figma Link](https://www.figma.com/design/pPGLD4TiGBRdhMnILmF93e/zKonnect?node-id=0-1&t=CQLEuhct2tgLXtlh-1)

## Pitch Deck & Twitter
[YouTube](https://www.youtube.com/watch?v=Ci5KtnAmR2k) </br>
[Twitter](https://x.com/zkonnect_social)

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
