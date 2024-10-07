"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { DiamondPlus, LineChart, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Analytics from "./_components/analytics";
import Events from "./_components/events";
import DashboardSkeleton from "./_components/dashboard-skeleton";
import EventDetials from "./_components/event-details";
import { EventData } from "@/types";
import { getCreatorData } from "@/actions";

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
  const router = useRouter();

  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [events, setEvents] = useState<EventData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
  };

  const fetchCreatorData = async () => {
    if (!wallet.publicKey) {
      toast.error("Please connect your wallet");
      router.push("/");
      return;
    }
    try {
      setIsLoading(true);
      const response = await getCreatorData(wallet.publicKey.toString());
      if (response) {
        const { Events, ...creatorDetails } = response;
        setCreatorData(creatorDetails);
        if (response.isVerified === false) {
          toast.error("Please verify your account");
          router.push("/creator-signup/verification");
          return;
        }
        if (response?.Events) {
          setEvents(Events);
          setSelectedEvent(Events[0]);
        } else {
          setEvents(null);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
    if (
      wallet.connected &&
      session.status === "authenticated" &&
      session.data.user.name
    ) {
      fetchCreatorData();
    }
  }, [wallet.connected, session.status]);

  const totalEarnings = useMemo(() => {
    if (!events) return 0;
    return events.reduce((acc, event) => {
      return (
        acc + (event.ticketsSold ? event.ticketsSold : 0) * event.ticketPrice
      );
    }, 0);
  }, [events]);
  const toggleView = () => {
    setShowAnalytics(!showAnalytics);
  };

  if (isLoading) {
    return (
      <section className="flex h-full items-center py-6 2xl:px-2">
        <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col items-center px-6 2xl:px-2">
          <DashboardSkeleton />
        </div>
      </section>
    );
  }

  if (!creatorData) {
    return (
      <section className="flex h-full items-center py-6 2xl:px-2">
        <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col items-center px-6 pt-18 2xl:px-2">
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
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full items-center py-6 2xl:px-2">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col items-center px-6 2xl:px-2">
        <div className="mb-6 flex w-full items-center justify-between pt-18">
          <h1 className="text-xl font-bold">Hey, {creatorData.creatorName}</h1>

          <div className="flex flex-row gap-4">
            <div className="flex items-center rounded-lg p-2">
              <Image
                src="/assets/dashboard/total-event-icon.svg"
                width={20}
                height={20}
                alt="total-event-icon"
                className="mr-2"
              />
              <p className="mr-3 text-sm text-muted-foreground">Total Events</p>
              <p className="mr-2 font-bold text-muted-foreground">
                {events !== null ? events.length : 0}
              </p>
            </div>
            <span className="p-2 text-muted-foreground">|</span>
            <div className="flex items-center rounded-lg p-2">
              <Image
                src="/assets/dashboard/earning-icon.svg"
                width={20}
                height={20}
                alt="earning-icon"
                className="mr-2"
              />
              <p className="mr-3 text-sm text-muted-foreground">Earning</p>
              <p className="font-bold text-muted-foreground">
                ${totalEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {events !== null && events.length > 0 ? (
          <div className="w-full rounded-xl border py-4">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-semibold">
                {showAnalytics ? "Analytics" : "My Events"}
              </h2>
              <div className="space-x-2">
                <Button
                  onClick={toggleView}
                  className="space-x-2 bg-muted px-5 py-5 text-sm text-black transition-all duration-500 hover:bg-black hover:text-white"
                >
                  {showAnalytics ? (
                    <>
                      <Ticket size={20} />
                      <span>My Events</span>
                    </>
                  ) : (
                    <>
                      <LineChart size={20} />
                      <span>View Analytics</span>
                    </>
                  )}
                </Button>
                <Link href="/create-event">
                  <Button className="space-x-2 bg-muted px-5 py-5 text-sm text-black transition-all duration-500 hover:bg-black hover:text-white">
                    <DiamondPlus size={20} />
                    <span>Create event</span>
                  </Button>
                </Link>
              </div>
            </div>

            <Separator className="my-4 w-full" />

            <div className="flex w-full justify-between gap-2 px-4">
              {showAnalytics ? (
                <Analytics />
              ) : (
                <>
                  <div className="w-[30%]">
                    <Events
                      events={events}
                      onSelectEvent={handleSelectEvent}
                      selectedEvent={selectedEvent}
                    />
                  </div>
                  <Separator orientation="vertical" className="h-full w-0.5" />
                  <div className="w-[70%]">
                    {selectedEvent && <EventDetials {...selectedEvent} />}
                  </div>
                </>
              )}
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
