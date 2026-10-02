import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export function LiveBreadcrumbs({ account, route, current }) {
  return (
    <Breadcrumb aria-label="Breadcrumb" className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {(account || current !== 'Observatory') && <><BreadcrumbItem><span>{route.lensId === 'intelligence:chat' ? 'Chat' : account ? 'Intelligence' : 'Observatory'}</span></BreadcrumbItem><BreadcrumbSeparator /></>}
        {current && <BreadcrumbItem className="min-w-0"><BreadcrumbPage className="truncate">{current}</BreadcrumbPage></BreadcrumbItem>}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
