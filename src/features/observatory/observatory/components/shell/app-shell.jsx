import { useEffect, useRef, useState } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';
import { ReportWeekPicker } from '../report-week-picker';
import '../page-sections.css';
import { GuidedTour } from '../guided-tour/guided-tour';

// Local adaptation of the prototype Console AppShell; page routes stay inside V2.
export function AppShell({ model, children }) {
  const scrollArea = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { route } = model;
  const isChatPage = route.lensId === 'intelligence:chat';
  const isHomeChat = route.path === '/console' && !isChatPage;
  const isIntelligencePage = route.path.startsWith('/intelligence/') || route.lensId?.startsWith('intelligence:');
  useEffect(() => { scrollArea.current?.querySelector('[data-slot="scroll-area-viewport"]')?.scrollTo(0, 0); }, [route]);

  return (
    <div className="relative overflow-hidden">
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} className="relative h-svh w-full bg-sidebar" style={{ '--sidebar-width': '17rem', '--sidebar-width-icon': '3.25rem' }}>
        <AppSidebar model={model} />
        <SidebarInset className="v2-shell isolate overflow-hidden bg-background md:my-3 md:me-3 md:rounded-2xl md:border md:border-border md:shadow-sm/5">
          <AppHeader model={model} />
          <ScrollArea ref={scrollArea} className="relative h-auto min-w-0 flex-1" overscrollContain>
            <div className="p-5 pt-8 md:p-8 md:pt-12">
              <div className={`mx-auto flex w-full ${isChatPage || isHomeChat ? 'max-w-5xl' : isIntelligencePage ? 'max-w-6xl' : 'max-w-7xl'} min-w-0 flex-col gap-4`} data-v2-page-content>
                {!route.mapMode && model.account && route.lensId !== 'intelligence:chat' && route.path !== '/console/reports' && <div className="min-w-0 pb-2"><ReportWeekPicker account={model.account} route={route} /></div>}
                {children}
              </div>
            </div>
          </ScrollArea>
        </SidebarInset>
        {!route.mapMode && <GuidedTour model={model} />}
      </SidebarProvider>
    </div>
  );
}
