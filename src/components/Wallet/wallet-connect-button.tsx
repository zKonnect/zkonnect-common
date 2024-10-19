"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getCsrfToken,
  signIn,
  signOut,
  useSession,
  getSession,
} from "next-auth/react";
import { Wallet } from "lucide-react";
import bs58 from "bs58";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { SigninMessage } from "@/lib/SignInMessage";
import { shortenWalletAddress } from "@/lib/functions";
import { cn } from "@/lib/utils";

export default function WalletConnectButton({
  classnames,
  len,
}: {
  classnames?: string;
  len?: number;
}) {
  const {
    publicKey,
    connecting,
    connected,
    disconnect,
    signMessage,
    disconnecting,
    connect,
    wallet,
  } = useWallet();

  const { status, data: session, update } = useSession();

  const [isSigningIn, setIsSigningIn] = useState(false);

  const router = useRouter();

  const getClientSession = async () => {
    const session = await getSession();
    if (session?.token) {
      connect();
    }
  };

  useEffect(() => {
    getClientSession();
  }, []);

  const handleSignIn = async () => {
    if (isSigningIn || status === "loading" || session) return;
    setIsSigningIn(true);

    try {
      const csrfToken = await getCsrfToken();
      if (!publicKey || !csrfToken || !signMessage) {
        console.error("Wallet is not ready for signing");
        await disconnect();
        return;
      }

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey.toBase58(),
        statement:
          "Welcome to zKonnect! By signing, you're confirming ownership of the wallet you're connecting. This is a secure, gas-free process that ensures your identity without granting zKonnect any permission to perform transactions or access your funds. Your security and privacy are always our priority.",
        nonce: csrfToken,
        uri: "https://zkonnect.social/",
        version: "1",
        chainId: "devnet",
        issuedAt: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      });

      const encodedMessage = new TextEncoder().encode(message.prepare());
      const signature = await signMessage(encodedMessage);
      const serializedSignature = bs58.encode(signature);

      const result = await signIn("credentials", {
        message: JSON.stringify(message),
        signature: serializedSignature,
        redirect: false,
      });

      if (result?.error) {
        console.error("Sign-in failed:", result.error);
        await disconnect(); // Disconnect if sign-in fails
      } else {
        await update(); // Update session after successful sign-in
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      await disconnect(); // Disconnect if there's an error
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleWalletDisconnect = async () => {
    if (!connected && status === "authenticated") {
      await signOut({ redirect: false });
      router.push("/");
    }
  };

  useEffect(() => {
    if (connected && status === "unauthenticated" && !isSigningIn) {
      handleSignIn();
    }

    handleWalletDisconnect();
  }, [connected]);

  const getButtonText = (length?: number) => {
    if (status === "loading" || isSigningIn) return "Connecting...";
    if (!publicKey) return "Connect Wallet";

    if (length) {
      return shortenWalletAddress(publicKey.toString(), length);
    }

    return shortenWalletAddress(publicKey.toString());
  };

  return (
    <WalletMultiButton>
      <div
        className={cn(
          "flex flex-row items-center justify-normal space-x-4 text-xs lg:text-sm",
          classnames,
        )}
      >
        {!publicKey &&
          !connecting &&
          !connected &&
          !disconnecting &&
          !wallet && <Wallet className="size-6" />}
        <p className="w-full whitespace-nowrap text-center">
          {getButtonText(len)}
        </p>
      </div>
    </WalletMultiButton>
  );
}
