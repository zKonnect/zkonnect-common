"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import {
  ArrowRight,
  Disc2,
  Dot,
  Inbox,
  Loader2,
  Mic,
  MicOff,
  MonitorUp,
  Video,
  VideoOff,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

import { cn } from "@/lib/utils";
import ChatBox from "./_components/ChatBox";
import { handleSignIn } from "@/components/SignIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEventCollectionAddress } from "@/actions";
import { toast } from "sonner";
import Image from "next/image";
import WalletConnectButton from "@/components/Wallet/wallet-connect-button";
import VideoGrid from "./_components/VideoGrid";

export default function Page() {
  const [displayName, setDisplayName] = useState<string>("");
  const [hasEnteredMeeting, setHasEnteredMeeting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const params = useParams();
  const wallet = useWallet();

  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [shareStream, setShareStream] = useState<MediaStream | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const handleEnterMeeting = () => {
    if (displayName.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setHasEnteredMeeting(true);
      }, 2000);
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (shareStream && screenRef.current) {
      screenRef.current.srcObject = shareStream;
    }
  }, [shareStream]);

  const toggleVideo = async () => {
    if (isVideoOn) {
      if (stream) {
        stream.getVideoTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setIsVideoOn(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(newStream);
        setIsVideoOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast.error("Failed to access camera");
      }
    }
  };

  const toggleAudio = async () => {
    if (isAudioOn) {
      if (stream) {
        stream.getAudioTracks().forEach((track) => track.stop());
        setStream(stream.clone());
      }
      setIsAudioOn(false);
    } else {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const newStream = stream
          ? new MediaStream([...stream.getTracks(), ...audioStream.getTracks()])
          : audioStream;
        setStream(newStream);
        setIsAudioOn(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        toast.error("Failed to access microphone");
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (shareStream) {
        shareStream.getTracks().forEach((track) => track.stop());
        setShareStream(null);
      }
      setIsScreenSharing(false);
    } else {
      try {
        const newShareStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setShareStream(newShareStream);
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Error sharing screen:", err);
        toast.error("Failed to start screen sharing");
      }
    }
  };

  const toggleChat = () => {
    setChatOpen((open) => !open);
  };

  const [participants, setParticipants] = useState<any>([]);

  useEffect(() => {
    setParticipants([
      { name: "User 1", stream: null },
      { name: "User 2", stream: null },
      { name: "User 3", stream: null },
      { name: "User 4", stream: null },
      { name: "User 5", stream: null },
      { name: "User 6", stream: null },
      { name: "User 7", stream: null },
      { name: "User 8", stream: null },
      { name: "User 9", stream: null },
      { name: "User 10", stream: null },
      { name: "User 11", stream: null },
      // { name: "User 12", stream: null },
      // { name: "User 13", stream: null },
      // { name: "User 14", stream: null },

      // Add more mock participants as needed
    ]);
  }, []);

  return (
    <section className="flex min-h-screen flex-col items-center px-6 pt-24 text-black 2xl:px-2">
      <div className="z-10 w-full max-w-[1600px] flex-col items-center justify-between text-sm">
        <div className="space-y-2 lg:space-y-2">
          <h1 className="text-2xl font-bold text-black lg:text-3xl">
            Event Title
          </h1>
          <p className="flex justify-between space-x-2 text-xs text-muted-foreground lg:space-x-0 lg:text-sm">
            <span>One Liner Description of the Event</span>
            <span>
              Created by <span className="font-bold text-black">User</span>
            </span>
          </p>
        </div>
        <div
          className={cn(
            "mt-2 rounded-2xl bg-zkonnect-white-origin p-6",
            hasEnteredMeeting ? "h-fit" : "h-[70vh]",
          )}
        >
          {!hasEnteredMeeting ? (
            /* Initial connecting page */
            <div className="flex size-full flex-col items-center justify-center space-y-3 lg:space-y-6">
              <Image
                src="./assets/brand-icons/logo.svg"
                alt="zkonnect logo"
                height={50}
                width={50}
                className="size-14 lg:size-20"
              />
              <h1 className="text-xl font-bold lg:text-3xl">
                Create. Connect. Buzz
              </h1>
              <p className="text-xs text-muted-foreground lg:text-base">
                join in to participate and engage
              </p>
              <WalletConnectButton
                classnames="w-[120px] lg:w-[172px]"
                len={8}
              />
              {wallet.publicKey && (
                <div className="relative w-[200px] lg:w-[250px]">
                  <Input
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pr-10 focus-visible:ring-[1.5px]"
                  />
                  {displayName && (
                    <Button
                      size="icon"
                      className="absolute right-1 top-1/2 size-6 -translate-y-1/2 bg-white hover:bg-white"
                      onClick={handleEnterMeeting}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-black" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-black" />
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Meeting interface */
            <>
              {/* <div className="space-y-4">
                <h1 className="flex text-2xl font-semibold">
                  Meeting Title{" "}
                  <span className="ml-6 flex items-center text-sm font-light text-green-500">
                    <Dot />
                    Live
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Created by: HostName
                </p>
              </div> */}

              <div className="flex h-[70vh] w-full flex-col items-stretch justify-between gap-4">
                {/* <div className="flex flex-1 flex-col items-center justify-between"> */}
                <div className="flex-grow">
                  <VideoGrid
                    localStream={stream}
                    screenShare={shareStream}
                    participants={participants}
                    chatOpen={chatOpen}
                    setChatOpen={setChatOpen}
                  />
                </div>

                <div className="absolute bottom-12 left-1/2 z-10 flex h-48 w-full max-w-[1600px] -translate-x-1/2 transform items-end justify-center lg:h-fit lg:bg-none">
                  <>
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 mx-2 rounded-md px-5 py-7 transition-all duration-500",
                        isVideoOn
                          ? "bg-[#F7F7F7] text-black hover:bg-[#EEEEEE]"
                          : "bg-[#EA4336] text-white",
                      )}
                      onClick={toggleVideo}
                    >
                      {isVideoOn ? <Video /> : <VideoOff />}
                    </Button>
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 mx-2 rounded-md px-5 py-7 transition-all duration-500",
                        isAudioOn
                          ? "bg-[#F7F7F7] text-black hover:bg-[#EEEEEE]"
                          : "bg-[#EA4336] text-white",
                      )}
                      onClick={toggleAudio}
                    >
                      {isAudioOn ? <Mic /> : <MicOff />}
                    </Button>
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 mx-2 rounded-md px-5 py-7 text-black transition-all duration-500",
                        isScreenSharing
                          ? "bg-[#E2EDFF]"
                          : "bg-[#F7F7F7] hover:bg-[#EEEEEE]",
                      )}
                      onClick={toggleScreenShare}
                    >
                      <MonitorUp />
                    </Button>
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 mx-2 rounded-md px-5 py-7 transition-all duration-500",
                        isRecording
                          ? "bg-[#EA4336] text-white"
                          : "bg-[#F7F7F7] text-black hover:bg-[#EEEEEE]",
                      )}
                      onClick={async () => {
                        const status = isRecording
                          ? await fetch(
                              `/api/stopRecording?roomId=${params.roomId}`,
                            )
                          : await fetch(
                              `/api/startRecording?roomId=${params.roomId}`,
                            );

                        await status.json();
                        setIsRecording(!isRecording);
                      }}
                    >
                      <Disc2 />
                    </Button>
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 mx-2 rounded-md px-5 py-7 text-black transition-all duration-500",
                        !chatOpen
                          ? "bg-[#E2EDFF]"
                          : "bg-[#F7F7F7] hover:bg-[#EEEEEE]",
                      )}
                      onClick={toggleChat}
                    >
                      <Inbox />
                    </Button>
                  </>
                </div>
              </div>

              {/* </div> */}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
