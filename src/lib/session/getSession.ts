import { getSupabaseServer } from "../supabase/server";

export async function getSession() {
  const supabase = getSupabaseServer();
  const { data } = await (await supabase).auth.getSession();
  return data.session ?? null;
}