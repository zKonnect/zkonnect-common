import { useState } from "react";

import { useDataMessage, useLocalPeer } from "@huddle01/react/hooks";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import RemoteMessageBubble from "./RemoteMessageBubble";
import LocalMessageBubble from "./LocalMessageBubble";

type TMessage = {
  text: string;
  sender: string;
};

function ChatBox({
  onView,
  setOnView,
}: {
  onView: boolean;
  setOnView: (p: boolean) => boolean;
}) {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [text, setText] = useState<string>("");

  const { peerId } = useLocalPeer();
  const { sendData } = useDataMessage({
    onMessage: (payload, from, label) => {
      if (label === "chat") {
        setMessages((prev) => [...prev, { text: payload, sender: from }]);
      }
    },
  });

  const sendMessage = () => {
    sendData({
      to: "*",
      payload: text,
      label: "chat",
    });
    setText("");
  };

  return (
    <div
      className={cn(
        "flex w-1/3 min-w-[300px] flex-col rounded-lg border text-black",
        onView && "hidden",
      )}
    >
      <Button
        className="my-3 ml-auto h-4 w-12 bg-white py-0 hover:bg-white"
        onClick={() => {
          setOnView(!onView);
        }}
      >
        <X className="text-muted-foreground" size={15} />
      </Button>
      <Tabs defaultValue="chatroom" className="flex h-full w-full flex-col">
        <TabsList className="mx-auto grid min-h-[55px] w-[94%] grid-cols-2 space-x-2 px-2">
          <TabsTrigger
            value="chatroom"
            className="min-h-[38px] hover:bg-white hover:text-red-500 data-[state=active]:text-red-500"
          >
            Chatroom
          </TabsTrigger>
          <TabsTrigger
            value="participants"
            className="min-h-[40px] hover:bg-white hover:text-red-500 data-[state=active]:text-red-500"
          >
            Participants
          </TabsTrigger>
        </TabsList>
        <p className="my-3 w-full text-center text-sm text-muted-foreground">
          Join the Conversation in the Chatroom!
        </p>
        <Separator />
        <TabsContent value="chatroom" className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto border-b p-4">
            {messages.map((message, index) =>
              message.sender === peerId ? (
                <LocalMessageBubble key={index} message={message} />
              ) : (
                <RemoteMessageBubble key={index} message={message} />
              ),
            )}
          </div>
          <div className="relative flex space-x-2 px-4 py-2">
            <input
              type="text"
              className="w-full self-end rounded-md border p-2 text-sm text-black outline-none"
              placeholder="Your Message..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              onClick={() => {
                sendMessage();
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="-2.4 -2.4 28.80 28.80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
                strokeWidth="0.00024000000000000003"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.265 4.42619C1.04293 2.87167 2.6169 1.67931 4.05323 2.31397L21.8341 10.1706C23.423 10.8727 23.423 13.1273 21.8341 13.8294L4.05323 21.686C2.6169 22.3207 1.04293 21.1283 1.265 19.5738L1.99102 14.4917C2.06002 14.0087 2.41458 13.6156 2.88791 13.4972L8.87688 12L2.88791 10.5028C2.41458 10.3844 2.06002 9.99129 1.99102 9.50829L1.265 4.42619ZM21.0257 12L3.2449 4.14335L3.89484 8.69294L12.8545 10.9328C13.9654 11.2106 13.9654 12.7894 12.8545 13.0672L3.89484 15.3071L3.2449 19.8566L21.0257 12Z"
                    fill="#080202"
                  />
                </g>
              </svg>
            </button>
          </div>
        </TabsContent>
        <TabsContent value="participants"></TabsContent>
      </Tabs>
    </div>
  );
}

export default ChatBox;
