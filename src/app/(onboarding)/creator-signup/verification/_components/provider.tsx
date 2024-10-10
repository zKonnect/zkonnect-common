"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import {
  BadgeInfo,
  Check,
  CircleCheck,
  MoveRight,
  Plus,
  X,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

import fetchVerificationData from "@/lib/reclaim/reclaim";
import { Button } from "@/components/ui/button";
import { updateCreatorFollowers } from "@/actions";
import { QRDialog } from "./QRDialog";

type Verified = {
  states: "verified" | "unverified" | "ineligible";
};

type ResponseData = {
  verified: boolean;
  followers: string;
  requestUrl: string;
};

const ProvidersComponent = () => {
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  const [requestUrl, setRequestUrl] = useState<string>();
  const [verfied, setVerified] = useState<Verified>({ states: "unverified" });
  const [providerImageUrl, setProviderImageUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const handleVerification = async ({
    socialType,
    imageUrl,
  }: {
    socialType: string;
    imageUrl: string;
  }) => {
    if (!publicKey || !connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!isOpen) {
      setIsOpen(true);
      setProviderImageUrl(imageUrl);
      await fetchVerificationData(
        setRequestUrl,
        socialType,
        (eventSourceInstance) => {
          setEventSource(eventSourceInstance);
        },
      )
        .then((data) => {
          const verifiedData = data as { verified: boolean };
          verifiedData.verified && setIsOpen(false);
          toast.success("Verification successful");
          const followers = data as ResponseData;
          if (parseInt(followers.followers.replace(/,/g, ""), 10) > 250) {
            setVerified({ states: "verified" });
            try {
              let promise: any;
              promise = new Promise<void>((resolve, reject) => {
                updateCreatorFollowers(
                  publicKey.toBase58(),
                  parseInt(followers.followers.replace(/,/g, ""), 10),
                  true,
                )
                  .then(() => {
                    resolve();
                    router.push("/creator-signup/get-started");
                  })
                  .catch((error) => {
                    reject(error);
                  });
              });

              toast.promise(promise, {
                loading: "Verifying...",
                success: "You are now successfully verified",
                error: "Error creating profile. Please try again.",
              });
            } catch (error) {
              console.error("Error creating profile", error);
            }
          } else {
            setVerified({ states: "ineligible" });
            toast.error(
              "You are not eligible as you do not have 250+ followers.",
            );
          }
        })
        .catch(() => {
          toast.error("Verification failed");
        });
    }
  };

  const closeDialog = () => {
    if (eventSource) {
      toast.info("Canceled verification request");
      eventSource.close();
      setEventSource(null);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div
        className="flex h-[75px] cursor-pointer items-center justify-between rounded-lg border px-3 py-3 outline-zkonnect-gray backdrop-blur-sm backdrop-filter sm:px-6"
        onClick={() =>
          handleVerification({
            socialType: "linkedin",
            imageUrl: "linkedin.svg",
          })
        }
      >
        <div className="flex items-center space-x-3 lg:space-x-7">
          <Image
            src={`/assets/provider/linkedin.svg`}
            alt="logo"
            className="size-10 lg:size-12"
            width={48}
            height={48}
          />
          <div className="leading-4 lg:leading-normal">
            <p className="text-sm font-semibold text-black dark:text-white">
              LinkedIn Followers
            </p>
            <span className="text-xs text-muted-foreground">
              Number of followers count for a user
            </span>
          </div>
        </div>
        {verfied.states === "unverified" ? (
          <Plus className="lg:ml-28" size={18} />
        ) : verfied.states === "verified" ? (
          <Check className="text-green-500 lg:ml-28" size={18} />
        ) : (
          <X className="text-red-500 lg:ml-28" size={18} />
        )}
        {isOpen && (
          <QRDialog
            requestUrl={requestUrl}
            isOpen={isOpen}
            providerImage={providerImageUrl}
            setIsOpen={closeDialog}
          />
        )}
      </div>
      {verfied.states === "ineligible" && (
        <p className="my-6 flex items-center justify-center space-x-2 text-xs text-destructive lg:my-8 lg:text-sm">
          <BadgeInfo size={18} />{" "}
          <span>You are not eligible as you do not have 250+ followers.</span>
        </p>
      )}
      {verfied.states === "verified" && (
        <div className="my-4 flex h-[60px] cursor-pointer items-center justify-between rounded-lg border bg-[#ECFEF2] px-3 py-3 sm:px-6">
          <div className="flex w-full items-center space-x-3 lg:space-x-7">
            <CircleCheck className="text-[#008A2E]" size={26} />

            <span className="w-full px-4 text-start text-xs text-[#008A2E] lg:text-sm">
              Your account has been verified.
            </span>
          </div>
        </div>
      )}
      <Button
        className="absolute bottom-0 right-0 w-full space-x-3 bg-black px-7 py-6 text-sm lg:w-[150px]"
        onClick={() => {
          router.push("/creator-signup/get-started");
        }}
        disabled={verfied.states === "verified" ? false : true}
      >
        <span>Continue</span>
        <MoveRight size={20} />
      </Button>
    </div>
  );
};

export default ProvidersComponent;
