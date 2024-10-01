"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import Logo from "@/components/Common/Logo";
import WalletConnectButton from "@/components/Wallet/wallet-connect-button";
import { useScrollTop } from "@/hooks/use-scroll-top";

const Navbar = ({ requireLogin = true }: { requireLogin?: boolean }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const scrolled = useScrollTop();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-[99999] flex w-full items-center px-6 py-3 2xl:px-2",
        scrolled && "border-b bg-zkonnect-white-origin shadow-sm",
      )}
      ref={menuRef}
    >
      <div className="mt-4">
        <Logo classname="h-12 w-20" />
      </div>
      <div className="mx-auto flex w-full max-w-[1600px]">
        <div className="flex w-full items-center justify-end gap-x-2 md:ml-auto">
          <div className="mt-4 flex justify-center">
            <input
              type="text"
              className="h-[40px] w-full rounded-md border border-gray-300 bg-white p-2"
              placeholder="Search"
            />
          </div>
          {requireLogin && <WalletConnectButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
