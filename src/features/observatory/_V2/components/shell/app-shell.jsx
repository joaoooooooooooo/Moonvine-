import { useEffect, useRef } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { ChatBackground } from './chat-background';
import { ClientPeriodSwitcher } from '../client-period-switcher';
import '../page-sections.css';

// Local adaptation of the prototype Console AppShell; page routes stay inside V2.
export function AppShell({ model, children }) {
  const scrollArea = useRef(null);
  const { route } = model;
  useEffect(() => { scrollArea.current?.querySelector('[data-slot="scroll-area-viewport"]')?.scrollTo(0, 0); }, [route]);

  return (
    <div className="relative overflow-hidden">
      <SidebarProvider open={true} onOpenChange={() => {}} className="relative h-svh w-full" style={{ '--sidebar-width': '15rem' }}>
        <AppSidebar model={model} />
        <SidebarInset className="v2-shell isolate overflow-hidden bg-card">
          {route.lensId === 'intelligence:chat' && <ChatBackground />}
          <AppHeader model={model} />
          <ScrollArea ref={scrollArea} className="relative h-auto min-w-0 flex-1" overscrollContain>
            <div className="p-5 pt-8 md:p-8 md:pt-12">
              <div className={`mx-auto flex w-full ${route.lensId === 'intelligence:chat' ? 'max-w-3xl' : 'max-w-4xl'} min-w-0 flex-col gap-4`} data-v2-page-content>
                {model.account && route.lensId !== 'intelligence:chat' && <div className="min-w-0 pb-2"><ClientPeriodSwitcher account={model.account} accounts={model.accounts} route={route} /></div>}
                {children}
              </div>
            </div>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
