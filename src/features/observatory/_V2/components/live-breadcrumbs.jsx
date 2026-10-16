import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export function LiveBreadcrumbs({ items }) {
  return (
    <Breadcrumb aria-label="Breadcrumb" className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {items.map(({ label, icon: Icon }, index) => <span key={`${label}-${index}`} className="contents">
          {index > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem className="min-w-0">
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {index === items.length - 1 ? <BreadcrumbPage className="truncate">{label}</BreadcrumbPage> : <span className="truncate">{label}</span>}
          </BreadcrumbItem>
        </span>)}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
