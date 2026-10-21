import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogPanel, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@/components/ui/form';
import { PanelFrame, PanelFrameHeader, PanelFrameTitle, PanelFrameContent } from '@/components/ui/panel-frame';
import { toastManager } from '@/components/ui/toast';
import { PageHeading } from './page-heading';

export function PromptsDataSourcePage({ workspace, onSave }) {
  const prompts = workspace?.prompts ?? [];
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const nextPrompts = [...new Set(draft.split('\n').map((line) => line.trim()).filter(Boolean))];
  const changed = JSON.stringify(nextPrompts) !== JSON.stringify(prompts);
  return <div className="v2-page-sections">
    <div className="space-y-2"><PageHeading title="Prompts" /><p className="max-w-[36ch] text-base leading-6 text-muted-foreground">Choose the questions you want to track across AI tools.</p></div>
    <PanelFrame>
      <PanelFrameHeader><PanelFrameTitle render={<h2 />}>Tracked prompts</PanelFrameTitle></PanelFrameHeader>
      <PanelFrameContent>
        <div className="space-y-5 p-5">
          {prompts.length ? <ul className="divide-y divide-border">{prompts.map((prompt) => <li key={prompt} className="py-3 text-sm first:pt-0 last:pb-0">{prompt}</li>)}</ul> : <p className="text-sm text-muted-foreground">No prompts added yet.</p>}
          <Dialog open={open} onOpenChange={(next) => { if (next) setDraft(prompts.join('\n')); setOpen(next); }}>
            <DialogTrigger render={<Button />}>Edit prompts</DialogTrigger>
            <DialogPopup className="overflow-hidden rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:max-w-md">
              <DialogHeader><DialogTitle>Edit prompts</DialogTitle><DialogDescription>Add one question per line.</DialogDescription></DialogHeader>
              <Form className="contents" onSubmit={(event) => {
                event.preventDefault();
                if (!changed || !nextPrompts.length) return;
                onSave(workspace.id, { prompts: nextPrompts });
                setOpen(false);
                const toastId = toastManager.add({ title: 'Prompts updated', type: 'success', actionProps: { children: 'Undo', onClick: () => { onSave(workspace.id, { prompts }); toastManager.close(toastId); } } });
              }}>
                <DialogPanel><Field name="prompts"><FieldLabel>Questions</FieldLabel><Textarea autoFocus required unstyled className="rounded-md bg-muted focus-within:ring-2 focus-within:ring-ring" rows={6} value={draft} onChange={(event) => setDraft(event.target.value)} /><FieldDescription>Use the questions your customers would ask about your organization or category.</FieldDescription></Field></DialogPanel>
                <DialogFooter className="sm:justify-start sm:rounded-b-[calc(var(--radius-md)-1px)]"><Button type="submit" disabled={!changed || !nextPrompts.length}>Save changes</Button><DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose></DialogFooter>
              </Form>
            </DialogPopup>
          </Dialog>
        </div>
      </PanelFrameContent>
    </PanelFrame>
  </div>;
}
