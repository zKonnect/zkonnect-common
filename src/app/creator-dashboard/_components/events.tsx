"use client";

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

  const upcomingEvents = events.filter(
    (event) => new Date(event.eventDate) > currentTime,
  );
  const pastEvents = events.filter(
    (event) => new Date(event.eventDate) <= currentTime,
  );

  return (
    <Card className="h-full w-full border-none shadow-none outline-none">
      <CardHeader>
        <SearchCommand events={events} onSelectEvent={onSelectEvent} />
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
              upcomingEvents.map((event, index) => (
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
                      upcomingEvents.length === index + 1 && "hidden",
                    )}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming events.</p>
            )}
          </TabsContent>
          <TabsContent value="past">
            {pastEvents.length > 0 ? (
              pastEvents.map((event, index) => (
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
                      pastEvents.length === index + 1 && "hidden",
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
