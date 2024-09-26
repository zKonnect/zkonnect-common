"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventItem = ({
  title,
  desc,
  startTime,
  id,
}: {
  title: string;
  desc: string;
  startTime: string;
  id: string;
}) => {
  return (
    <Link
      href={`/creator-dashboard/event/${id}`}
      className="mb-3 block rounded-md border p-4 hover:bg-gray-100"
    >
      <h4 className="mb-1 text-lg font-semibold">{title}</h4>
      <p className="text-gray-500">{desc}</p>
      <p className="text-sm text-gray-400">{startTime}</p>
    </Link>
  );
};

const Events = () => {
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>My Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 space-x-2">
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
            <TabsTrigger
              value="drafts"
              className="hover:bg-white hover:text-red-500 data-[state=active]:text-red-500"
            >
              Drafts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <EventItem
              id="1"
              title="Event1"
              desc="Desc"
              startTime="Starts in 16h 32min"
            />
          </TabsContent>
          <TabsContent value="past">
            <EventItem
              id="2"
              title="Event2"
              desc="Desc"
              startTime="Ended 2 days ago"
            />
          </TabsContent>
          <TabsContent value="drafts">
            <EventItem id="3" title="Event3" desc="Desc" startTime="Draft" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Events;
