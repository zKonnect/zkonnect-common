import Link from "next/link";
import Image from "next/image";

import { MoveRight } from "lucide-react";

import { constructMetaData } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

export const metadata = constructMetaData({
  title: "Creator Get-Started | zKonnect",
  description: "This is the creator get-started of zKonnect",
});

const getStartedPage = () => {
  return (
    <section className="flex h-screen flex-col items-center px-6 pt-10 lg:pt-48">
      <div className="flex min-h-[400px] flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-center space-y-4 lg:space-y-8">
          <h1 className="w-full text-start text-2xl font-bold text-black lg:text-center lg:text-3xl">
            Welcome, Creator <br />
            Let&apos;s Make Magic Happen! ✨
          </h1>
          <p className="text-start text-sm text-muted-foreground lg:text-center lg:leading-3">
            We&apos;re thrilled to have you here, Let&apos;s get started on{" "}
            <span className="hidden lg:block">
              <br />
            </span>
            creating something amazing!{" ;)"}
          </p>
          <Image
            src="/assets/get-started_bg.svg"
            alt="get-stareted bg"
            width={338}
            height={338}
            className="size-[240px] lg:size-[300px]"
          />
          <Link
            href="/creator-dashboard"
            className="w-full items-center justify-between lg:w-[180px]"
          >
            <Button className="w-full space-x-2 bg-black px-7 py-6 text-sm lg:space-x-6">
              <span>Get Started</span>
              <MoveRight size={30} className="size-6" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default getStartedPage;
