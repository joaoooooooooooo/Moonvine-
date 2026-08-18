import { Card, CardPanel } from "@/components/ui/card";
import { ArrowUpRightIcon } from "lucide-react";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FrameTitle,
} from "@/components/ui/frame";

export function CreateProjectFrameCard({
  description = "Published reports, shared links, and delivery checks.",
  icon: Icon,
  title = "Reports",
}) {
  return (
    <Frame className="h-full w-full gap-0">
      <Card className="h-full w-full cursor-pointer transition-colors hover:bg-accent/10">
        <CardPanel className="flex h-full flex-col items-start gap-4 p-6">
          {Icon ? (
            <div className="flex size-10 items-center justify-center text-foreground">
              <Icon aria-hidden="true" className="size-7 shrink-0" strokeWidth={1}/>
            </div>
          ) : null}
          <FrameHeader className="flex-1 w-full gap-1.5 p-0" >
            <FrameTitle>{title}</FrameTitle>
            <FrameDescription className="flex items-center justify-between gap-2">
              <span>{description}</span>
             
            </FrameDescription>
          </FrameHeader>
        </CardPanel>
      </Card>
    </Frame>
  );
}
