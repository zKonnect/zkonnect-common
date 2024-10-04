import React, { useEffect, useRef } from "react";

import {
  useRemoteAudio,
  useRemotePeer,
  useRemoteScreenShare,
  useRemoteVideo,
} from "@huddle01/react/hooks";

type Props = {
  peerId: string;
};

type Metadata = {
  displayName?: string;
};

const GuestPeer = ({ peerId }: Props) => {
  const { metadata } = useRemotePeer<Metadata>({
    peerId,
  });
  const { stream, state } = useRemoteVideo({ peerId });
  const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });
  const { videoStream: screenVideo, audioStream: screenAudio } =
    useRemoteScreenShare({ peerId });
  const vidRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const screenAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (stream && vidRef.current && state === "playable") {
      vidRef.current.srcObject = stream;

      vidRef.current.onloadedmetadata = async () => {
        try {
          vidRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      vidRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [stream]);

  useEffect(() => {
    if (audioStream && audioRef.current && audioState === "playable") {
      audioRef.current.srcObject = audioStream;

      audioRef.current.onloadedmetadata = async () => {
        try {
          audioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      audioRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [audioStream]);

  useEffect(() => {
    if (screenVideo && screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenVideo;

      screenVideoRef.current.onloadedmetadata = async () => {
        try {
          screenVideoRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      screenVideoRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [screenVideo]);

  useEffect(() => {
    if (screenAudio && screenAudioRef.current) {
      screenAudioRef.current.srcObject = screenAudio;

      screenAudioRef.current.onloadedmetadata = async () => {
        try {
          screenAudioRef.current?.play();
        } catch (error) {
          console.error(error);
        }
      };

      screenAudioRef.current.onerror = () => {
        console.error("videoCard() | Error is hapenning...");
      };
    }
  }, [screenAudio]);

  return (
    <>
      {!stream && (
        <div className="relative aspect-video max-h-[calc(100vh-17vh)] w-full rounded-lg bg-[#D9D9D9]/40">
          <div className="flex h-full w-full items-center justify-center rounded-lg object-cover">
            <span className="text-xl font-medium">{metadata?.displayName}</span>
          </div>
          <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
            {metadata?.displayName}
          </span>
        </div>
      )}
      {stream && (
        <div className="relative aspect-video max-h-[calc(100vh-17vh)] w-full rounded-lg bg-[#D9D9D9]/40">
          <video
            ref={(el) => {
              if (el && stream) el.srcObject = stream;
            }}
            autoPlay
            className="h-full w-full rounded-lg object-cover"
          />
          <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
            {metadata?.displayName}
          </span>
        </div>
      )}
    </>
  );
};

export default React.memo(GuestPeer);
