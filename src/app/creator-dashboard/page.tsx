"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { DiamondPlus } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Events from "./_components/events";
import EventDetials from "./_components/event-details";
import { getCreatorData } from "@/actions";
import { EventData } from "@/types";

type CreatorData = {
  id: string;
  creatorName: string;
  walletAddress: string;
  domainOfExpertise: string;
  eventsInaYear: number;
  noOfFollowers: number;
  isVerified: boolean;
};

const CreatorDashboard = () => {
  const wallet = useWallet();
  const session = useSession();

  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [events, setEvents] = useState<EventData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const handleSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
  };

  const fetchCreatorData = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    try {
      const response = await getCreatorData(wallet.publicKey.toString());
      if (response) {
        const { Events, ...creatorDetails } = response;
        setCreatorData(creatorDetails);
        if (response?.Events) {
          setEvents(Events);
          setSelectedEvent(Events[0]);
        } else {
          setEvents(null);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      wallet.connected &&
      session.status === "authenticated" &&
      session.data.user.name
    ) {
      fetchCreatorData();
    }
  }, [wallet.connected]);

  const totalEarnings = useMemo(() => {
    if (!events) return 0;
    return events.reduce((acc, event) => {
      return (
        acc + (event.ticketsSold ? event.ticketsSold : 0) * event.ticketPrice
      );
    }, 0);
  }, [events]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4">
        Loading
      </div>
    );
  }

  if (!creatorData) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4">
        No data available
      </div>
    );
  }

  return (
    <section className="flex h-full items-center py-6 2xl:px-2">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col items-center px-6 2xl:px-2">
        <div className="mb-6 flex w-full items-center justify-between pt-18">
          <h1 className="text-xl font-bold">Hey, {creatorData.creatorName}</h1>

          <div className="flex flex-row gap-4">
            <div className="flex items-center rounded-lg border border-gray-200 p-2">
              <Image
                src="/assets/dashboard/total-event-icon.svg"
                width={20}
                height={20}
                alt="total-event-icon"
                className="mr-2"
              />
              <p className="mr-3 text-sm text-gray-500">Total Events</p>
              <p className="mr-2 font-bold">
                {events !== null ? events.length : 0}
              </p>
            </div>
            <div className="flex items-center rounded-lg border border-gray-200 p-2">
              <Image
                src="/assets/dashboard/earning-icon.svg"
                width={20}
                height={20}
                alt="earning-icon"
                className="mr-2"
              />
              <p className="mr-3 text-sm text-gray-500">Earning</p>
              <p className="font-bold">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {events !== null && events.length > 0 ? (
          <div className="w-full rounded-xl border py-4">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-semibold">My Events</h2>
              <Link href="/create-event">
                <Button className="space-x-2 bg-muted px-5 py-5 text-sm text-black transition-all duration-500 hover:bg-black hover:text-white">
                  <DiamondPlus size={20} />
                  <span>Create event</span>
                </Button>
              </Link>
            </div>

            <Separator className="my-4 w-full" />

            <div className="flex w-full justify-between gap-2 px-4">
              <div className="w-[30%]">
                <Events
                  events={events}
                  onSelectEvent={handleSelectEvent}
                  selectedEvent={selectedEvent}
                />
              </div>
              <Separator orientation="vertical" className="h-full w-0.5" />
              <div className="w-[70%]">
                {selectedEvent && (
                  <EventDetials
                    id={selectedEvent.id}
                    blink={selectedEvent.blink}
                    collectionAddress={selectedEvent.collectionAddress}
                    creatorId={selectedEvent.creatorId}
                    eventName={selectedEvent.eventName}
                    eventDesc={selectedEvent.eventDesc}
                    eventBanner={selectedEvent.eventBanner}
                    eventDate={selectedEvent.eventDate}
                    hostWalletAddress={selectedEvent.hostWalletAddress}
                    meetLink={selectedEvent.meetLink}
                    nativeToken={selectedEvent.nativeToken}
                    roomId={selectedEvent.roomId}
                    ticketPrice={selectedEvent.ticketPrice}
                    totalTickets={selectedEvent.totalTickets}
                    ticketsSold={selectedEvent.ticketsSold}
                    duration={selectedEvent.duration}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center rounded-xl border p-4">
            <p className="mb-4 text-center text-xl font-semibold text-[#808080]">
              Create an Event and Deliver Unforgettable <br />
              Experiences in Real-Time! 😮‍💨
            </p>
            <p className="mb-4 text-center text-sm font-normal text-[#808080]">
              Looks like you haven&apos;t created one yet—start now to <br />
              deliver unforgettable real-time experiences!
            </p>
            <Link href="/create-event">
              <Button className="space-x-2 bg-black px-5 py-5 text-sm text-white transition-all duration-500 hover:bg-primary/80">
                <DiamondPlus size={20} />
                <span>Create event</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreatorDashboard;
