import Link from 'next/link';

type sideNavProps = {
    role: "admin" | "creator" | "learner";
};

export default function SideNav({ role }: sideNavProps) {
    return (
        <aside className="w-60 border-r border-gray-800 px-4 py-6">
            <nav className="flex flex-col gap-3 test-sm">
                <Link href='/dashboard'>Dashboard</Link>
                <Link href='/learn'>Learn</Link>
                <Link href='/simulate'>Simulate</Link>

                {role !== 'learner' && (
                    <Link href='/create'>Create</Link>
                )}

                {role !== 'admin' && (
                    <Link href='/admin'>Admin</Link>
                )}
            </nav>
        </aside>
    );
}