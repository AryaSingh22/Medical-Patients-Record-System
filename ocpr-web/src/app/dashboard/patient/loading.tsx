import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Skeleton className="h-8 w-56" />
        <div className="flex gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Skeleton className="h-56" />
        <Skeleton className="h-56 md:col-span-2" />
      </div>
    </div>
  );
}
