import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

/**
 * DELETE ACCOUNT API
 * 
 * This endpoint:
 * 1. Verifies the user is authenticated
 * 2. Deletes their profile from the database
 * 3. Deletes their auth user account
 */
export async function POST() {
  try {
    // Step 1: Get the current authenticated user
    const supabase = await getSupabaseServer();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If no user is logged in, return error
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to delete your account" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Step 2: Delete the profile from the database
    // This deletes the row in the "profiles" table
    const { error: profileDeleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileDeleteError) {
      console.error("Error deleting profile:", profileDeleteError);
      return NextResponse.json(
        { error: "Database error", message: "Failed to delete profile data" },
        { status: 500 }
      );
    }

    // Step 3: Delete the auth user account
    // We need an admin client for this because regular users can't delete themselves
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // This is the admin key
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (authDeleteError) {
      console.error("Error deleting auth user:", authDeleteError);
      return NextResponse.json(
        { error: "Auth error", message: "Failed to delete user account" },
        { status: 500 }
      );
    }

    // Success!
    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Unexpected error during account deletion:", error);
    return NextResponse.json(
      { error: "Server error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
