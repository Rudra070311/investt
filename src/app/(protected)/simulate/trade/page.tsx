import OrderPreview from "@/components/simulation/OrderPreview";
import RiskExplanation from "@/components/simulation/RiskExplanation";
import Card from "@/components/ui/Card";

export default function TradePage() {
  return (
    <div className="space-y-6">
      <h1>Trade</h1>

      <Card>
        <p className="text-sm text-gray-600">
          Place simulated trades to understand market mechanics.
        </p>
      </Card>

      <OrderPreview asset={""} quantity={0} />

      <RiskExplanation text={""} />
    </div>
  );
}
