import RiveOrbit from "@/components/rive/riveOrbit";
import { AiVisibilityCard } from "@/features/observatory/components/ai-visibility-card";

export function Observatory() {
  return (
    <section className="relative -mx-4 -mb-4 flex min-h-full flex-1 flex-col overflow-hidden px-4 md:-mx-6 md:-mb-6 md:px-6">
      <div className="relative z-10 space-y-2 pb-6">
        <h1 className="max-w-[28rem] text-2xl text-foreground">
          Prototype the main console layout with frame-based modules before wiring live data.
        </h1>
      </div>

      <div className="relative z-10 flex flex-1 items-start">
        <AiVisibilityCard />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <RiveOrbit
          className="h-122 w-full py-50 opacity-20"
          aria-label="Moonvine Orbit animation"
        />
      </div>
    </section>
  );
}
