export function SidebarTooltipContent({ title, children }) {
  return <div className="flex flex-col items-start gap-1 text-left text-sm">
    <span className="break-words">{title}</span>
    {children}
  </div>;
}
