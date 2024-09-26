import base58 from "bs58";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

import { JoinMeetMessage } from "@/lib/JoinMeetMessage";

export const handleSignIn = async (
  roomId: string,
  displayName: string,
  signIn: any,
  publicKey: any,
  collectionAddress: string,
) => {
  try {
    const time = {
      issuedAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 5,
    };

    const signInMessage = new JoinMeetMessage({
      domain: window.location.host,
      publicKey: publicKey.toBase58(),
      expTime: new Date(time.expiresAt).toISOString(),
      statement:
        "Thanks for joining the meeting. Please sign in to verify your wallet.",
    });

    const data = new TextEncoder().encode(signInMessage.prepare());

    const signature = await signIn(data);

    const serializedSignature = base58.encode(signature);

    const token = await axios.request({
      method: "POST",
      url: `/api/getAccessToken?hostWallet=${publicKey.toString()}`,
      data: {
        displayName,
        roomId,
        address: publicKey.toBase58(),
        expirationTime: time.expiresAt,
        domain: window.location.host,
        signature: serializedSignature,
        collectionAddress,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return token?.data?.token;
  } catch (error: any) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data?.error);
    }
  }
};
