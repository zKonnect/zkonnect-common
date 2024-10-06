"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
  ArrowRight,
  ChevronRight,
  Inbox,
  Loader2,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  useLocalAudio,
  useLocalPeer,
  useLocalScreenShare,
  useLocalVideo,
  usePeerIds,
  useRoom,
} from "@huddle01/react/hooks";
import { useWallet } from "@solana/wallet-adapter-react";

import { cn } from "@/lib/utils";
import { handleSignIn } from "@/components/SignIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WalletConnectButton from "@/components/Wallet/wallet-connect-button";
import { Separator } from "@/components/ui/separator";
import { getEventCollectionAddress } from "@/actions";
import VideoGrid from "../_components/VideoGrid";

type TPeerMetadata = {
  displayName: string;
};

export default function Page() {
  const [displayName, setDisplayName] = useState<string>("");
  const [hasEnteredMeeting, setHasEnteredMeeting] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [token, setToken] = useState<string>("");

  const wallet = useWallet();
  const params = useParams();
  const router = useRouter();

  const { joinRoom, state, leaveRoom } = useRoom({
    onJoin: (room) => {
      updateMetadata({ displayName });
    },
    onPeerJoin: (peer) => {},
  });
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();
  const { updateMetadata, role, metadata, peerId } =
    useLocalPeer<TPeerMetadata>();

  const { peerIds } = usePeerIds();
  const hostPeerId = usePeerIds({ roles: ["host"] });
  const guestsPeerId = usePeerIds({ roles: ["guest"] });

  const [remoteData, setRemoteData] = useState<any>([]);
  const [host, setHost] = useState<any>([]);

  const handleNextPage = () => {
    if (currentPage < remoteData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEnterMeeting = (token: string) => {
    if (displayName.trim()) {
      setIsLoading(true);
      setTimeout(async () => {
        setIsLoading(false);
        setHasEnteredMeeting(true);
        await joinRoom({
          token,
          roomId: params.roomId as string,
        });
      }, 2000);
    }
  };

  const handleWallet = async (roomId: string) => {
    const collectionAddress = await getEventCollectionAddress(roomId);

    if (!collectionAddress) {
      toast.error("Room does not exist with valid collection address");
      return;
    }

    const roomToken = await handleSignIn(
      params.roomId as string,
      displayName,
      wallet.signMessage,
      wallet.publicKey,
      collectionAddress as unknown as string,
    );

    if (roomToken) {
      setToken(roomToken);
    }
  };

  useEffect(() => {
    if (role === "host" && peerId) {
      setHost(peerId);
      setRemoteData(guestsPeerId.peerIds);
    }
    // if (guestsPeerId.peerIds.length > 0) {
    //   setRemoteData(guestsPeerId.peerIds);
    // }
    if (role === "guest") {
      setHost(hostPeerId.peerIds);
      const combinedPeerIds = [
        ...(guestsPeerId.peerIds || []),
        ...(peerId ? [peerId] : []),
      ].filter((id) => id !== null);

      if (combinedPeerIds.length > 0) {
        setRemoteData(combinedPeerIds);
      }
    }
  }, [peerIds, role]);

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

  useEffect(() => {
    const location = window.location.href;
    const roomId = location.split("meet/")[1];

    if (wallet.connected && state === "idle") {
      handleWallet(roomId);
    }
  }, [wallet.connected]);

  useEffect(() => {
    if (hasEnteredMeeting && !wallet.connected) {
      router.push("/goodBye");
    }
  }, [hasEnteredMeeting, wallet.connected, router]);

  const toggleChat = () => {
    setChatOpen((open) => !open);
  };

  return (
    <section className="flex h-full min-h-screen flex-col items-center px-6 pt-16 text-black 2xl:px-2">
      <div className="z-10 mx-auto flex h-full w-full max-w-[1600px] items-center text-sm">
        <div
          className={cn(
            "w-full rounded-2xl",
            hasEnteredMeeting ? "h-full" : "h-full",
          )}
        >
          {!hasEnteredMeeting ? (
            <div className="flex size-full flex-col items-center justify-center space-y-3 lg:space-y-6">
              <Image
                src="/assets/brand-icons/logo.svg"
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
              {token && (
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
                      onClick={() => {
                        handleEnterMeeting(token);
                      }}
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
            <div className="flex h-full w-full flex-col items-stretch justify-between gap-4">
              <div className="flex-grow">
                <VideoGrid
                  localStream={stream}
                  screenShare={shareStream}
                  chatOpen={chatOpen}
                  setChatOpen={setChatOpen}
                  currentPage={currentPage}
                  state={state}
                  displayName={displayName}
                  host={host}
                  role={role}
                  remoteData={remoteData}
                  currentPeerId={peerId}
                />
              </div>

              <div className="absolute bottom-3 left-1/2 z-10 flex h-48 w-full max-w-[1600px] -translate-x-1/2 transform items-end lg:h-fit lg:bg-none">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 rotate-180 rounded-md bg-[#F7F7F7] px-5 py-7 text-black transition-all duration-500 hover:bg-[#EEEEEE]",
                      )}
                      onClick={handlePreviousPage}
                      disabled={currentPage === 0}
                    >
                      <ChevronRight size={18} />
                    </Button>
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 rounded-md bg-[#F7F7F7] px-5 py-7 text-black transition-all duration-500 hover:bg-[#EEEEEE]",
                      )}
                      onClick={handleNextPage}
                      disabled={currentPage === remoteData.length}
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                  <div className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 mx-2 rounded-md px-5 py-7 transition-all duration-500",
                        isVideoOn
                          ? "bg-[#F7F7F7] text-black hover:bg-[#EEEEEE]"
                          : "bg-[#EA4336] text-white",
                      )}
                      onClick={async () => {
                        isVideoOn ? await disableVideo() : await enableVideo();
                      }}
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
                      onClick={async () => {
                        isAudioOn ? await disableAudio() : await enableAudio();
                      }}
                    >
                      {isAudioOn ? <Mic /> : <MicOff />}
                    </Button>
                    <Button
                      size="default"
                      className={cn(
                        "group z-10 mx-2 rounded-md px-5 py-7 text-black transition-all duration-500",
                        shareStream
                          ? "bg-[#E2EDFF]"
                          : "bg-[#F7F7F7] hover:bg-[#EEEEEE]",
                      )}
                      onClick={async () => {
                        shareStream
                          ? await stopScreenShare()
                          : await startScreenShare();
                      }}
                    >
                      <MonitorUp />
                    </Button>
                    {/* <Button
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
                    </Button> */}
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
                    <Button
                      size="default"
                      className="group z-10 mx-2 rounded-md bg-[#EA4336] px-5 py-7 text-white transition-all duration-500"
                      onClick={() => {
                        leaveRoom();
                        router.push("/goodBye");
                      }}
                    >
                      <PhoneOff />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-1.5 text-muted-foreground">
                    <p className="font-medium">Event Title</p>
                    <Separator orientation="vertical" className="h-5" />
                    <p>
                      Creator name: <span className="font-medium">Manice</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
