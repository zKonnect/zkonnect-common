import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex w-full flex-col space-y-4 pt-18">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-[150px] lg:w-[250px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[50px] lg:w-[100px]" />
          <Skeleton className="h-10 w-[50px] lg:w-[100px]" />
        </div>
      </div>
      <Skeleton className="h-[300px] w-full rounded-lg lg:h-[500px]" />
    </div>
  );
}
