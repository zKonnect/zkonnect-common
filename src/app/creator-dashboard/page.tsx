import Link from "next/link";

import { MoveRight } from "lucide-react";

import { constructMetaData } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import Events from "./_components/events";
import Charts from "./_components/charts";
import Profile from "./_components/profile";
import CreateEvent from "./_components/create-event";

export const metadata = constructMetaData({
  title: "Dashboard | zKonnect",
  description: "Creator Dashboard of zKonnect",
});

const CreatorDashboardPage = () => {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-6 2xl:px-0">
      <div className="mb-6 mt-24 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Dashboard</h1>
        <Link href="/create-event">
          <Button className="space-x-6 bg-black px-5 py-5 text-sm">
            <span>Create event</span>
            <MoveRight size={20} />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Profile />
            <CreateEvent />
          </div>
          <div className="mt-4">
            <Charts />
          </div>
        </div>
        <div className="lg:col-span-1">
          <Events />
        </div>
      </div>
    </section>
  );
};

export default CreatorDashboardPage;
