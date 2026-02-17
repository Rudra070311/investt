import Link from 'next/link';

export default function TopNav() {
    return (
        <header className="h-14 border-b border-gray-800 px-6 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
            Investt
        </Link>

        <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
        </nav>
        </header>
    );
}