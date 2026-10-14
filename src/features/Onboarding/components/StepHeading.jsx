export function StepHeading({ title, description }) {
  return <header className="w-full space-y-2 pb-4">
      <h1 tabIndex={-1} className="text-3xl font-medium tracking-tight outline-none">{title}</h1>
      <p className="text-base text-muted-foreground">{description}</p>
  </header>
}
