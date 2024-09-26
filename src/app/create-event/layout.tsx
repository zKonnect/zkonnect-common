import Navbar from "@/components/Common/Navbar";

const CreateEventLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="h-screen bg-zkonnect-white-origin">{children}</main>
    </div>
  );
};

export default CreateEventLayout;
