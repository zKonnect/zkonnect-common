import Navbar from "@/components/Common/Navbar";

const EventPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar requireLogo />
      <main className="h-screen bg-zkonnect-white-origin">{children}</main>
    </div>
  );
};

export default EventPageLayout;
