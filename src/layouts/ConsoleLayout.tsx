import { CreateProjectFrameCard } from "@/features/console/components/create-project-frame-card";
import { RootLayout } from "@/layouts/RootLayout";
import {
  BlocksIcon,
  FingerprintIcon,
  NetworkIcon,
  SatelliteDishIcon,
  ShieldUserIcon,
  UsersIcon,
} from "lucide-react";

const cards = [
  {
    icon: NetworkIcon,
    title: "Accounts",
    description: "Customers and prospects you watch here. 12 accounts.",
  },
  {
    icon: SatelliteDishIcon,
    title: "Reports",
    description: "Published reports, shared links, and delivery checks.",
  },
  {
    icon: UsersIcon,
    title: "People",
    description: "People with Account access, report recipients, and monitored people. 28 people.",
  },
  {
    icon: BlocksIcon,
    title: "Entities",
    description: "Accounts and watched entities in scope. 12 entities.",
  },
  {
    icon: FingerprintIcon,
    title: "Settings",
    description: "Team access, source connections, and report delivery.",
  },
  {
    icon: ShieldUserIcon,
    title: "Super Admin",
    description: "Operator tools for accounts, commerce, reports, sources, plugins, and system health.",
  },
];

export function ConsoleLayout() {
  return (
    <RootLayout>
      <section className="mx-auto flex w-full max-w-[824px] flex-col gap-8">
        <h1 className="max-w-[324px] text-3xl font-semibold tracking-tight text-foreground">
          Good morning, your latest report is available, check it out
        </h1>

        <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CreateProjectFrameCard
              key={card.title}
              description={card.description}
              icon={card.icon}
              title={card.title}
            />
          ))}
        </div>
      </section>
    </RootLayout>
  );
}
