import { UserRoundIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { people } from "@/features/people/config/people-data";

const personOptions = people.map((person) => ({
  label: person.name,
  value: person.id,
}));

export function PeopleDetailBreadcrumb({ person }) {
  function handlePersonChange(personId) {
    window.location.hash = `/people/${personId}`;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="#/people" />}>People</BreadcrumbLink>
        </BreadcrumbItem>

        {person ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Select
                aria-label="Select person"
                items={personOptions}
                onValueChange={handlePersonChange}
                value={person.id}
              >
                <SelectTrigger className="w-fit min-w-0" size="sm">
                  <UserRoundIcon aria-hidden="true" />
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {personOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
