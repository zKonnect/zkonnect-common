"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import {
  Disc2,
  Dot,
  Mic,
  MicOff,
  MonitorUp,
  Video,
  VideoOff,
} from "lucide-react";
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
import ChatBox from "@/components/ChatBox/ChatBox";
import RemotePeer from "@/components/RemotePeer/RemotePeer";
import { handleSignIn } from "@/components/SignIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEventCollectionAddress } from "@/actions";
import { toast } from "sonner";

type TPeerMetadata = {
  displayName: string;
};

export default function Page() {
  const [displayName, setDisplayName] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const wallet = useWallet();
  const params = useParams();

  const { joinRoom, state } = useRoom({
    onJoin: (room) => {
      console.log("onJoin", room);
      updateMetadata({ displayName });
    },
    onPeerJoin: (peer) => {
      console.log("onPeerJoin", peer);
    },
  });
  const { enableVideo, isVideoOn, stream, disableVideo } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { startScreenShare, stopScreenShare, shareStream } =
    useLocalScreenShare();
  const { updateMetadata } = useLocalPeer<TPeerMetadata>();
  const { peerIds } = usePeerIds();

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

    const handleWallet = async () => {
      const collectionAddress = await getEventCollectionAddress(roomId);

      if (!collectionAddress) {
        toast.error("Room does not exist with valid collection address");
        return;
      }

      const token = await handleSignIn(
        params.roomId as string,
        displayName,
        wallet.signMessage,
        wallet.publicKey,
        collectionAddress as unknown as string,
      );
      if (token) {
        await joinRoom({
          token,
          roomId: params.roomId as string,
        });
      }
    };
    if (wallet.connected && state === "idle") {
      handleWallet();
    }
  }, [wallet.connected]);

  return (
    <section className="flex min-h-screen flex-col items-center px-6 pt-32 text-black 2xl:px-2">
      <div className="z-10 w-full max-w-[1600px] flex-col items-center justify-between text-sm">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Event Title</h1>
          <p className="text-sm text-muted-foreground">
            One Liner Description of the Event
          </p>
        </div>
        <div className="mt-6 h-[600px] rounded-2xl bg-zkonnect-white-origin px-8 py-6">
          <div className="space-y-4">
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
          </div>

          <div className="mt-8 flex w-full items-stretch justify-between gap-4">
            <div className="flex flex-1 flex-col items-center justify-between">
              <div className="before:bg-gradient-radial after:bg-gradient-conic relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:lg:h-[360px]">
                <div className="relative flex gap-2">
                  {isVideoOn && (
                    <div className="mx-auto w-1/2 rounded-xl border-2 border-blue-400">
                      <video
                        ref={videoRef}
                        className="aspect-video rounded-xl"
                        autoPlay
                        muted
                      />
                    </div>
                  )}
                  {shareStream && (
                    <div className="mx-auto w-1/2 rounded-xl border-2 border-blue-400">
                      <video
                        ref={screenRef}
                        className="aspect-video rounded-xl"
                        autoPlay
                        muted
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-32 mt-8 grid gap-2 text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
                {peerIds.map((peerId) =>
                  peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null,
                )}
              </div>
              <div className="fixed bottom-0 left-0 z-10 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
                {state === "idle" && (
                  <>
                    <Input
                      disabled={state !== "idle"}
                      placeholder="Your Display Name"
                      type="text"
                      className="mx-2 p-2 text-black"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                    />
                  </>
                )}

                {state === "connected" && (
                  <>
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
                      {shareStream ? <MonitorUp /> : <MonitorUp />}
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
                      {isRecording ? <Disc2 /> : <Disc2 />}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {state === "connected" && <ChatBox />}
          </div>
        </div>
      </div>
    </section>
  );
}
