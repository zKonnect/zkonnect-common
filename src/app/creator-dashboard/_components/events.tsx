"use client";

import { formatEventTime } from "@/lib/formatEventTime";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchCommand } from "@/components/ui/SearchCommand";
import { Separator } from "@/components/ui/separator";

type EventData = {
  id: string;
  roomId: string;
  eventName: string;
  eventDesc: string;
  eventBanner: string;
  eventDate: Date;
  totalTickets: number;
  ticketPrice: number;
  nativeToken: string;
  meetLink: string;
  blink: string;
  hostWalletAddress: string;
  collectionAddress: string | null;
  creatorId: string;
};

const EventItem = ({
  title,
  desc,
  startTime,
  id,
  onClick,
}: {
  title: string;
  desc: string;
  startTime: string;
  id: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="mb-3 block rounded-md p-4 hover:bg-gray-100"
      onClick={onClick}
      key={id}
    >
      <h4 className="mb-1 text-lg font-semibold">{title}</h4>
      <p className="text-gray-500">{desc}</p>
      <p className="text-sm text-gray-400">{startTime}</p>
    </div>
  );
};

const Events = ({
  events,
  onSelectEvent,
}: {
  events: EventData[] | null;
  onSelectEvent: (event: EventData) => void;
}) => {
  if (!events) return null;

  const currentTime = new Date();

  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDate) > currentTime,
  );
  const pastEvents = events.filter(
    (event) => new Date(event.eventDate) <= currentTime,
  );

  return (
    <Card className="h-full w-full border-none shadow-none outline-none">
      <CardHeader>
        <SearchCommand />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 space-x-2">
            <TabsTrigger
              value="upcoming"
              className="hover:bg-white hover:text-red-500 data-[state=active]:text-red-500"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="hover:bg-white hover:text-red-500 data-[state=active]:text-red-500"
            >
              Past
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventItem
                  key={event.id}
                  id={event.id}
                  title={event.eventName}
                  desc={event.eventDesc}
                  startTime={formatEventTime(event.eventDate)}
                  onClick={() => onSelectEvent(event)}
                />
              ))
            ) : (
              <p className="text-gray-500">No upcoming events.</p>
            )}
          </TabsContent>
          <Separator className="w-full" />
          <TabsContent value="past">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <EventItem
                  key={event.id}
                  id={event.id}
                  title={event.eventName}
                  desc={event.eventDesc}
                  startTime={formatEventTime(event.eventDate)}
                  onClick={() => onSelectEvent(event)}
                />
              ))
            ) : (
              <p className="text-gray-500">No past events.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Events;
