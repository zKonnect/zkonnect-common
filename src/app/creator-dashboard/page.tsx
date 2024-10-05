import Link from "next/link";

import { MoveRight } from "lucide-react";
import Image from "next/image";

import { constructMetaData } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import Events from "./_components/events";
import EventPage from "./event/[eventId]/page";
import Charts from "./_components/charts";
import Profile from "./_components/profile";
import CreateEvent from "./_components/create-event";

export const metadata = constructMetaData({
  title: "Dashboard | zKonnect",
  description: "Creator Dashboard of zKonnect",
});

const CreatorDashboard = () => {
  // return (
  //   <section className="mx-10 max-w-[1600px] px-6 py-6 2xl:px-2">
  //     <div className="mb-6 flex items-center justify-between pt-18">
  //       <div>
  //         <h1 className="text-xl font-bold">Hey, Michael Angelio</h1>
  //         <p className="text-gray-500">Creator</p>
  //       </div>

  //       <div className="flex flex-row gap-4">
  //         <div className="flex items-center rounded border border-gray-200 p-2">
  //           <Image
  //             src="/assets/dashboard/total-event-icon.svg"
  //             width={20}
  //             height={20}
  //             alt="total-event-icon"
  //             className="mr-2"
  //           />
  //           <p className="mr-3 text-sm text-gray-500">Total Events</p>
  //           <p className="mr-2 font-bold">50</p>
  //         </div>
  //         <div className="flex items-center rounded border border-gray-200 p-2">
  //           <Image
  //             src="/assets/dashboard/earning-icon.svg"
  //             width={20}
  //             height={20}
  //             alt="earning-icon"
  //             className="mr-2"
  //           />
  //           <p className="mr-3 text-sm text-gray-500">Earning</p>
  //           <p className="font-bold">$8,143,429</p>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="rounded-md border p-4">
  //       <div className="mb-4 flex items-center justify-between">
  //         <h2 className="text-xl font-semibold">My Events</h2>
  //         <Link href="/create-event">
  //           <Button className="space-x-6 bg-black px-5 py-5 text-sm">
  //             <span>Create event</span>
  //             <MoveRight size={20} />
  //           </Button>
  //         </Link>
  //       </div>

  //       <div className="flex gap-4">
  //         <div className="w-[25%]">
  //           <Events />
  //         </div>
  //         <div className="w-[75%]">
  //           <EventPage />
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );

  return (
    <section className="mx-10 max-w-[1600px] px-6 py-6 2xl:px-2">
      <div className="mb-6 flex items-center justify-between pt-18">
        <div>
          <h1 className="text-xl font-bold">Hey, Michael Angelio</h1>
          <p className="text-gray-500">Creator</p>
        </div>

        <div className="flex flex-row gap-4">
          <div className="flex items-center rounded border border-gray-200 p-2">
            <Image
              src="/assets/dashboard/total-event-icon.svg"
              width={20}
              height={20}
              alt="total-event-icon"
              className="mr-2"
            />
            <p className="mr-3 text-sm text-gray-500">Total Events</p>
            <p className="mr-2 font-bold">0</p>
          </div>
          <div className="flex items-center rounded border border-gray-200 p-2">
            <Image
              src="/assets/dashboard/earning-icon.svg"
              width={20}
              height={20}
              alt="earning-icon"
              className="mr-2"
            />
            <p className="mr-3 text-sm text-gray-500">Earning</p>
            <p className="font-bold">$0.00</p>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center rounded-md border p-4">
        <p className="mb-4 text-center text-xl font-semibold text-[#808080]">
          Create an Event and Deliver Unforgettable <br />
          Experiences in Real-Time! 😮‍💨
        </p>
        <p className="mb-4 text-center text-sm font-normal text-[#808080]">
          Looks like you haven't created one yet—start now to <br />
          deliver unforgettable real-time experiences!
        </p>
        <Link href="/create-event">
          <Button className="space-x-6 bg-black px-5 py-5 text-sm">
            <span>Create event</span>
            <MoveRight size={20} />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CreatorDashboard;
