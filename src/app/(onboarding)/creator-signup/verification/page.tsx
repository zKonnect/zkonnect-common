import { constructMetaData } from "@/lib/metadata";
import ProvidersComponent from "./_components/provider";

export const metadata = constructMetaData({
  title: "Creator Verification | zKonnect",
  description: "This is the creator verification of zKonnect",
});

const VerificationPage = () => {
  return (
    <section className="flex h-screen flex-col items-center px-6 pt-10 lg:pt-48">
      <div className="relative flex min-h-[400px] flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-8">
          <h1 className="w-full text-start text-2xl font-bold text-black lg:text-center lg:text-3xl">
            Connect with your social account <br />
            for verification
          </h1>
          <p className="w-full text-start text-sm text-muted-foreground lg:text-center">
            Note: Your account will be verified only if your social <br />{" "}
            follower count is 250+ (this threshold will increase later)
          </p>
          <ProvidersComponent />
        </div>
      </div>
    </section>
  );
};

export default VerificationPage;
