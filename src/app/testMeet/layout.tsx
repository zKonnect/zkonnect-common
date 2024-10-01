"use client";

import Navbar from "@/components/Common/Navbar";

const MeetLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-[#F7F7F7]">
      <Navbar requireLogo={true} />
      <main className="h-screen bg-[#F7F7F7]">{children}</main>
    </div>
  );
};

export default MeetLayout;
