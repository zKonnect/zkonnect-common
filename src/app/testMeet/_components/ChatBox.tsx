import { useState } from "react";

type TMessage = {
  text: string;
  sender: string;
};

function ChatBox() {
  const [text, setText] = useState<string>("");

  return (
    <div className="flex w-1/3 flex-col rounded-lg border text-black">
      <div className="my-2 space-y-4 border-b text-center">
        <h1 className="text-2xl font-semibold">Chat Room</h1>
        <p className="text-sm text-muted-foreground">
          Join the Conversation in the Chatroom!
        </p>
      </div>
      <div className="min-h-[300px] flex-1 border-b p-4"></div>
      <div className="relative flex space-x-2 px-4 py-2">
        <input
          type="text"
          className="w-full self-end rounded-md border p-2 text-sm text-black outline-none"
          placeholder="Your Message..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button>
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
    </div>
  );
}

export default ChatBox;
