import Link from "next/link";
import Card from "@/components/ui/Card";

export default function PublicHomePage() {
    return (
        <section className="app-container py-20 space-y-16">
            {/* Hero */}
            <div className="text-center space-y-4">
                <h1>Learn Finance Safely before risking real money</h1>
                <p className="max-w-2xl mx-auto">
                    Investt is an educational platform that teaches how
                    markets work using simulations, structured learning,
                    and AI explanations — not real money.
                </p>
                <Link
                    href="/signup"
                    className="inline-block mt-6 bg-blue-600 px-6 py-3 rounded text-white text-sm"
                >
                    Get Started
                </Link>
            </div>

            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <h3>Learn</h3>
                    <p>Understand finance with beginner-friendly lessons.</p>
                </Card>
                <Card>
                    <h3>Simulate</h3>
                    <p>Practice decisions using personal portfolios.</p>
                </Card>
                <Card>
                    <h3>Reflect</h3>
                    <p>Get AI feedback to improve your strategies.</p>
                </Card>
            </div>
        </section>
    );
}