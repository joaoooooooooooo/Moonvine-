import { ObservatorySelectTrigger as SelectTrigger } from './observatory-select-trigger';
import { useId } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectPopup, SelectValue } from '@/components/ui/select';

export function ChoiceSelect({ label, value, onChange, items }) {
  const id = useId();
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
      <Select items={items} value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label}><SelectValue /></SelectTrigger>
        <SelectPopup>{items.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectPopup>
      </Select>
    </div>
  );
}
