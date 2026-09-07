import wordmark from "./assets/moonvine-wordmark.svg?url";
import { cn } from "@/lib/utils";

/** Scalable Figma wordmark, recolored through a mask for both report themes. */
export function ReportFooter({ className }: { className?: string }) {
  return (
    <footer
      aria-label="Moonvine"
      className={cn("relative w-full overflow-hidden", className)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 xl:py-28">
      <div className="w-full md:px-10 xl:px-[10.5rem]">
      <div
        aria-hidden="true"
        className="w-full"
        style={{ maskImage: "linear-gradient(to bottom, black, transparent)" }}
      >
        <div
          className="aspect-[3647.922/494.4] w-full bg-foreground/10"
          style={{
            maskImage: `url("${wordmark}")`,
            maskSize: "100% 100%",
            maskRepeat: "no-repeat",
          }}
        />
      </div>
      </div>
      </div>
    </footer>
  );
}
