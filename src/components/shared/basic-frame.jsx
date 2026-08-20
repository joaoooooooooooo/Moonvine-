import {
  CardFrame,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function BasicFrame({ children, className }) {
  return <CardFrame className={cn("p-1", className)}>{children}</CardFrame>;
}

export function BasicFrameHeader({
  children,
  className,
  description,
  title,
}) {
  return (
    <CardFrameHeader className={className}>
      {children ?? (
        <>
          {title ? <CardFrameTitle>{title}</CardFrameTitle> : null}
          {description ? (
            <CardFrameDescription>{description}</CardFrameDescription>
          ) : null}
        </>
      )}
    </CardFrameHeader>
  );
}

export function BasicFramePanel({ children, className }) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-background bg-clip-padding p-5 text-card-foreground shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BasicFrameFooter({ children, className }) {
  return <CardFrameFooter className={className}>{children}</CardFrameFooter>;
}
