import { ProfileEdit } from "@/features/settings/components/profile-edit";

export function SettingsProfile() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="max-w-[28rem] text-2xl text-foreground">
          Your Moonvine identity, sign-in, and personal preferences.
        </h1>
      </section>
      <ProfileEdit />
    </div>
  );
}
