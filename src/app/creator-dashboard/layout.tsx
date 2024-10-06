import { constructMetaData } from "@/lib/metadata";
import Navbar from "@/components/Common/Navbar";

export const metadata = constructMetaData({
  title: "Dashboard | zKonnect",
  description: "Creator Dashboard of zKonnect",
});

const CreatorDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <Navbar requireLogo />
      <main className="bg-zkonnect-white-origin">{children}</main>
    </div>
  );
};

export default CreatorDashboardLayout;
