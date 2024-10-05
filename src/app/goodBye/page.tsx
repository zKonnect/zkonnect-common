import Image from "next/image";

import { constructMetaData } from "@/lib/metadata";

export const metadata = constructMetaData({
  title: "Thanks | zKonnect",
  description: "This is the Goodbye Page for zKonnect",
});

const Page = () => {
  return (
    <main>
      <section className="flex h-screen flex-col items-center justify-center space-y-8">
        <Image
          src="/assets/brand-icons/logo.svg"
          alt="zkonnect-logo"
          width={300}
          height={300}
          className="size-16"
        />
        <h1 className="text-center text-2xl font-bold text-black lg:text-3xl">
          Thanks for Coming! <br />
          The Best Times Are <br />
          Yet Ahead!
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          We&apos;re sending virtual high-fives your way! 🖐🏻
        </p>
      </section>
    </main>
  );
};

export default Page;
