import { people } from "@/features/people/config/people-data";
import { PeopleList } from "@/features/people/pages/people-list";
import { PersonDetails } from "@/features/people/pages/person-details";
import { useCurrentConsolePath } from "@/features/console/components/app-shared";

export function People() {
  const currentPath = useCurrentConsolePath();
  const personId = currentPath.match(/^#\/people\/([^/]+)$/)?.[1];

  if (!personId) {
    return <PeopleList />;
  }

  const person = people.find((item) => item.id === personId);
  return <PersonDetails person={person} />;
}
