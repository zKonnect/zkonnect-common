"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleCheck, MoveRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import Image from "next/image";
import { CalendarIcon, LinkIcon, EyeIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface EventPageProps {
  params?: {
    eventId: string;
    title: string;
    desc: string;
    startTime: string;
    bannerUrl: string;
    price: number;
    totalTickets: number;
    tokenType: string;
    meetingLink: string;
    blinkLink: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  const [copiedBlink, setCopiedBlink] = useState<boolean>(false);
  const [copiedMeet, setCopiedMeet] = useState<boolean>(false);
  const [blinkUrl, setBlinkUrl] = useState<string>(
    "https://zkonnect.blinks.com/event",
  );
  const [meetUrl, setMeetUrl] = useState<string>(
    "https://zkonnect.meet.com/id",
  );

  const onCopy = (url: string, setCopied: (value: boolean) => void) => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <div className="mx-auto px-4">
      <Card className="w-full rounded-3xl">
        <CardHeader className="space-y-6 rounded-t-3xl bg-[#FF6D4D] px-0 text-white">
          <CardTitle className="px-6 font-normal">Event Details</CardTitle>
          <Separator />
          <h2 className="mt-4 px-6 text-3xl font-bold">Event title</h2>
          {/* <h2 className="mt-4 text-4xl font-bold">{params.title}</h2> */}
          <div className="mt-2 flex items-center px-6">
            <CalendarIcon className="mr-2" />
            <span>Starts on 12:00 a.m.</span>
            {/* <span>Starts on {params.startTime}</span> */}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div className="w-2/3">
              <h3 className="mb-4 text-2xl font-bold">Description</h3>
              <p className="mb-8">Event description.</p>
              {/* <p className="mb-8">{params.desc}</p> */}

              <div className="mb-4 rounded-lg border p-4">
                <div className="mb-4 flex items-center">
                  <Image
                    src="/assets/dashboard/ticket-icon.svg"
                    width={20}
                    height={20}
                    alt="ticket-icon"
                    className="mr-4"
                  />
                  <h5 className="font-bold">Ticket Details</h5>
                </div>
                <p className="mb-4 text-gray-600">
                  Here&apos;s the detailed listing:
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Price</p>
                      <p>200</p>
                      {/* <p>{params.price}200</p> */}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Total ticket</p>
                      <p> 50</p>
                      {/* <p>{params.totalTickets} 50</p> */}
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#F8F8F8] p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Token Type</p>
                      <div className="flex items-center space-x-2">
                        <Avatar className="size-7">
                          <AvatarImage src="https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756" />
                          <AvatarFallback>SOL</AvatarFallback>
                        </Avatar>
                        <span>SOL</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full gap-2 rounded-lg border p-2">
                <div className="mb-2 flex items-center space-x-2">
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
                        value={meetUrl}
                        readOnly
                        onClick={() => onCopy(meetUrl, setCopiedMeet)}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="h-full bg-[#808080] px-3"
                        onClick={() => onCopy(meetUrl, setCopiedMeet)}
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
                        value={blinkUrl}
                        readOnly
                        onClick={() => onCopy(blinkUrl, setCopiedBlink)}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="h-full bg-[#808080] px-3"
                        onClick={() => onCopy(blinkUrl, setCopiedBlink)}
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

            <div className="w-fit p-3 pr-0">
              <div className="size-[300px] rounded-lg bg-[#FF6D4D]"></div>
              <h3 className="mt-2 text-center text-muted-foreground">
                Event Banner
              </h3>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="space-x-6 bg-black px-6 py-6 text-sm">
              <CircleCheck size={20} />
              <span>Cancel Event</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
