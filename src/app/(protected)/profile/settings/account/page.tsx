import { getSupabaseServer } from "@/lib/supabase/server";

export default async function AccountSettingsPage() {
  const supabase = getSupabaseServer();

  const { data: profile } = await (await supabase)
    .from("profiles")
    .select("email, full_name")
    .single();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Account</h2>

      <p>Email: {profile?.email}</p>
      <p>Name: {profile?.full_name ?? "Not set"}</p>

      <p className="text-sm text-gray-400">
        Editing will be enabled in next iteration.
      </p>
    </div>
  );
}
