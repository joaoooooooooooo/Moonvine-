import { Dialog, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogPanel, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ReportPreview({ report, onClose }) {
  return (
    <Dialog open={Boolean(report)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPopup>
        {report && <>
          <DialogHeader><DialogTitle>{report.name}</DialogTitle><DialogDescription>{report.accountName}</DialogDescription></DialogHeader>
          <DialogPanel className="space-y-5">
            <Badge variant="outline">Sample report</Badge>
            <p className="text-sm leading-6">{report.summary}</p>
            <div className="space-y-3"><h2 className="text-sm font-medium">In this report</h2><ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-muted-foreground">{report.highlights.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </DialogPanel>
          <DialogFooter><DialogClose render={<Button variant="secondary" />}>Close</DialogClose></DialogFooter>
        </>}
      </DialogPopup>
    </Dialog>
  );
}
