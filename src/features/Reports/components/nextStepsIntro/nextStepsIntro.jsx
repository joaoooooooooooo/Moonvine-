import { useEffect, useRef } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
  useViewModelInstanceNumber,
} from "@rive-app/react-webgl2";
import moonvineStepperSrc from "@/assets/rive files/moonvine_stepper.riv?url";
import {
  getRiveBorderStrokeColor,
  getRiveStrokeWidth,
  hexToRiveColor,
} from "@/assets/rive files/riveTheme";
import { cn } from "@/lib/utils";

const STEPPER_LAYOUT = new Layout({
  alignment: Alignment.BottomRight,
  fit: Fit.Contain,
});
const STEPPER_SIZE = 874;

export function NextStepsIntro({ children, className }) {
  const containerRef = useRef(null);
  const hasTriggeredAnimation = useRef(false);
  const { rive, RiveComponent } = useRive({
    layout: STEPPER_LAYOUT,
    src: moonvineStepperSrc,
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
  const strokeWidthBinding = useViewModelInstanceNumber(
    "Stroke Thickness",
    viewModelInstance,
  );

  useEffect(() => {
    strokeWidthBinding.setValue(getRiveStrokeWidth());
  }, [strokeWidthBinding]);

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
    const container = containerRef.current;

    if (!container || hasTriggeredAnimation.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTriggeredAnimation.current) {
          return;
        }

        viewModelInstance.trigger("animationStart")?.trigger();
        hasTriggeredAnimation.current = true;
        observer.disconnect();
      },
      { threshold: 0.25 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [viewModelInstance]);

  return (
    <div
      className={cn(
        "relative isolate block min-h-[30rem] overflow-hidden md:flex md:min-h-[35rem] md:items-center xl:min-h-[39rem]",
        className,
      )}
      ref={containerRef}
    >
      {children}
      <div
        className="pointer-events-none relative mx-auto mt-8 aspect-square w-full max-w-[var(--stepper-size)] md:absolute md:right-0 md:bottom-0 md:mt-0 md:ml-0 md:size-[var(--stepper-size)]"
        style={{ "--stepper-size": `${STEPPER_SIZE}px` }}
      >
        <RiveComponent
          aria-label="Moonvine next steps animation"
          className="size-full"
        />
      </div>
    </div>
  );
}
