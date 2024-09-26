import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/api/createRoom",
  "/api/ipfsUpload",
  "/api/createMerkleTree",
  "/api/createCollectionNft",
  "/api/getAccessToken",
];

export async function middleware(request: NextRequest) {
  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const hostWallet = request.nextUrl.searchParams.get("hostWallet");

    if (!hostWallet) {
      return NextResponse.json(
        { error: "Wallet address not provided." },
        { status: 400 },
      );
    }

    const checkCreatorUrl = new URL("/api/check-creator", request.url);
    checkCreatorUrl.searchParams.set("hostWallet", hostWallet);

    const creatorCheckResponse = await fetch(checkCreatorUrl.toString());

    if (!creatorCheckResponse.ok) {
      const errorData = await creatorCheckResponse.json();
      return NextResponse.json(
        { error: errorData.error },
        { status: creatorCheckResponse.status },
      );
    }

    const creatorData = await creatorCheckResponse.json();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-creator-id", creatorData.creatorId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/createRoom",
    "/api/ipfsUpload",
    "/api/createMerkleTree",
    "/api/createCollectionNft",
    "/api/getAccessToken",
  ],
};
