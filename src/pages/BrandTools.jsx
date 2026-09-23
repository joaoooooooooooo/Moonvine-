import { useLayoutEffect } from "react";
import { lazy, Suspense } from "react";
import { LayoutTemplateIcon, QuoteIcon } from "lucide-react";
import { Command, CommandCollection, CommandEmpty, CommandGroup, CommandGroupLabel, CommandInput, CommandItem, CommandList, CommandPanel, CommandSurface } from "@/components/ui/command";
import { useCurrentConsolePath } from "@/features/console/components/app-shared";
import { CitationEditor } from "@/features/brand-tools/CitationEditor";

const PostEditor = lazy(() => import("@/features/brand-tools/PostEditor"));
const tools = [
  { value: "citation", label: "Citation template", href: "#/brand-tools/citation", icon: QuoteIcon },
  { value: "post", label: "Post template", href: "#/brand-tools/post", icon: LayoutTemplateIcon },
];

export function BrandTools() {
  const path = useCurrentConsolePath();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.add("dark");
    return () => { root.classList.toggle("dark", wasDark); };
  }, []);

  if (path === "#/brand-tools/post") {
    return <main aria-label="Post editor" className="min-h-svh bg-background text-foreground">
      <Suspense fallback={<p className="p-6 text-sm text-muted-foreground">Loading post tools…</p>}><PostEditor /></Suspense>
    </main>;
  }

  if (path === "#/brand-tools/citation") {
    return <main aria-label="Citation editor" className="min-h-svh bg-background text-foreground">
      <CitationEditor />
    </main>;
  }

  return <main aria-label="Moonvine brand tools" className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4 py-12 text-foreground">
    <h1 className="report-heading-large w-full max-w-xl text-[2.5rem]/11 font-semibold tracking-[-0.022em] text-foreground [text-wrap:balance]">Tools for creating Moonvine social content</h1>
    <CommandSurface>
      <Command items={tools}>
        <CommandInput aria-label="Search brand tools" placeholder="Type a command or search..." />
        <CommandPanel>
          <CommandEmpty>No tools found. Try “citation” or “post”.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandGroupLabel>Brand tools</CommandGroupLabel>
              <CommandCollection>{(item) => <CommandItem key={item.value} value={item.value} onClick={() => { window.location.hash = item.href; }}>
                <item.icon aria-hidden="true" className="opacity-60" size={16} />
                <span>{item.label}</span>
              </CommandItem>}</CommandCollection>
            </CommandGroup>
          </CommandList>
        </CommandPanel>
      </Command>
    </CommandSurface>
  </main>;
}
