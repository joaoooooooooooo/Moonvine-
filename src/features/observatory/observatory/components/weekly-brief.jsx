import { FileText, ChevronRight } from '@/components/ui/icons';
import { accountHref } from '../utils/observatory-model';
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { SourceIcon } from './source-icon';
import { Button } from '@/components/ui/button';

export function WeeklyBrief({ account }) {
  return (
    <Card>
      <CardHeader className="items-center gap-x-4 p-5">
        <div className="flex items-center gap-4">
          <SourceIcon icon={FileText} className="size-10" />
          <div className="space-y-1">
            <CardTitle render={<h2 />} className="text-base font-medium leading-6">Your weekly brief</CardTitle>
            <CardDescription className="max-w-xl leading-5">View the latest weekly report and previous updates.</CardDescription>
          </div>
        </div>
        <CardAction className="self-center"><Button render={<a href={accountHref(account.id, 'report:history')} />} variant="ghost" size="icon" aria-label="View weekly reports"><ChevronRight /></Button></CardAction>
      </CardHeader>
    </Card>
  );
}
