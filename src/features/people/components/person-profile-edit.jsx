import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  BasicFrame,
  BasicFrameFooter,
  BasicFrameHeader,
  BasicFramePanel,
} from "@/components/shared/basic-frame";

function getInitialProfile(person) {
  return {
    company: person.companies.join(", "),
    email: person.email,
    linkedin: person.linkedin ?? "",
    name: person.name,
    title: person.title ?? "",
    website: person.website ?? "",
  };
}

export function PersonProfileEdit({ person }) {
  const initialProfile = getInitialProfile(person);
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const formId = `person-profile-form-${person.id}`;
  const hasChanges = Object.keys(profile).some(
    (key) => profile[key] !== savedProfile[key],
  );

  function updateProfile(field, value) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSavedProfile(profile);
  }

  const fields = [
    { label: "Name", name: "name", required: true, type: "text" },
    { label: "Email", name: "email", required: true, type: "email" },
    { label: "Title", name: "title", type: "text" },
    { label: "Company", name: "company", type: "text" },
    {
      label: "LinkedIn",
      name: "linkedin",
      placeholder: "https://linkedin.com/in/...",
      type: "url",
    },
    {
      label: "Website",
      name: "website",
      placeholder: "https://...",
      type: "url",
    },
  ];

  return (
    <BasicFrame className="gap-1">
      <BasicFrameHeader title="Profile" />
      <BasicFramePanel>
        <form
          className="grid gap-4 md:grid-cols-2"
          id={formId}
          onSubmit={handleSubmit}
        >
          {fields.map((field) => (
            <Field key={field.name}>
              <FieldLabel>{field.label}</FieldLabel>
              <Input
                name={field.name}
                onChange={(event) =>
                  updateProfile(field.name, event.target.value)
                }
                placeholder={field.placeholder}
                required={field.required}
                type={field.type}
                value={profile[field.name]}
              />
            </Field>
          ))}
        </form>
      </BasicFramePanel>

      <BasicFrameFooter className="flex p-0">
        <Button
          className="w-full"
          disabled={!hasChanges}
          form={formId}
          type="submit"
          variant={hasChanges ? "default" : "secondary"}
        >
          Save
        </Button>
      </BasicFrameFooter>
    </BasicFrame>
  );
}
