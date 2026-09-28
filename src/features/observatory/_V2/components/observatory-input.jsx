import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// COSS p-input-15, composed locally without changing the shared primitive.
export function ObservatoryInput({ className, ...props }) {
  return <Input className={cn('border-transparent bg-muted shadow-none before:hidden dark:bg-muted', className)} {...props} />;
}
