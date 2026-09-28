import { useEffect, useRef } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';

// Local adaptation of the prototype Console AppShell; page routes stay inside V2.
export function AppShell({ model, children }) {
  const scrollArea = useRef(null);
  const { route } = model;
  useEffect(() => { scrollArea.current?.querySelector('[data-slot="scroll-area-viewport"]')?.scrollTo(0, 0); }, [route]);

  return (
    <div className="relative overflow-hidden">
      <SidebarProvider open={true} onOpenChange={() => {}} className="relative h-svh w-full" style={{ '--sidebar-width': '14rem' }}>
        <AppSidebar model={model} />
        <SidebarInset className="bg-card">
          <AppHeader model={model} />
          <ScrollArea ref={scrollArea} className="h-auto min-w-0 flex-1" overscrollContain>
            <div className="flex min-w-0 flex-col gap-4 p-5 md:p-8" data-v2-page-content>
              {children}
            </div>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
