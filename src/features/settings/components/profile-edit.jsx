import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  BasicFrame,
  BasicFrameFooter,
  BasicFrameHeader,
  BasicFramePanel,
} from "@/components/shared/basic-frame";

const initialProfile = {
  name: "Local Dev",
  linkedin: "https://linkedin.com/in/local-dev",
  website: "https://moonvine.local",
};

export function ProfileEdit() {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
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

  return (
    <BasicFrame className="gap-1">
      <BasicFrameHeader>
        <div className="space-y-2">
          <div>
            <h2 className="font-semibold text-lg">{profile.name}</h2>
            <p className="text-muted-foreground text-sm">dev@moonvine.io</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="success">Signed in</Badge>
            <Badge variant="outline">Organization admin</Badge>
          </div>
        </div>
      </BasicFrameHeader>

      <BasicFramePanel>
        <form
          className="grid gap-4 md:grid-cols-2"
          id="profile-edit-form"
          onSubmit={handleSubmit}
        >
          <Field className="md:col-span-2">
            <FieldLabel>Name</FieldLabel>
            <Input
              name="name"
              onChange={(event) => updateProfile("name", event.target.value)}
              required
              type="text"
              value={profile.name}
            />
          </Field>

          <Field>
            <FieldLabel>LinkedIn</FieldLabel>
            <Input
              name="linkedin"
              onChange={(event) => updateProfile("linkedin", event.target.value)}
              type="url"
              value={profile.linkedin}
            />
          </Field>

          <Field>
            <FieldLabel>Website</FieldLabel>
            <Input
              name="website"
              onChange={(event) => updateProfile("website", event.target.value)}
              type="url"
              value={profile.website}
            />
          </Field>
        </form>

        <p className="mt-4 text-muted-foreground text-xs">
          Name, LinkedIn, website, and approved headshot use the same identity
          path as team profiles.
        </p>
      </BasicFramePanel>

      <BasicFrameFooter className="flex justify-end p-0">
        <Button
          className="w-full"
          disabled={!hasChanges}
          form="profile-edit-form"
          type="submit"
          variant={hasChanges ? "default" : "secondary"}
        >
          Save
        </Button>
      </BasicFrameFooter>
    </BasicFrame>
  );
}
