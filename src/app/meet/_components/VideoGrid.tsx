import { cn } from "@/lib/utils";

import ChatBox from "./ChatBox/ChatBox";
import GuestPeer from "./GuestPeer";
import HostPeer from "./HostPeer";

const VideoGrid = ({
  localStream,
  screenShare,
  chatOpen,
  setChatOpen,
  currentPage,
  state,
  displayName,
  host,
  role,
  remoteData,
  currentPeerId,
}: any) => {
  const calculateHostGridSize = () => {
    const count = (localStream ? 1 : 0) + (screenShare ? 1 : 0);
    if (count <= 1) return "grid-cols-1";
    else if (count === 2)
      return `${localStream && screenShare ? "grid-cols-3" : "grid-cols-2"}`;
    else if (count === 3) return "grid-cols-3";
    else if (count <= 4) return "grid-cols-2";
    else if (count <= 9) return "grid-cols-4";
    return `${!chatOpen ? "grid-cols-4" : "grid-cols-5"}`;
  };
  const calculateGridSize = () => {
    const count =
      remoteData.length + (localStream ? 1 : 0) + (screenShare ? 1 : 0);
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count <= 4) return "grid-cols-4";
    if (count <= 9) return "grid-cols-4";
    return `${!chatOpen ? "grid-cols-4" : "grid-cols-5"}`;
  };

  // Calculate grid size dynamically
  // const calculateGridSize2 = () => {
  //   const itemsCount =
  //     currentPage === 0 ? 1 : participantsChunks[currentPage - 1].length;
  //   return `grid-cols-${Math.min(5, itemsCount)} grid-rows-${Math.ceil(itemsCount / 5)}`;
  // };

  return (
    <div className={cn("flex h-[100%] space-x-2", !chatOpen && "h-[90%]")}>
      <div
        className={cn(
          `grid gap-2 ${currentPage === 0 ? calculateHostGridSize() : calculateGridSize()} h-[90%] w-[100%]`,
          !chatOpen && "h-[100%] w-[90%]",
        )}
      >
        {role === "host" && currentPage === 0 && (
          <>
            {!localStream && !screenShare && (
              <div className="relative col-span-2 h-full w-full rounded-lg bg-[#D9D9D9]/40">
                <div className="mx-auto flex h-full max-h-[calc(100vh-17vh)] w-full items-center justify-center rounded-lg object-cover">
                  <span className="text-xl font-medium">{displayName}</span>
                </div>
                <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
                  You
                </span>
              </div>
            )}

            {screenShare && (
              <div
                className={cn(
                  "relative flex h-full w-full items-center justify-center rounded-lg bg-[#D9D9D9]/40",
                  screenShare && localStream && "col-span-2",
                )}
              >
                <video
                  ref={(el) => {
                    if (el) el.srcObject = screenShare;
                  }}
                  autoPlay
                  className="mx-auto h-auto max-h-[calc(100vh-17vh)] w-auto rounded-lg object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
                  Your Screen
                </span>
              </div>
            )}
            {localStream && (
              <div
                className={cn(
                  "relative h-full w-full rounded-lg bg-[#D9D9D9]/40",
                  localStream &&
                    screenShare &&
                    "flex h-full flex-col justify-between gap-4 bg-white",
                )}
              >
                <div
                  className={cn(
                    "relative h-full",
                    localStream &&
                      screenShare &&
                      "h-[60%] rounded-lg bg-[#D9D9D9]/40",
                  )}
                >
                  <video
                    ref={(el) => {
                      if (el) el.srcObject = localStream;
                    }}
                    autoPlay
                    muted
                    className="mx-auto h-full max-h-[calc(100vh-17vh)] w-auto rounded-lg object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
                    {displayName}
                  </span>
                </div>
                {localStream && screenShare && (
                  <div className="flex flex-1 items-center justify-center rounded-lg bg-[#D9D9D9]/40 text-2xl text-muted-foreground">
                    <svg
                      width="52"
                      height="52"
                      viewBox="0 0 52 52"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M25.9999 23.3998C28.0686 23.3998 30.0525 22.578 31.5153 21.1152C32.9781 19.6525 33.7999 17.6685 33.7999 15.5998C33.7999 13.5311 32.9781 11.5472 31.5153 10.0844C30.0525 8.62159 28.0686 7.7998 25.9999 7.7998C23.9312 7.7998 21.9472 8.62159 20.4845 10.0844C19.0217 11.5472 18.1999 13.5311 18.1999 15.5998C18.1999 17.6685 19.0217 19.6525 20.4845 21.1152C21.9472 22.578 23.9312 23.3998 25.9999 23.3998ZM15.5999 20.7998C15.5999 22.1789 15.052 23.5016 14.0768 24.4768C13.1017 25.4519 11.779 25.9998 10.3999 25.9998C9.02076 25.9998 7.69812 25.4519 6.72293 24.4768C5.74774 23.5016 5.19989 22.1789 5.19989 20.7998C5.19989 19.4207 5.74774 18.098 6.72293 17.1228C7.69812 16.1477 9.02076 15.5998 10.3999 15.5998C11.779 15.5998 13.1017 16.1477 14.0768 17.1228C15.052 18.098 15.5999 19.4207 15.5999 20.7998ZM3.87389 39.8474C3.43003 39.5952 3.09765 39.1848 2.94309 38.6982C2.48498 37.2145 2.48018 35.6277 2.92929 34.1413C3.3784 32.6548 4.26099 31.3361 5.46403 30.3543C6.66707 29.3724 8.1358 28.772 9.68214 28.6299C11.2285 28.4878 12.782 28.8104 14.1439 29.5566C11.3446 32.3063 9.59286 35.9468 9.19089 39.85C9.13196 40.4307 9.15362 40.9975 9.25589 41.5504C7.35881 41.3838 5.5215 40.8024 3.87389 39.8474ZM42.7439 41.5478C44.6408 41.382 46.4781 40.8015 48.1259 39.8474C48.5688 39.5947 48.9002 39.1843 49.0541 38.6982C49.5129 37.2143 49.5183 35.6272 49.0695 34.1402C48.6207 32.6532 47.7382 31.3341 46.535 30.3518C45.3318 29.3696 43.8627 28.7689 42.316 28.6267C40.7693 28.4846 39.2154 28.8075 37.8533 29.554C40.655 32.3036 42.4087 35.9452 42.8115 39.85C42.8701 40.4171 42.8474 40.9897 42.7439 41.5504M46.7999 20.7998C46.7999 22.1789 46.252 23.5016 45.2768 24.4768C44.3017 25.4519 42.979 25.9998 41.5999 25.9998C40.2208 25.9998 38.8981 25.4519 37.9229 24.4768C36.9477 23.5016 36.3999 22.1789 36.3999 20.7998C36.3999 19.4207 36.9477 18.098 37.9229 17.1228C38.8981 16.1477 40.2208 15.5998 41.5999 15.5998C42.979 15.5998 44.3017 16.1477 45.2768 17.1228C46.252 18.098 46.7999 19.4207 46.7999 20.7998ZM13.7903 42.0938C13.5332 41.8647 13.334 41.578 13.2088 41.2572C13.0836 40.9364 13.0361 40.5905 13.0701 40.2478C13.4008 37.0485 14.9058 34.0853 17.2942 31.9311C19.6826 29.7768 22.7848 28.5845 26.0012 28.5845C29.2176 28.5845 32.3198 29.7768 34.7082 31.9311C37.0966 34.0853 38.6016 37.0485 38.9323 40.2478C38.9663 40.5905 38.9188 40.9364 38.7936 41.2572C38.6684 41.578 38.4692 41.8647 38.2121 42.0938C34.8684 45.1268 30.5142 46.8046 25.9999 46.7998C21.486 46.8065 17.132 45.1283 13.7903 42.0938Z"
                        fill="#808080"
                      />
                    </svg>
                    +{remoteData.length}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {currentPage === 0 && role === "guest" ? (
          host.length > 0 ? (
            host.map((peerId: any, index: number) => (
              <HostPeer
                peerId={peerId}
                key={index}
                remoteParticipantsLength={remoteData.length}
              />
            ))
          ) : (
            <div className="relative col-span-2 h-full w-full rounded-lg bg-[#D9D9D9]/40">
              <div className="mx-auto flex h-full max-h-[calc(100vh-17vh)] w-full items-center justify-center rounded-lg object-cover">
                <span className="text-xl font-medium">
                  Host has not Joined yet
                </span>
              </div>
            </div>
          )
        ) : (
          <></>
        )}
        {currentPage > 0 && (
          <>
            {role === "guest" &&
              (!localStream ? (
                <div className="relative aspect-video max-h-[calc(100vh-17vh)] w-full rounded-lg bg-[#D9D9D9]/40">
                  <div className="flex h-full w-full items-center justify-center rounded-lg object-cover">
                    <span className="text-xl font-medium">{displayName}</span>
                  </div>
                  <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
                    You
                  </span>
                </div>
              ) : (
                <div className="relative aspect-video max-h-[calc(100vh-17vh)] rounded-lg bg-[#D9D9D9]/40">
                  <video
                    ref={(el) => {
                      if (el && localStream) el.srcObject = localStream;
                    }}
                    autoPlay
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <span className="absolute bottom-2 left-2 rounded-md bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
                    You
                  </span>
                </div>
              ))}
            {role === "host"
              ? remoteData.length > 0 &&
                remoteData.map((peerId: any, index: number) => (
                  <GuestPeer key={index} peerId={peerId} />
                ))
              : remoteData.length > 1 &&
                remoteData
                  .filter((peerId: any) => peerId !== currentPeerId)
                  .map((peerId: any, index: number) => (
                    <GuestPeer key={index} peerId={peerId} />
                  ))}
          </>
        )}
      </div>
      {state === "connected" && (
        <ChatBox onView={chatOpen} setOnView={setChatOpen} />
      )}
    </div>
  );
};

export default VideoGrid;
