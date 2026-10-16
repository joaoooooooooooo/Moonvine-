"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type React from "react";
import { cn } from "@/lib/utils";

export function PanelFrame({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "relative flex flex-col overflow-hidden rounded-md border border-border/64 bg-card text-card-foreground shadow-xs/5 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:border-border dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
      className,
    ),
    "data-slot": "panel-frame",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export function PanelFrameHeader({
  className,
  render,
  ...props
}: useRender.ComponentProps<"header">): React.ReactElement {
  const defaultProps = {
    className: cn(
      "flex min-h-12 items-center gap-2 border-b border-border/64 bg-muted/72 px-4 py-3 text-muted-foreground dark:border-border",
      className,
    ),
    "data-slot": "panel-frame-header",
  };

  return useRender({
    defaultTagName: "header",
    props: mergeProps<"header">(defaultProps, props),
    render,
  });
}

export function PanelFrameTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("font-normal text-sm/normal", className),
    "data-slot": "panel-frame-title",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export function PanelFrameContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">): React.ReactElement {
  const defaultProps = {
    className: cn("relative flex flex-1 flex-col", className),
    "data-slot": "panel-frame-content",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}
