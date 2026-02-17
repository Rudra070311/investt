import Link from "next/link";

export default function ProfileSettingsPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <ul className="space-y-2">
        <li><Link href="/profile/settings/account">Account</Link></li>
        <li><Link href="/profile/settings/security">Security</Link></li>
        <li><Link href="/profile/settings/preferences">Preferences</Link></li>
        <li><Link href="/profile/settings/notifications">Notifications</Link></li>
        <li><Link href="/profile/settings/privacy">Privacy</Link></li>
      </ul>
    </div>
  );
}
