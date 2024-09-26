"use-client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

const Profile = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6">
        <Image
          src="/assets/dashboard/creator-profile.svg"
          width={100}
          height={100}
          alt="Creator Profile"
          className="h-20 w-20 rounded-full"
        />
        <h2 className="mt-4 text-xl font-semibold">Michael Angelio</h2>
        <p className="text-sm text-gray-500">Creator</p>
      </CardContent>
    </Card>
  );
};

export default Profile;
