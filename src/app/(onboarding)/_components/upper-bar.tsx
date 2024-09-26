"use client";

import { usePathname } from "next/navigation";

import { BadgeCheck, CircleUserRound, Rocket } from "lucide-react";

import { cn } from "@/lib/utils";

const UpperBar = () => {
  const pathUrl = usePathname();

  const isGetStarted = pathUrl.includes("get-started");

  return (
    <div className="mt-32 flex items-center space-x-16 lg:hidden">
      <div
        className={cn(
          "relative flex w-full items-center space-x-4",
          pathUrl.includes("verification") && "font-medium text-black",
          isGetStarted && "text-black",
        )}
      >
        <div className="rounded-md bg-[#F7F7F7] p-2">
          <CircleUserRound size={24} />
        </div>
        <div className="absolute left-[60px] h-[68px] -translate-x-1/2 rotate-90 transform border-l-2 border-dotted border-gray-400" />
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
        <div className="rounded-md bg-[#F7F7F7] p-2">
          <BadgeCheck size={24} />
        </div>
        <div className="absolute left-[60px] h-[68px] -translate-x-1/2 rotate-90 transform border-l-2 border-dotted border-gray-400" />
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
        <div className="rounded-md bg-[#F7F7F7] p-2">
          <Rocket size={24} />
        </div>
      </div>
    </div>
  );
};

export default UpperBar;
