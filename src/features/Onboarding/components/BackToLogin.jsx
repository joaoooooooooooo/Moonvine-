import { Button } from '@/components/ui/button'
import { ChevronLeft } from '@/components/ui/icons'

export function BackToLogin({ onClick }) {
  return <Button type="button" variant="ghost" className="self-start" onClick={onClick}>
    <ChevronLeft aria-hidden="true" />Back to login
  </Button>
}
