import competitorIcon from "@/assets/observatory-competitor-icon.svg";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EyeIcon } from "lucide-react";

const VISIBILITY_BARS = Array.from({ length: 38 }, (_, index) => index);

export function AiVisibilityCard() {
  return (
    <Card className="w-[22.375rem] max-w-full gap-2 overflow-hidden rounded-xl bg-card p-2 shadow-xs/5 before:hidden">
      <div className="flex flex-col gap-4 p-2">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <EyeIcon aria-hidden="true" className="size-5 shrink-0 text-card-foreground" />
            <h2 className="font-medium text-card-foreground text-lg tracking-[-0.01em]">
              Ai visibility
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">Description</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-1 rounded-xl pb-2">
        <div className="flex flex-col gap-4 rounded-xl bg-card p-1">
          <p className="text-3xl text-card-foreground tracking-[-0.02em]">323 +</p>

          <div
            aria-hidden="true"
            className="flex h-[1.733rem] items-center justify-between gap-[0.36rem]"
          >
            {VISIBILITY_BARS.map((bar) => (
              <span
                key={bar}
                className="h-full w-[381rem] rounded-full bg-success"
              />
            ))}
          </div>

          <Badge
            className="w-fit"
            size="lg"
            variant="success"
          >
            <img
              alt=""
              aria-hidden="true"
              className="size-3 shrink-0"
              src={competitorIcon}
            />
            <span>Competitor</span>
          </Badge>
        </div>
      </div>
    </Card>
  );
}
