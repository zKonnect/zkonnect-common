import { useRemotePeer } from "@huddle01/react/hooks";

type TMessage = {
  text: string;
  sender: string;
};

type TPeerMetadata = {
  displayName: string;
};

interface Props {
  message: TMessage;
}

function RemoteMessageBubble({ message }: Props) {
  const { metadata } = useRemotePeer<TPeerMetadata>({ peerId: message.sender });

  return (
    <div className="my-2 flex flex-col items-start space-x-2">
      <span className="font-medium text-black">{metadata?.displayName}:</span>
      <span className="text-sm text-black">{message.text}</span>
    </div>
  );
}

export default RemoteMessageBubble;
