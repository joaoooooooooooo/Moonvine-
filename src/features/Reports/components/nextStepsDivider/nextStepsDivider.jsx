import { useEffect } from "react";
import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
  useViewModelInstanceNumber,
} from "@rive-app/react-webgl2";
import moonvineOrbitSrc from "@/assets/rive files/moonvine orbit.riv?url";
import {
  getRiveBorderStrokeColor,
  getRivePointColor,
  hexToRiveColor,
} from "@/assets/rive files/riveTheme";
import { cn } from "@/lib/utils";

const ORBIT_SIZE = 1082;
const POINT_SIZE = 8;
const STROKE_THICKNESS = 0.8;

export function NextStepsDivider({ className }) {
  const { rive, RiveComponent } = useRive({
    src: moonvineOrbitSrc,
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const viewModel = useViewModel(rive, { useDefault: true });
  const viewModelInstance = useViewModelInstance(viewModel, {
    rive,
    useDefault: true,
  });

  const strokeColorBinding = useViewModelInstanceColor(
    "Stroke Color",
    viewModelInstance,
  );
  const strokeThicknessBinding = useViewModelInstanceNumber(
    "Stroke Thickness",
    viewModelInstance,
  );
  const pointSizeBinding = useViewModelInstanceNumber(
    "Point Size",
    viewModelInstance,
  );
  const pointColorBinding = useViewModelInstanceColor(
    "Point Color",
    viewModelInstance,
  );

  useEffect(() => {
    strokeThicknessBinding.setValue(STROKE_THICKNESS);
  }, [strokeThicknessBinding]);

  useEffect(() => {
    pointSizeBinding.setValue(POINT_SIZE);
  }, [pointSizeBinding]);

  useEffect(() => {
    const applyStrokeColor = () => {
      strokeColorBinding.setValue(
        hexToRiveColor(getRiveBorderStrokeColor()),
      );
    };

    applyStrokeColor();

    const observer = new MutationObserver(applyStrokeColor);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, [strokeColorBinding]);

  useEffect(() => {
    const applyPointColor = () => {
      pointColorBinding.setValue(hexToRiveColor(getRivePointColor()));
    };

    applyPointColor();

    const observer = new MutationObserver(applyPointColor);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, [pointColorBinding]);

  return (
    <div className={cn("relative flex min-h-[32rem] items-end justify-center overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="absolute opacity-80"
          style={{ height: ORBIT_SIZE, width: ORBIT_SIZE }}
        >
          <RiveComponent aria-label="Moonvine Orbit animation" />
        </div>
      </div>

      <h1 className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center text-4xl font-medium tracking-[-0.022em] text-foreground [text-wrap:balance]">
        Here is yout
        <br />
        next steps.
      </h1>
    </div>
  );
}
