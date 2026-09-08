import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getRiveBorderStrokeColor,
  RIVE_STROKE_COLOR_CHANGE_EVENT,
  setRiveBorderStrokeColorOverride,
} from "@/assets/rive files/riveTheme";

export function RiveStrokeDebug() {
  const id = useId();
  const [color, setColor] = useState(getRiveBorderStrokeColor);

  useEffect(() => {
    const syncColor = () => setColor(getRiveBorderStrokeColor());
    const observer = new MutationObserver(syncColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener(RIVE_STROKE_COLOR_CHANGE_EVENT, syncColor);
    syncColor();
    return () => {
      observer.disconnect();
      window.removeEventListener(RIVE_STROKE_COLOR_CHANGE_EVENT, syncColor);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm font-medium">Rive stroke color</label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={color}
          onChange={(event) => setRiveBorderStrokeColorOverride(event.target.value)}
          className="h-9 w-12 cursor-pointer rounded-md border border-input bg-background p-1 focus-visible:outline-2 focus-visible:outline-ring"
        />
        <output htmlFor={id} className="font-mono text-sm">{color.toUpperCase()}</output>
        <Button className="ml-auto" size="sm" variant="outline" onClick={() => setRiveBorderStrokeColorOverride(null)}>
          Reset to theme
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Updates all Rive strokes live. Resets on page reload.</p>
    </div>
  );
}
