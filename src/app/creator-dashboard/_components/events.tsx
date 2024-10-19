"use client";

import React from "react";

import { formatEventTime } from "@/lib/formatEventTime";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchCommand } from "@/components/ui/SearchCommand";
import { Separator } from "@/components/ui/separator";
import { EventData } from "@/types";

const EventItem = ({
  title,
  startTime,
  id,
  onClick,
  isSelected,
}: {
  title: string;
  startTime: string;
  id: string;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <div
      className={cn(
        "block cursor-pointer rounded-lg p-4 transition-all duration-500 hover:bg-muted",
        isSelected && "bg-muted",
      )}
      onClick={onClick}
      key={id}
    >
      <h4 className="mb-1 text-lg font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{startTime}</p>
    </div>
  );
};

const Events = ({
  events,
  onSelectEvent,
  selectedEvent,
}: {
  events: EventData[] | null;
  onSelectEvent: (event: EventData) => void;
  selectedEvent: EventData | null;
}) => {
  if (!events) return null;

  const currentTime = new Date();

  const categorizeEvents = (events: EventData[]) => {
    return events.reduce(
      (acc, event) => {
        const startTime = new Date(event.eventDate);
        const endTime = new Date(startTime.getTime() + event.duration * 60000);

        if (currentTime < startTime) {
          acc.upcoming.push(event);
        } else if (currentTime >= startTime && currentTime <= endTime) {
          acc.ongoing.push(event);
        } else {
          acc.past.push(event);
        }

        return acc;
      },
      {
        upcoming: [] as EventData[],
        ongoing: [] as EventData[],
        past: [] as EventData[],
      },
    );
  };

  const { upcoming, ongoing, past } = categorizeEvents(events);

  return (
    <Card className="h-full w-full border-none shadow-none outline-none">
      <CardHeader>
        <SearchCommand events={events} onSelectEvent={onSelectEvent} />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 space-x-2">
            <TabsTrigger
              value="ongoing"
              className="hover:bg-white hover:text-red-500 data-[state=active]:text-red-500"
            >
              Ongoing
            </TabsTrigger>
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
          <TabsContent value="ongoing">
            {ongoing.length > 0 ? (
              ongoing.map((event, index) => (
                <div key={event.id}>
                  <EventItem
                    id={event.id}
                    title={event.eventName}
                    startTime={formatEventTime(event.eventDate)}
                    onClick={() => onSelectEvent(event)}
                    isSelected={selectedEvent?.id === event.id}
                  />
                  <Separator
                    className={cn(
                      "my-2 w-full",
                      ongoing.length === index + 1 && "hidden",
                    )}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No ongoing events.</p>
            )}
          </TabsContent>
          <TabsContent value="upcoming">
            {upcoming.length > 0 ? (
              upcoming.map((event, index) => (
                <div key={event.id}>
                  <EventItem
                    id={event.id}
                    title={event.eventName}
                    startTime={formatEventTime(event.eventDate)}
                    onClick={() => onSelectEvent(event)}
                    isSelected={selectedEvent?.id === event.id}
                  />
                  <Separator
                    className={cn(
                      "my-2 w-full",
                      upcoming.length === index + 1 && "hidden",
                    )}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events.</p>
            )}
          </TabsContent>
          <TabsContent value="past">
            {past.length > 0 ? (
              past.map((event, index) => (
                <div key={event.id}>
                  <EventItem
                    id={event.id}
                    title={event.eventName}
                    startTime={formatEventTime(event.eventDate)}
                    onClick={() => onSelectEvent(event)}
                    isSelected={selectedEvent?.id === event.id}
                  />
                  <Separator
                    className={cn(
                      "my-2 w-full",
                      past.length === index + 1 && "hidden",
                    )}
                  />
                </div>
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
