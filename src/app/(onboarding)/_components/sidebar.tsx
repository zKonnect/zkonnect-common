"use client";

import { usePathname } from "next/navigation";

import { BadgeCheck, CircleUserRound, Rocket } from "lucide-react";

import { cn } from "@/lib/utils";
import Logo from "@/components/Common/Logo";

const Sidebar = () => {
  const pathUrl = usePathname();

  const isGetStarted = pathUrl.includes("get-started");

  return (
    <div className="fixed left-0 top-0 hidden h-full w-72 flex-col items-center bg-[#F7F7F7] lg:flex">
      <div className="mt-4 w-full px-4">
        <Logo classname="h-12 w-20" />
      </div>

      <div className="mt-32 flex flex-col items-center space-y-16">
        <div
          className={cn(
            "relative flex w-full items-center space-x-4",
            pathUrl.includes("verification") && "font-medium text-black",
            isGetStarted && "text-black",
          )}
        >
          <div className="rounded-md bg-white p-2">
            <CircleUserRound size={24} />
          </div>
          <div>
            <h3 className="font-semibold">Creator details</h3>
            <p className="text-sm text-muted-foreground">
              Enter your Creator details
            </p>
          </div>
          <div className="absolute left-[4px] top-10 h-[68px] -translate-x-1/2 transform border-l-2 border-dotted border-gray-400" />
        </div>
        <div
          className={cn(
            "relative flex w-full items-center space-x-4",
            pathUrl.includes("verification")
              ? "font-medium text-black"
              : "text-[#808080]",
            isGetStarted && "text-black",
          )}
        >
          <div className="rounded-md bg-white p-2">
            <BadgeCheck size={24} />
          </div>
          <div>
            <h3 className="font-semibold">Verification</h3>
            <p className="text-sm text-muted-foreground">
              Verify yourself as Creator
            </p>
          </div>
          <div className="absolute left-[4px] top-10 h-[68px] -translate-x-1/2 transform border-l-2 border-dotted border-gray-400" />
        </div>
        <div
          className={cn(
            "relative flex w-full items-center space-x-4",
            pathUrl.includes("get-started")
              ? "font-medium text-black"
              : "text-[#808080]",
            isGetStarted && "text-black",
          )}
        >
          <div className="rounded-md bg-white p-2">
            <Rocket size={24} />
          </div>
          <div>
            <h3 className="font-semibold">Get Started!</h3>
            <p className="text-sm text-muted-foreground">
              Start Creating Amazing Events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
