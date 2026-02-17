import { supabaseBrowser } from "@/lib/supabase/browser";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserMenu() {
    const router = useRouter();

    async function handleLogout() {
        await supabaseBrowser.auth.signOut();
        router.push("/auth");
    }
    return (
        <div className="card p-3 text-sm flex flex-col gap-2">
            <Link href="/profile">Profile</Link>
            <Link href="/settings">Settings</Link>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}