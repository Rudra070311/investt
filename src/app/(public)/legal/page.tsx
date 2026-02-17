import Link from 'next/link';

export default function LegalIndexPage() {
    return (
        <section className="app-container py-16 space-y-4">
            <h1>Legal Information</h1>

            <ul className="list-disc list-inside space-y-2">
                <li><Link href="/legal/privacy">Privacy Policy</Link></li>
                <li><Link href="/legal/terms">Terms of Service</Link></li>
                <li><Link href="/legal/cookies">Cookie Policy</Link></li>
                <li><Link href="/legal/disclaimer">Disclaimer</Link></li>
            </ul>
        </section>
    );
}