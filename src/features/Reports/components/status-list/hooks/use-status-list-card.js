import { useMemo } from "react";
import { getStatusListCardCount } from "@/features/Reports/components/status-list/lib/status-list-card";

export function useStatusListCard({ items }) {
  return useMemo(
    () => ({
      count: getStatusListCardCount(items),
    }),
    [items],
  );
}
