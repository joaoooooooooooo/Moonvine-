import { ArrowUp } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, useReducedMotion } from 'motion/react';

export function ChatComposer({ value, onChange, onSend, isReplying, embedded = false, readOnly = false, multiline = false, sendPressed = false, fullText }) {
  const reduced = useReducedMotion();
  let offset = 0;
  const stableText = fullText && value ? fullText.split(/(\s+)/).map((part, index) => {
    const shown = Math.max(0, Math.min(part.length, value.length - offset));
    offset += part.length;
    return /^\s+$/.test(part) ? part : <span key={index} style={{ whiteSpace: 'nowrap' }}>{part.slice(0, shown)}<span aria-hidden="true" style={{ visibility: 'hidden' }}>{part.slice(shown)}</span></span>;
  }) : value;
  return (
    <div className={embedded ? "pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-card via-card/95 to-transparent px-5 pb-5 pt-10" : "pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-card via-card/95 to-transparent px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-10 md:left-(--sidebar-width) md:px-8"}>
      <form className="pointer-events-auto mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full bg-primary-foreground p-3"
        onSubmit={(event) => { event.preventDefault(); onSend(); }}>
        {multiline && readOnly ? <div role="textbox" aria-readonly="true" aria-label="Message Intelligence" className="min-w-0 flex-1 whitespace-pre-wrap break-words px-2 py-1 text-base leading-6">{stableText || <span className="text-muted-foreground">Ask about your company…</span>}</div> : <Input type="text" unstyled readOnly={readOnly} className="min-w-0 flex-1" aria-label="Message Intelligence" placeholder="Ask about your company…" value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault(); }} />}
        <motion.span className="inline-flex shrink-0" animate={{ scale: sendPressed && !reduced ? [1, 0.8, 1] : 1 }} transition={{ duration: 0.25, times: [0, 0.4, 1], ease: 'easeOut' }}>
          <Button type="submit" size="icon-sm" className="rounded-full border-0 bg-foreground text-background before:rounded-full hover:bg-foreground/90" disabled={isReplying || !value.trim()} aria-label="Send message"><ArrowUp aria-hidden="true" /></Button>
        </motion.span>
      </form>
    </div>
  );
}
