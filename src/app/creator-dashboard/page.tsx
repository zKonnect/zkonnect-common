import Link from "next/link";

import { DiamondPlus, MoveRight } from "lucide-react";
import Image from "next/image";

import { constructMetaData } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import Events from "./_components/events";
import EventPage from "./event/[eventId]/page";
import Charts from "./_components/charts";
import Profile from "./_components/profile";
import CreateEvent from "./_components/create-event";
import { Separator } from "@/components/ui/separator";

export const metadata = constructMetaData({
  title: "Dashboard | zKonnect",
  description: "Creator Dashboard of zKonnect",
});

const CreatorDashboard = () => {
  // return (
  //   <section className="mx-10 flex h-full items-center px-6 py-6 2xl:px-2">
  //     <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col items-center">
  //       <div className="mb-6 flex w-full items-center justify-between pt-18">
  //         <div>
  //           <h1 className="text-xl font-bold">Hey, Michael Angelio</h1>
  //           <p className="text-gray-500">Creator</p>
  //         </div>

  //         <div className="flex flex-row gap-4">
  //           <div className="flex items-center rounded border border-gray-200 p-2">
  //             <Image
  //               src="/assets/dashboard/total-event-icon.svg"
  //               width={20}
  //               height={20}
  //               alt="total-event-icon"
  //               className="mr-2"
  //             />
  //             <p className="mr-3 text-sm text-gray-500">Total Events</p>
  //             <p className="mr-2 font-bold">50</p>
  //           </div>
  //           <div className="flex items-center rounded border border-gray-200 p-2">
  //             <Image
  //               src="/assets/dashboard/earning-icon.svg"
  //               width={20}
  //               height={20}
  //               alt="earning-icon"
  //               className="mr-2"
  //             />
  //             <p className="mr-3 text-sm text-gray-500">Earning</p>
  //             <p className="font-bold">$8,143,429</p>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="w-full rounded-md border py-4">
  //         <div className="flex items-center justify-between px-4">
  //           <h2 className="text-xl font-semibold">My Events</h2>
  //           <Link href="/create-event">
  //             <Button className="space-x-6 bg-muted px-5 py-5 text-sm text-black transition-all duration-500 hover:bg-black hover:text-white">
  //               <DiamondPlus size={20} />
  //               <span>Create event</span>
  //             </Button>
  //           </Link>
  //         </div>

  //         <Separator className="my-4 w-full" />

  //         <div className="flex gap-2 px-4">
  //           <div className="w-[25%]">
  //             <Events />
  //           </div>
  //           <Separator orientation="vertical" className="h-full w-0.5" />
  //           <div className="w-[75%]">
  //             <EventPage />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </section>
  // );

  return (
    <section className="mx-10 flex h-full items-center px-6 py-6 2xl:px-2">
      <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col items-center">
        <div className="mb-6 flex w-full items-center justify-between pt-18">
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

        <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center rounded-md border p-4">
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
};

export default CreatorDashboard;
