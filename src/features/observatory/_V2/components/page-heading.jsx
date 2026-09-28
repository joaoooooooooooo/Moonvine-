// Match the prototype's regular-weight Geist page headings.
export function PageHeading({ title, aside }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
      <div className="min-w-0 space-y-1.5">
        <h1 className="max-w-[32rem] font-heading text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">{title}</h1>
      </div>
      {aside}
    </div>
  );
}
