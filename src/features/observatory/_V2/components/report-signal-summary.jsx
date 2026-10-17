import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { PanelFrameHeader, PanelFrameTitle } from '@/components/ui/panel-frame';
import { Activity, ChartNoAxesCombined, TriangleAlertIcon } from '@/components/ui/icons';
import { VibeThermometer } from '@/components/ui/vibe-thermometer';
import { MetricComparison } from './metric-comparison';
import './signals-grid.css';

export function ReportSignalSummary({ data }) {
  const items = [
    { label: 'Vibe', icon: Activity, title: data.headline, description: data.description, footer: <VibeThermometer value={data.status} /> },
    { label: 'Most visible result', icon: ChartNoAxesCombined, title: data.result, description: data.resultDescription, footer: data.metric && <div className="space-y-2"><p className="font-heading text-3xl font-normal tabular-nums tracking-tight">{data.metric.value}</p><div className="flex flex-wrap items-baseline gap-1"><p className="text-sm/normal text-foreground">{data.metric.label}</p><MetricComparison change={data.metric.change} negative={data.metric.negative} /></div></div> },
    { label: 'Priority', icon: TriangleAlertIcon, title: data.next, description: data.reason },
  ];
  return <div className="v2-signals-grid">
    <FrameCard withFill data-preview-summary className="w-full overflow-hidden">
      <FrameCardContent className="p-0!">
        <div className="grid w-full divide-y divide-border min-[740px]:grid-cols-3 min-[740px]:divide-x min-[740px]:divide-y-0">
          {items.map(({ icon: Icon, ...item }) => <section key={item.label} aria-label={item.label} className="flex min-w-0 flex-col">
            <PanelFrameHeader><Icon aria-hidden="true" className="size-4 shrink-0" /><PanelFrameTitle render={<h3 />}>{item.label}</PanelFrameTitle></PanelFrameHeader>
            <div className="flex flex-1 flex-col gap-2 p-5 text-sm/normal min-[740px]:min-h-64">
              <p className="text-base font-normal text-foreground">{item.title}</p>
              <p className="font-normal text-muted-foreground">{item.description}</p>
              {item.footer && <div className="mt-auto w-full pt-8">{item.footer}</div>}
            </div>
          </section>)}
        </div>
      </FrameCardContent>
    </FrameCard>
  </div>;
}
