import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

export function SizeControl({ label, value, min, max, onChange, description, disabled, unit = "px" }) {
  return <Field className="items-stretch gap-4" disabled={disabled}>
    <FieldLabel className="justify-between">{label}<span aria-hidden="true" className="font-normal text-muted-foreground tabular-nums">{value} {unit}</span></FieldLabel>
    <Slider aria-label={label} min={min} max={max} step={1} value={value} disabled={disabled} onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : next)} />
    {description && <FieldDescription>{description}</FieldDescription>}
  </Field>;
}
