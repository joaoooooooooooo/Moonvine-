import 'flag-icons/css/flag-icons.min.css';
import { Globe } from '@/components/ui/icons';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { EChartsPieChart } from '@/components/evilcharts/charts/echarts-pie-chart';

export function SourceDistributionCard({ title, rows, unit = 'visits', icon: Icon, donut = false }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const data = rows.map((row, index) => ({ ...row, key: `item-${index}`, color: `var(--chart-${index % 5 + 1})` }));
  const config = Object.fromEntries(data.map((row) => [row.key, { label: row.label, colors: { light: [row.color], dark: [row.color] } }]));
  return <FrameCard className="h-full min-w-0" withFill>
    <FrameCardContent className="h-full gap-6 p-6">
      <div className="v2-card-tagline flex items-center gap-2"><Icon aria-hidden="true" weight="regular" className="size-4 shrink-0" /><h3 className="text-sm/normal font-normal">{title}</h3></div>
      {donut && <div className="relative mx-auto aspect-square w-full max-w-56 [--background:var(--card)]">
        <EChartsPieChart className="h-full w-full" config={config} data={data} dataKey="value" nameKey="key">
          <EChartsPieChart.Tooltip />
          <EChartsPieChart.Pie innerRadius="70%" outerRadius="94%" paddingAngle={3} cornerRadius={4} isClickable={false} />
        </EChartsPieChart>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl tabular-nums">{total.toLocaleString('en-US')}</span><span className="text-sm text-muted-foreground">{unit}</span></div>
      </div>}
      <ol className="flex w-full flex-col gap-4" aria-label={title}>
        {data.map((row) => <li key={row.key} className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm/normal"><span className="flex items-center gap-2">{!donut ? (row.countryCode ? <span aria-hidden="true" className={`fi fi-${row.countryCode} shrink-0 overflow-hidden rounded-[3px] text-xs`} /> : <Globe aria-hidden="true" className="size-4 text-muted-foreground" />) : <span aria-hidden="true" className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: row.color }} />}{row.label}</span><span className="tabular-nums">{row.value.toLocaleString('en-US')} <span className="text-muted-foreground">· {total ? Math.round(row.value / total * 100) : 0}%</span></span></div>
          {!donut && <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden="true"><div className="h-full rounded-full" style={{ width: `${total ? row.value / total * 100 : 0}%`, backgroundColor: 'var(--foreground)' }} /></div>}
        </li>)}
      </ol>
    </FrameCardContent>
  </FrameCard>;
}
