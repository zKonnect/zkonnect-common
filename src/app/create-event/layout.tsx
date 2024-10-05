import { constructMetaData } from "@/lib/metadata";
import Navbar from "@/components/Common/Navbar";

export const metadata = constructMetaData({
  title: "Create Event | zKonnect",
  description: "This is the create event page of zKonnect",
});

const CreateEventLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-screen bg-zkonnect-white-origin">{children}</main>
    </div>
  );
};

export default CreateEventLayout;
