import { CopyButton } from "@/components/shared/copy-button";
import {
  FrameCard,
  FrameCardContent,
  FrameCardTop,
} from "@/components/ui/frame-card";
import { cn } from "@/lib/utils";

export function TaskCard({
  className,
  description,
  fixPrompt,
  title,
}) {
  return (
    <FrameCard className={cn("w-full", className)} withFill>
      <FrameCardContent className="min-h-64 justify-between gap-6 shadow-none before:shadow-none">
        <div className="mt-auto flex w-full flex-col gap-3">
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-warning"
          />
          <h3 className="text-xl leading-7 font-medium tracking-[-0.01em] text-foreground [text-wrap:balance]">
            {title}
          </h3>
          <p className="text-sm leading-5 text-muted-foreground [text-wrap:pretty]">
            {description}
          </p>
        </div>
      </FrameCardContent>

      <FrameCardTop className="h-auto p-1">
        <CopyButton
          className="w-full"
          copiedLabel="Fix prompt copied"
          label="Copy fix prompt"
          text={fixPrompt}
          variant="secondary"
        />
      </FrameCardTop>
    </FrameCard>
  );
}
