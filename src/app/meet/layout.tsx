"use client";

import { HuddleClient, HuddleProvider } from "@huddle01/react";

import Navbar from "@/components/Common/Navbar";

const MeetLayout = ({ children }: { children: React.ReactNode }) => {
  const huddleClient = new HuddleClient({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  });
  return (
    <HuddleProvider client={huddleClient}>
      <div className="h-full bg-[#F7F7F7]">
        <Navbar requireLogo={true} />
        <main className="h-screen bg-[#F7F7F7]">{children}</main>
      </div>
    </HuddleProvider>
  );
};

export default MeetLayout;
