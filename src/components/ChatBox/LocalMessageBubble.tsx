// import { useLocalPeer } from "@huddle01/react/hooks";

type TMessage = {
  text: string;
  sender: string;
};

// type TPeerMetadata = {
//   displayName: string;
// };

interface Props {
  message: TMessage;
}

function LocalMessageBubble({ message }: Props) {
  // const { metadata } = useLocalPeer<TPeerMetadata>();

  return (
    <div className="my-2 flex w-full items-end justify-end space-x-2 rounded-lg">
      <span className="font-semibold text-black">You: </span>
      <span className="text-sm text-black">{message.text}</span>
    </div>
  );
}

export default LocalMessageBubble;
