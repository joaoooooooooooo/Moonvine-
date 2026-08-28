import { useMemo } from "react";
import { getStatusListItemVariant } from "@/features/Reports/components/status-list/lib/status-list-item";

export function useStatusListItem({ variant }) {
  return useMemo(() => getStatusListItemVariant(variant), [variant]);
}
