export default function SecuritySettingsPage() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Security</h2>

      <ul className="list-disc pl-6 text-sm text-gray-300">
        <li>Password managed via login / reset flow</li>
        <li>OAuth providers (future)</li>
        <li>Session revocation (future)</li>
      </ul>
    </div>
  );
}
