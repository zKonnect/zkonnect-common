import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Copy, Check, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePreview } from "@/hooks/use-preview";

export function ConfirmPreview({
  onConfirm,
  bannerUrl,
  blinkUrl,
  newMeetUrl,
}: {
  onConfirm: () => void;
  bannerUrl: string;
  blinkUrl: string | undefined;
  newMeetUrl: string | undefined;
}) {
  const router = useRouter();

  const toggle = usePreview((store) => store.toggle);
  const isOpen = usePreview((store) => store.isPreviewOpen);
  const [copiedBlink, setCopiedBlink] = useState<boolean>(false);
  const [copiedMeet, setCopiedMeet] = useState<boolean>(false);

  const onCopy = (url: string, setCopied: (value: boolean) => void) => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            toggle();
            onConfirm();
          }}
          size="default"
          className="text-xs"
        >
          <CircleCheck size={16} className="mr-2" />
          Confirm
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[450px] rounded-lg sm:min-w-[425px]">
        <DialogHeader>
          <DialogTitle>Here you goo! 🤩</DialogTitle>
          <DialogDescription>
            Share on Social Media and engage with others.{" "}
          </DialogDescription>
        </DialogHeader>
        <Image
          src={bannerUrl}
          width={208}
          height={208}
          alt="event banner"
          className="mx-auto size-46 bg-[#FF6D4D]"
        />
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="blink-link" className="mb-1 flex items-center">
              <Image
                src="/assets/blink-icon.svg"
                width={20}
                height={20}
                alt="blink-icon"
                className="mr-2"
              />
              <span>Blink</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="blink-link"
                value={blinkUrl}
                readOnly
                onClick={() =>
                  onCopy(
                    blinkUrl || "https://zkonnect.social/meet",
                    setCopiedBlink,
                  )
                }
                className="cursor-pointer"
              />
              <Button
                type="submit"
                size="sm"
                className="h-full px-3"
                onClick={() =>
                  onCopy(
                    blinkUrl ||
                      "https://zkonnect.social/api/actions/buyTicket?eventName=A%20informative%20session&address=8SxxZLiRpQT4WAk4kg1VyfbEvraKJj6DamfZJJoMQtKG",
                    setCopiedBlink,
                  )
                }
                disabled={copiedBlink}
              >
                <span className="sr-only">Copy</span>
                {copiedBlink ? <Check size={20} /> : <Copy size={20} />}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="meet-link" className="mb-1 flex items-center">
              <Image
                src="/assets/meet-icon.svg"
                width={20}
                height={20}
                alt="meet-icon"
                className="mr-2"
              />
              <span>Meeting Link</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="meet-link"
                value={newMeetUrl || "https://zkonnect.social/meet"}
                readOnly
                onClick={() =>
                  onCopy(
                    newMeetUrl || "https://zkonnect.social/meet",
                    setCopiedMeet,
                  )
                }
                className="cursor-pointer"
              />
              <Button
                type="submit"
                size="sm"
                className="h-full px-3"
                onClick={() =>
                  onCopy(
                    newMeetUrl || "https://zkonnect.social/meet",
                    setCopiedMeet,
                  )
                }
                disabled={copiedMeet}
              >
                <span className="sr-only">Copy</span>
                {copiedMeet ? <Check size={20} /> : <Copy size={20} />}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              router.push("/creator-dashboard");
            }}
            size="default"
            className="text-xs"
          >
            Go to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
