import { useState } from "react";
import Image from "next/image";

import { MoveRight } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { ConfirmPreview } from "./confirmPreview";

export function ConfirmEvent({
  onConfirm,
  eventName,
  eventDescription,
  dateTime,
  ticketPrice,
  totalTickets,
  tokenType,
  disabled,
  selectedImage,
  walletAddr,
  newMeetUrl,
}: {
  onConfirm: () => void;
  eventName: string;
  eventDescription: string;
  dateTime: string;
  ticketPrice: number;
  totalTickets: number;
  tokenType: string;
  disabled: boolean;
  selectedImage: string;
  walletAddr: string | undefined;
  newMeetUrl?: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [blinkUrl, setBlinkUrl] = useState<string>();

  const handleConfirm = async () => {
    onConfirm();
    setBlinkUrl(
      `https://zkonnect.social/api/actions/buyTicket?eventName=${eventName}&address=${walletAddr}`,
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="z-10 w-[150px] space-x-3 self-end px-7 py-6 text-sm"
          disabled={disabled}
        >
          <span>Create</span>
          <MoveRight size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm the given details👇🏻</DialogTitle>
          <DialogDescription className="space-y-2 pt-4">
            <p className="text-base font-semibold leading-none tracking-tight text-black">
              {eventName}
            </p>
            <p className="text-xs">Starts on: {dateTime}</p>
          </DialogDescription>
          <Separator className="my-4" />
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-4 h-full text-sm text-black">{eventDescription}</p>
            <div className="space-y-1 text-sm">
              <p>Start Time: {dateTime}</p>
              <p>Total Tickets: {totalTickets}</p>
              <p>Ticket Price: {ticketPrice}</p>
              <p>Token Type: {tokenType}</p>
            </div>
          </div>
          <Image
            src={selectedImage}
            width={208}
            height={208}
            alt="event banner"
            className="size-52"
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex items-start justify-start space-x-1">
            <Button
              variant="outline"
              size="default"
              className="text-xs"
              onClick={() => {
                setIsOpen((open: boolean) => !open);
              }}
            >
              Cancel
            </Button>
            <ConfirmPreview
              onConfirm={handleConfirm}
              bannerUrl={selectedImage}
              blinkUrl={blinkUrl}
              newMeetUrl={newMeetUrl}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
