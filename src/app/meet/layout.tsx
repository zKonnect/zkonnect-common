"use client";

import Navbar from "@/components/Common/Navbar";
import { HuddleClient, HuddleProvider } from "@huddle01/react";

const MeetLayout = ({ children }: { children: React.ReactNode }) => {
  const huddleClient = new HuddleClient({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  });
  return (
    <HuddleProvider client={huddleClient}>
      <div className="h-full bg-zkonnect-white-origin">
        <Navbar requireLogo={true} requireLogin={false} />
        <main className="h-screen bg-zkonnect-white-origin">{children}</main>
      </div>
    </HuddleProvider>
  );
};

export default MeetLayout;
