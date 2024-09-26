"use-client";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

const CreateEvent = () => {
  return (
    <Card>
      <h3 className="m-3 text-lg font-semibold">Create Event</h3>
      <CardContent className="flex flex-col items-center p-6">
        <Link href="/create-event" title="Create event">
          <Image
            src="/assets/dashboard/ai-icon.svg"
            width={100}
            height={100}
            alt="Creator Profile"
            className="h-30 w-30 rounded-full"
          />
        </Link>
        <p className="mb-4 mt-2 text-center text-sm text-gray-500">
          Achieve Effortless Challenge <br />
          Creation with AI
        </p>
      </CardContent>
    </Card>
  );
};

export default CreateEvent;
