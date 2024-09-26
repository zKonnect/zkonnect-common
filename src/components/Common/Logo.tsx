import Image from "next/image";

import { cn } from "@/lib/utils";

const Logo = ({ classname }: { classname?: string }) => {
  return (
    <div className={cn("flex items-center gap-x-2", classname)}>
      <Image
        src="/assets/brand-icons/logo.svg"
        height={60}
        width={60}
        alt="zkonnect-logo"
        className="size-8"
      />
      <p className="text-lg font-bold">zKonnect</p>
    </div>
  );
};

export default Logo;
