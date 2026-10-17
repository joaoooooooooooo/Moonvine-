import { useEffect, useRef, useState } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { ChatBackground } from './chat-background';
import { ReportWeekPicker } from '../report-week-picker';
import { SetupProgressCard } from './setup-progress-card';
import '../page-sections.css';

// Local adaptation of the prototype Console AppShell; page routes stay inside V2.
export function AppShell({ model, children }) {
  const scrollArea = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { route } = model;
  const inlineSetup = ['source:ga4', 'source:ga4-2', 'source:gsc', 'source:news-media'].includes(route.lensId);
  useEffect(() => { scrollArea.current?.querySelector('[data-slot="scroll-area-viewport"]')?.scrollTo(0, 0); }, [route]);

  return (
    <div className="relative overflow-hidden">
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} className="relative h-svh w-full bg-primary-foreground dark:bg-card" style={{ '--sidebar-width': '17rem', '--sidebar-width-icon': '3.25rem' }}>
        <AppSidebar model={model} />
        <SidebarInset className="v2-shell isolate overflow-hidden bg-background md:my-3 md:me-3 md:rounded-2xl md:border md:border-border md:shadow-sm/5">
          {route.lensId === 'intelligence:chat' && <ChatBackground />}
          <AppHeader model={model} />
          <ScrollArea ref={scrollArea} className="relative h-auto min-w-0 flex-1" overscrollContain>
            <div className="p-5 pt-8 md:p-8 md:pt-12">
              <div className={`mx-auto flex w-full ${route.lensId === 'intelligence:chat' ? 'max-w-3xl' : 'max-w-4xl'} min-w-0 flex-col gap-4`} data-v2-page-content>
                {model.account && route.lensId !== 'intelligence:chat' && route.path !== '/console/reports' && <div className="min-w-0 pb-2"><ReportWeekPicker account={model.account} route={route} /></div>}
                {children}
              </div>
            </div>
            <div className={inlineSetup ? 'mx-auto mb-8 w-full max-w-72 px-5' : 'fixed right-4 bottom-4 z-40 w-[calc(100%-2rem)] max-w-72 max-md:static max-md:mx-auto max-md:mb-5 max-md:mt-8 max-md:w-full'}>
              <SetupProgressCard />
            </div>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
