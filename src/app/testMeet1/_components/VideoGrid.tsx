"use client";

import { cn } from "@/lib/utils";
import ChatBox from "./ChatBox";

const VideoGrid = ({
  participants,
  localStream,
  screenShare,
  chatOpen,
  setChatOpen,
}: any) => {
  const calculateGridSize = () => {
    const count =
      participants.length + (localStream ? 1 : 0) + (screenShare ? 1 : 0);
    if (count <= 4) return "grid-cols-4";
    if (count <= 9) return "grid-cols-4";
    return `${!chatOpen ? "grid-cols-4" : "grid-cols-5"}`;
  };

  return (
    <div className={cn("flex h-[100%] space-x-2", !chatOpen && "h-[90%]")}>
      <div
        className={cn(
          `grid gap-2 ${calculateGridSize()} h-[90%] w-[100%] border`,
          !chatOpen && "h-[100%] w-[90%]",
        )}
      >
        {localStream && (
          <div className="relative aspect-video">
            {/* {new Array(2).fill(0).map((_, index) => ( */}
            <video
              ref={(el) => {
                if (el) el.srcObject = localStream;
              }}
              // key={index}
              autoPlay
              muted
              className="h-full w-full rounded-lg object-cover"
            />
            {/* ))} */}
            <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
              You
            </span>
          </div>
        )}
        {screenShare && (
          <div className="relative col-span-3 col-start-1 row-start-1 aspect-video">
            <video
              ref={(el) => {
                if (el) el.srcObject = screenShare;
              }}
              autoPlay
              className="h-[90%] w-full rounded-lg bg-gray-800 object-contain"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
              Screen Share
            </span>
          </div>
        )}
        {participants.map((participant: any, index: number) => (
          <div key={index} className="relative aspect-video">
            <video
              ref={(el) => {
                if (el && participant.stream) el.srcObject = participant.stream;
              }}
              autoPlay
              className="h-full w-full rounded-lg object-cover"
            />
            <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
              {participant.name}
            </span>
          </div>
        ))}
      </div>
      <ChatBox onView={chatOpen} setOnView={setChatOpen} />
    </div>
  );
};

export default VideoGrid;
