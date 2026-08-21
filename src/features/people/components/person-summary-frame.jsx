import { CopyIcon, SendIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BasicFrame,
  BasicFrameFooter,
  BasicFrameHeader,
  BasicFramePanel,
} from "@/components/shared/basic-frame";
import { PeopleDetailBreadcrumb } from "@/features/people/components/people-detail-breadcrumb";

function getInitials(value) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PersonSummaryFrame({ person }) {
  function copyAccessLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <BasicFrame className="gap-1">
      <BasicFrameHeader>
        <PeopleDetailBreadcrumb person={person} />
      </BasicFrameHeader>
      <BasicFramePanel className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-12 border bg-background text-foreground">
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {getInitials(person.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0  p-sm">
            <h1 className="truncate font-semibold text-2xl tracking-tight">
              {person.name}
            </h1>
            <p className="truncate text-muted-foreground text-sm">
              {person.email}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {person.tags.map((tag) => (
            <Badge key={tag.label} variant={tag.variant}>
              {tag.label}
            </Badge>
          ))}
        </div>
      </BasicFramePanel>

      <BasicFrameFooter className="grid grid-cols-2 gap-1 p-0">
        <Button onClick={copyAccessLink} type="button" variant="outline">
          <CopyIcon aria-hidden="true" />
          Copy access link
        </Button>
        <Button
          render={<a href={`mailto:${person.email}`} />}
          variant="outline"
        >
          <SendIcon aria-hidden="true" />
          Send access email
        </Button>
      </BasicFrameFooter>
    </BasicFrame>
  );
}
