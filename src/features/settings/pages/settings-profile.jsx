import { ProfileEdit } from "@/features/settings/components/profile-edit";

export function SettingsProfile() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">
          Personal profile
        </h1>
        <p className="max-w-sm text-muted-foreground text-sm">
          Your Moonvine identity, sign-in, and personal preferences.
        </p>
      </section>
      <ProfileEdit />
    </div>
  );
}
