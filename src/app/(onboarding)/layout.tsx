import Navbar from "@/components/Common/Navbar";
import Sidebar from "./_components/sidebar";
import UpperBar from "./_components/upper-bar";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main className="flex h-screen flex-col items-center justify-center bg-zkonnect-white-origin lg:flex-row">
        <Sidebar />
        <UpperBar />
        {children}
      </main>
    </div>
  );
};

export default OnboardingLayout;
