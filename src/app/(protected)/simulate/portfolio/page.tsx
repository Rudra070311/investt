import PortfolioSummary from "@/components/simulation/PortfolioSummary";
import Card from "@/components/ui/Card";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <h1>Portfolio</h1>

      <PortfolioSummary balance={1000} />

      <Card>
        <p className="text-sm text-gray-500">
          Portfolio values are simulated and for educational purposes only.
        </p>
      </Card>
    </div>
  );
}
