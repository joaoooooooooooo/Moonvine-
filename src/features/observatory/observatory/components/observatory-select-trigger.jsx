import { SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// COSS p-select-22 styling, shared by V2 selectors.
export function ObservatorySelectTrigger({ className, ...props }) {
  return <SelectTrigger className={cn('border-transparent bg-muted shadow-none before:hidden dark:bg-muted', className)} {...props} />;
}
