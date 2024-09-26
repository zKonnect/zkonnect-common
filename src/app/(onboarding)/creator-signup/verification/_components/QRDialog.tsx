import Image from "next/image";

import QRCode from "react-qr-code";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function QRDialog({
  children,
  requestUrl,
  providerImage,
  isOpen,
  setIsOpen,
}: {
  children?: React.ReactNode;
  requestUrl: any;
  providerImage: string;
  isOpen: boolean | undefined;
  setIsOpen: (value: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[90%] rounded-lg bg-[#F7F7F7] outline outline-[0.2px] outline-zkonnect-gray sm:max-w-[480px]">
        <DialogHeader className="flow-col flex items-center justify-center space-x-4 sm:flex-row sm:items-start">
          <Image
            src={`/assets/provider/${providerImage}`}
            alt="logo"
            className=""
            width={48}
            height={48}
          />
          <div className="space-y-2">
            <DialogTitle className="mx-auto font-medium text-black dark:text-white">
              LinkedIn Followers Proof
            </DialogTitle>
            <DialogDescription className="pb-4 text-xs text-muted-foreground">
              Scan the below qr code in order <br /> to verify.
            </DialogDescription>
          </div>
        </DialogHeader>
        {requestUrl && (
          <QRCode
            value={requestUrl}
            className="mx-auto mb-4 rounded-lg bg-white p-4.5"
          />
        )}
        <div className="mx-auto mb-4">
          <p className="text-xs text-muted-foreground">
            <u>Note:</u> Ensure proper lighting and steady positioning <br />{" "}
            when scanning QR codes for optimal recognition.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
