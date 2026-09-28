import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ClientPeriodSwitcher } from './client-period-switcher';

export function LiveBreadcrumbs({ account, accounts, route, current }) {
  return (
    <Breadcrumb aria-label="Breadcrumb" className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {(account || current !== 'Observatory') && <><BreadcrumbItem className="hidden sm:inline-flex"><BreadcrumbLink href="#/console">Observatory</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator className="hidden sm:block" /></>}
        {account && <>
          <BreadcrumbItem className="min-w-0"><ClientPeriodSwitcher account={account} accounts={accounts} route={route} /></BreadcrumbItem>
          {current && <BreadcrumbSeparator className="hidden md:block" />}
        </>}
        {current && <BreadcrumbItem className={account ? 'hidden min-w-0 md:inline-flex' : 'min-w-0'}><BreadcrumbPage className="truncate">{current}</BreadcrumbPage></BreadcrumbItem>}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
