import { motion } from "framer-motion";

export function TicketSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-5 w-24 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="flex gap-4 mt-3">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-16 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

export function TicketSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <TicketSkeleton key={i} />
      ))}
    </div>
  );
}