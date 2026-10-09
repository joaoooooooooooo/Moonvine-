import { ObservatoryTable } from '../observatory/_V2/components/observatory-table'
import { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'

const rows = [
  { metric: 'Search clicks', change: '+6.8%', positive: true, action: 'Build on the pages bringing qualified traffic.' },
  { metric: 'Conversion rate', change: '−9.1%', positive: false, action: 'Improve the offer and proof on 3 landing pages.' },
  { metric: 'Social engagement', change: '−12.4%', positive: false, action: 'Set a consistent weekly publishing cadence.' },
]

export function MeetingRecap() {
  return <div className="movi-meeting-recap">
    <p className="font-medium">This week’s meeting brief</p>
    <ObservatoryTable label="Meeting brief: weekly changes and next actions">
      <TableHeader><TableRow><TableHead>Signal</TableHead><TableHead>Change</TableHead><TableHead>Next action</TableHead></TableRow></TableHeader>
      <TableBody>{rows.map(row => <TableRow key={row.metric}>
        <TableCell>{row.metric}</TableCell>
        <TableCell><span className={row.positive ? 'font-medium text-success-foreground' : 'font-medium text-destructive-foreground'}>{row.change}</span></TableCell>
        <TableCell>{row.action}</TableCell>
      </TableRow>)}</TableBody>
    </ObservatoryTable>
  </div>
}
