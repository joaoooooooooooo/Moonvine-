import { Route } from '@/components/ui/icons';
import { EChartsPieChart } from '@/components/evilcharts/charts/echarts-pie-chart';
import { FrameCard, FrameCardContent } from '@/components/ui/frame-card';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { formatMetric } from '../../utils/observatory-model';

export function VisitorSourcesChart({ lens }) {
  const total = lens.rows.reduce((sum, [, value]) => sum + value, 0);
  const data = lens.rows.map(([label, value], index) => ({
    channel: `channel-${index}`, label, value,
    color: `var(--chart-${index + 1})`,
    share: total ? value / total * 100 : 0,
  })).sort((a, b) => b.value - a.value);
  const config = Object.fromEntries(data.map(({ channel, label, color }) => [channel, { label, colors: { light: [color], dark: [color] } }]));
  return (
    <FrameCard className="min-w-0" withFill>
      <FrameCardContent className="gap-7 p-6">
        <div className="v2-card-tagline flex items-center gap-2">
          <Route aria-hidden="true" weight="regular" className="size-4 shrink-0" />
          <h2 className="text-sm/normal font-normal">Where visitors come from</h2>
        </div>
        <div className="flex w-full min-w-0 flex-col gap-6">
          <h2 className="text-xl/normal font-normal">Where visits came from</h2>
          <div className="relative mx-auto aspect-square w-full max-w-96 [--background:var(--card)]">
            <EChartsPieChart className="h-full w-full" config={config} data={data} dataKey="value" nameKey="channel">
              <EChartsPieChart.Tooltip />
              <EChartsPieChart.Pie variant="gradient" innerRadius="62%" outerRadius="92%" cornerRadius={8} paddingAngle={4} startAngle={90} endAngle={-270} isClickable={false} />
            </EChartsPieChart>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl/normal">{formatMetric(total)}</span>
              <span className="text-xs text-muted-foreground">Total visits</span>
            </div>
          </div>
          <Table aria-label="Visits by channel" className="w-full">
            <TableBody>
            {data.map(({ channel, label, value, color, share }) => (
              <TableRow key={channel}>
                <TableCell className="whitespace-normal py-3"><span className="flex items-center gap-2">
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-sm" style={{ background: color }} />
                <span>{label}</span>
                </span></TableCell>
                <TableCell className="py-3 text-right tabular-nums text-muted-foreground">{formatMetric(value)}<span className="sr-only"> visits</span></TableCell>
                <TableCell className="py-3 text-right tabular-nums">{share.toFixed(0)}%</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      </FrameCardContent>
    </FrameCard>
  );
}
