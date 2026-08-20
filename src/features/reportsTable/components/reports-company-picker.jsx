"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getInitials(value) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ReportsCompanyPicker({
  companies,
  onValueChange,
  value,
}) {
  const visibleCompanies = companies.slice(0, 2);

  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger
        aria-label="Filter companies"
        className="min-h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        size="sm"
      >
        <SelectValue placeholder="Company">
          {(selectedValue) =>
            selectedValue ? (
              <span className="flex min-w-0 items-center gap-2">
                <Avatar className="size-5 border border-border bg-background">
                  <AvatarFallback className="bg-muted text-[10px] font-medium text-foreground">
                    {getInitials(selectedValue)}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{selectedValue}</span>
              </span>
            ) : (
              <span className="flex min-w-0 items-center gap-2">
                <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
                <span className="truncate">Company</span>
              </span>
            )
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="[&_[data-slot=select-item]]:grid-cols-[1fr] [&_[data-slot=select-item]]:gap-0 [&_[data-slot=select-item]]:pe-2 [&_[data-slot=select-item-indicator]]:hidden [&_[data-slot=select-item-text]]:col-start-1">
        <SelectItem value="all">
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex size-5 items-center justify-center text-muted-foreground">
              <CheckIcon className="size-3.5" />
            </span>
            <span className="truncate">All companies</span>
          </span>
        </SelectItem>
        {visibleCompanies.map((company) => (
          <SelectItem key={company} value={company}>
            <span className="flex min-w-0 items-center gap-2">
              <Avatar className="size-5 border border-border bg-background">
                <AvatarFallback className="bg-muted text-[10px] font-medium text-foreground">
                  {getInitials(company)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{company}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
