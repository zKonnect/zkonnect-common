type TMessage = {
  text: string;
  sender: string;
};

interface Props {
  message: TMessage;
}

function LocalMessageBubble({ message }: Props) {
  return (
    <div className="my-2 flex w-full items-end justify-end space-x-2">
      <span className="font-semibold text-black">You: </span>
      <span className="text-sm text-black">{message.text}</span>
    </div>
  );
}

export default LocalMessageBubble;
