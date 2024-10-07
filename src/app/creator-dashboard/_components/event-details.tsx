"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Copy,
  Check,
  CircleCheck,
  Ticket,
  HandCoins,
  CalendarDays,
  Hourglass,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventData } from "@/types";
import { formatDate, formatDuration } from "@/lib/formatEventTime";

export default function EventDetials({
  id,
  roomId,
  eventName,
  eventDesc,
  eventBanner,
  eventDate,
  totalTickets,
  ticketPrice,
  nativeToken,
  meetLink,
  blink,
  hostWalletAddress,
  collectionAddress,
  creatorId,
  ticketsSold,
  duration,
}: EventData) {
  const [copiedBlink, setCopiedBlink] = useState<boolean>(false);
  const [copiedMeet, setCopiedMeet] = useState<boolean>(false);

  const onCopy = (url: string, setCopied: (value: boolean) => void) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <div className="mx-auto px-4" key={id}>
      <Card className="w-full rounded-3xl">
        <CardHeader className="space-y-6 rounded-t-3xl bg-[#FF6D4D] px-0 text-white">
          <CardTitle className="px-6 text-lg font-normal">
            Event Details
          </CardTitle>
          <Separator />
          <h2 className="mt-4 px-6 text-2xl font-bold capitalize">
            {eventName}
          </h2>

          <div className="mt-2 flex">
            <div className="flex items-center px-6">
              <CalendarDays className="mr-2" size={16} />
              <span>{formatDate(eventDate)}</span>
            </div>
            <div className="flex items-center">
              <Hourglass className="mr-2" size={16} />
              <span>{formatDuration(duration)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div className="w-[50%] space-y-8">
              <h3 className="text-2xl font-bold">Description</h3>
              <p className="">{eventDesc}</p>

              <div className="mb-4 space-y-4 rounded-xl border p-4">
                <div className="flex items-center">
                  <HandCoins size={20} className="mr-4" />
                  <h5 className="font-bold">Revenue</h5>
                </div>
                <p className="text-gray-600">
                  Your revenue, amplified with event.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 rounded-lg bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Total Tickets Sold</p>
                      <p>{ticketsSold ? ticketsSold : 0}</p>
                    </div>
                  </div>
                  <div className="col-span-2 rounded-lg bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Total Earnings</p>
                      <p>${ticketPrice * (ticketsSold ? ticketsSold : 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-4 space-y-4 rounded-xl border p-4">
                <div className="flex items-center">
                  <Ticket size={20} className="mr-4" />
                  <h5 className="font-bold">Ticket Details</h5>
                </div>
                <p className="text-gray-600">
                  Here&apos;s the detailed listing:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Price</p>
                      <p>${ticketPrice}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Total ticket</p>
                      <p>{totalTickets}</p>
                    </div>
                  </div>
                  <div className="col-span-2 rounded-lg bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Token Type</p>
                      <div className="flex items-center space-x-2">
                        {nativeToken === "USDC" ? (
                          <Avatar className="size-7">
                            <AvatarImage src="https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694" />
                            <AvatarFallback>USDC</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="size-7">
                            <AvatarImage src="https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756" />
                            <AvatarFallback>SOL</AvatarFallback>
                          </Avatar>
                        )}

                        <span>{nativeToken}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-[50%] flex-col justify-between pl-4 pr-0">
              <Image
                src={eventBanner}
                alt="event banner"
                width={300}
                height={300}
                className="mx-auto size-[300px] rounded-xl"
              />
              <h3 className="mb-11.5 mt-2 text-center text-muted-foreground">
                Event Banner
              </h3>
              <div className="h-full w-full space-y-4 rounded-xl border p-4">
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label
                      htmlFor="meet-link"
                      className="mb-1 flex items-center"
                    >
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
                        value={meetLink}
                        readOnly
                        onClick={() => onCopy(meetLink, setCopiedMeet)}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="h-full bg-[#808080] px-3"
                        onClick={() => onCopy(meetLink, setCopiedMeet)}
                        disabled={copiedMeet}
                      >
                        <span className="sr-only">Copy</span>
                        {copiedMeet ? <Check size={20} /> : <Copy size={20} />}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mb-2 flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label
                      htmlFor="blink-link"
                      className="mb-1 flex items-center"
                    >
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
                        value={blink}
                        readOnly
                        onClick={() => onCopy(blink, setCopiedBlink)}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="h-full bg-[#808080] px-3"
                        onClick={() => onCopy(blink, setCopiedBlink)}
                        disabled={copiedBlink}
                      >
                        <span className="sr-only">Copy</span>
                        {copiedBlink ? <Check size={20} /> : <Copy size={20} />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="space-x-6 bg-black px-6 py-6 text-sm" disabled>
              <CircleCheck size={20} />
              <span>Cancel Event</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
