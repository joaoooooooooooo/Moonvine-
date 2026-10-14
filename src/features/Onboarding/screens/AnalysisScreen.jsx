import { useEffect, useRef, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { TaskSteps } from '@/components/interior/task-steps'
import { Button } from '@/components/ui/button'
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress'
import { StepHeading } from '../components/StepHeading'
import { StepLayout } from '../components/StepLayout'

const steps = [
  { id: 'signals', label: 'Gather your signals' },
  { id: 'competitors', label: 'Analyze your competitors and prompts' },
  { id: 'comparison', label: 'Prepare your comparison' },
]

export function AnalysisScreen({ workspace, onComplete, onBack }) {
  const [current, setCurrent] = useState(0)
  const completeRef = useRef(onComplete)
  useEffect(() => { completeRef.current = onComplete }, [onComplete])
  useEffect(() => {
    // Timed prototype sequence; replace with analysis job events when connected.
    const timers = [
      window.setTimeout(() => setCurrent(1), 2400),
      window.setTimeout(() => setCurrent(2), 4800),
      window.setTimeout(() => setCurrent(3), 7200),
      window.setTimeout(() => completeRef.current(), 8200),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [])

  return <StepLayout actions={<><Button type="button" variant="ghost" size="lg" onClick={onBack}><ChevronLeft aria-hidden="true" />Back</Button><Button type="button" size="lg" disabled>Continue</Button></>}>
    <StepHeading title="Preparing your AI search snapshot" description={<>Reviewing the prompts and competitors for {workspace.name || 'your workspace'}.</>} />
    <div className="onboarding-analysis flex flex-col gap-8">
      <Progress aria-label="Analysis progress" value={current / steps.length * 100}>
        <ProgressTrack><ProgressIndicator className="h-full motion-reduce:transition-none" /></ProgressTrack>
      </Progress>
      <TaskSteps steps={steps} current={current} label="Competitor analysis" className="onboarding-analysis-steps" />
    </div>
  </StepLayout>
}
