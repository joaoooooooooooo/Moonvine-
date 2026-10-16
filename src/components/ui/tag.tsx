"use client";

import type React from "react";
import { cn } from "@/lib/utils";

export function Tag({
  className,
  ...props
}: React.ComponentProps<"span">): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-[calc(var(--radius-md)-1px)] bg-accent px-2.5 font-medium text-accent-foreground text-sm sm:min-h-6",
        className,
      )}
      data-slot="tag"
      {...props}
    />
  );
}
