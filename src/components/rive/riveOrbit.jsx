import { useEffect, useRef } from "react";
import {
  RuntimeLoader,
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
  useViewModelInstanceNumber,
} from "@rive-app/react-webgl2";
import moonvineOrbitSrc from "@/assets/rive files/moonvine orbit.riv?url";
import riveWasmUrl from "@rive-app/webgl2/rive.wasm?url";
import {
  getRiveBorderStrokeColor,
  getRivePointColor,
  getRivePointSize,
  getRiveStrokeWidth,
  hexToRiveColor,
  RIVE_STROKE_COLOR_CHANGE_EVENT,
} from "@/assets/rive files/riveTheme";

// Keep the Rive engine in the application bundle instead of relying on its CDN.
RuntimeLoader.setWasmUrl(riveWasmUrl);

function cssColorToRiveColor(color, background) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) return hexToRiveColor(getRiveBorderStrokeColor());
  context.fillStyle = background;
  context.fillRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  return (0xff000000 | (red << 16) | (green << 8) | blue) >>> 0;
}

export default function RiveOrbit({
  className,
  style,
  stateMachines = "State Machine 1",
  inheritStrokeColor = false,
  playing = true,
  ...props
}) {
  const containerRef = useRef(null);
  const { rive, RiveComponent } = useRive({
    src: moonvineOrbitSrc,
    stateMachines,
    autoplay: true,
  });
  useEffect(() => {
    if (!rive) return;
    if (playing) rive.play();
    else rive.pause();
  }, [playing, rive]);
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
  const pointColorBinding = useViewModelInstanceColor(
    "Point Color",
    viewModelInstance,
  );
  const pointSizeBinding = useViewModelInstanceNumber(
    "Point Size",
    viewModelInstance,
  );

  useEffect(() => {
    strokeWidthBinding.setValue(getRiveStrokeWidth());
    pointSizeBinding.setValue(getRivePointSize());
  }, [pointSizeBinding, strokeWidthBinding]);

  useEffect(() => {
    const applyThemeBindings = () => {
      const riveStrokeColor = inheritStrokeColor && containerRef.current
        ? cssColorToRiveColor(
          getComputedStyle(containerRef.current).color,
          getComputedStyle(containerRef.current.closest(".mv-website")).backgroundColor,
        )
        : hexToRiveColor(getRiveBorderStrokeColor());

      strokeColorBinding.setValue(riveStrokeColor);
      pointColorBinding.setValue(hexToRiveColor(getRivePointColor()));
    };

    applyThemeBindings();

    const observer = new MutationObserver(applyThemeBindings);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });
    const website = inheritStrokeColor ? containerRef.current?.closest(".mv-website") : null;
    if (website) observer.observe(website, { attributes: true, attributeFilter: ["class", "style"] });

    window.addEventListener(RIVE_STROKE_COLOR_CHANGE_EVENT, applyThemeBindings);

    return () => {
      observer.disconnect();
      window.removeEventListener(
        RIVE_STROKE_COLOR_CHANGE_EVENT,
        applyThemeBindings,
      );
    };
  }, [inheritStrokeColor, pointColorBinding, strokeColorBinding]);

  return inheritStrokeColor
    ? <div ref={containerRef} className={className} style={{ ...style, color: "var(--mv-section-line-color)" }}><RiveComponent className="size-full" {...props} /></div>
    : <RiveComponent className={className} style={style} {...props} />;
}
