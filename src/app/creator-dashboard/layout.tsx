import Navbar from "@/components/Common/Navbar";

const CreatorSignupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar requireLogo />
      <main className="bg-zkonnect-white-origin">{children}</main>
    </div>
  );
};

export default CreatorSignupLayout;
