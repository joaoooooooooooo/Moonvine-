import { cn } from "@/lib/utils";

export function SectionHeading({ className, title }) {
  return (
    <div
      className={cn(
        "relative left-1/2 w-screen -translate-x-1/2 border-y border-border bg-background",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="px-0 py-5 md:px-10 xl:px-[10.5rem]">
          <h3 className="text-sm leading-tight font-semibold text-muted-foreground uppercase [text-wrap:balance]">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
