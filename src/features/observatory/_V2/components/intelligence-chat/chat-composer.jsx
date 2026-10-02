import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ChatComposer({ value, onChange, onSend, isReplying }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-card via-card/95 to-transparent px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10 md:left-(--sidebar-width) md:px-8">
      <form className="pointer-events-auto mx-auto flex w-full max-w-4xl items-center gap-2 rounded-full bg-primary-foreground p-3"
        onSubmit={(event) => { event.preventDefault(); onSend(); }}>
        <Input type="text" unstyled className="min-w-0 flex-1" aria-label="Message Intelligence" placeholder="Ask about your company…" value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault(); }} />
        <Button type="submit" size="icon-sm" className="rounded-full border-0 bg-foreground text-background before:rounded-full hover:bg-foreground/90" disabled={isReplying || !value.trim()} aria-label="Send message"><ArrowUp aria-hidden="true" /></Button>
      </form>
    </div>
  );
}
