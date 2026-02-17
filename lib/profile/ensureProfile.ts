import { getSupabaseServer } from "@/lib/supabase/server";

export async function ensureProfile() {
  const supabase = getSupabaseServer();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) return null;

  // Check if profile exists
  const { data: profile } = await (await supabase)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) return profile;

  // Create profile if missing
  const metadata = user.user_metadata ?? {};
  const rawUsername = typeof metadata.username === "string" ? metadata.username : "";
  const fallbackUsername = user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`;
  const username = (rawUsername || fallbackUsername).toLowerCase();
  const fullName = typeof metadata.full_name === "string" ? metadata.full_name : null;
  const dateOfBirth = typeof metadata.date_of_birth === "string" ? metadata.date_of_birth : null;
  const isMinor = (() => {
    if (!dateOfBirth) return false;
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age < 18;
  })();

  const { data: newProfile } = await (await supabase)
    .from("profiles")
    .insert({
      id: user.id,
      username,
      full_name: fullName,
      date_of_birth: dateOfBirth,
      is_minor: isMinor,
      age_verified: false,
      parental_consent: false,
      onboarding_completed: false,
      is_verified_creator: false,
      is_suspended: false,
      trust_score: 0,
      learning_level: null,
      interests: [],
    })
    .select()
    .single();

  return newProfile;
}
