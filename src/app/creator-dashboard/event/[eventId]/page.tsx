"use client";

import { Copy, CalendarIcon, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface EventPageProps {
  params: {
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
  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="w-full">
        <CardHeader className="bg-[#FF6D4D] text-white">
          <CardTitle className="text-md">Event Details</CardTitle>
          <Separator />
          <h2 className="mt-4 text-4xl font-bold">{params.title}</h2>
          <div className="mt-2 flex items-center">
            <CalendarIcon className="mr-2" />
            <span>Starts on {params.startTime}</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div className="w-2/3">
              <h3 className="mb-4 text-2xl font-bold">Description</h3>
              <p className="mb-8">{params.desc}</p>

              <h3 className="mb-2 text-xl font-bold">Ticket Details</h3>
              <p className="mb-2 text-gray-600">
                Here&apos;s the detailed listing:
              </p>
              <div className="mb-8 grid grid-cols-3 gap-4">
                <div>
                  <p className="font-bold">Price</p>
                  <p>{params.price}</p>
                </div>
                <div>
                  <p className="font-bold">Total ticket</p>
                  <p>{params.totalTickets}</p>
                </div>
                <div>
                  <p className="font-bold">Token Type</p>
                  <p>{params.tokenType}</p>
                </div>
              </div>

              <h3 className="mb-2 text-xl font-bold">Meeting Link</h3>
              <div className="mb-4 flex items-center">
                <Input value={params.meetingLink} readOnly />
                <Button variant="outline" size="icon" className="ml-2">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <h3 className="mb-2 text-xl font-bold">Blink</h3>
              <div className="flex items-center">
                <Input value={params.blinkLink} readOnly />
                <Button variant="outline" size="icon" className="ml-2">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="w-1/3">
              <h3 className="mb-4 text-2xl font-bold">Event Banner</h3>
              <div className="w-54 h-64 rounded-lg bg-[#FF6D4D]"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button className="space-x-6 bg-black px-6 py-6 text-sm">
          <CircleCheck size={20} />
          <span>Cancel Event</span>
        </Button>
      </div>
    </div>
  );
}
