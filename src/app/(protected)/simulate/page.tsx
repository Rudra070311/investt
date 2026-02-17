import Card from "@/components/ui/Card";
import Link from "next/link";

export default function SimulatePage() {
  return (
    <div className="space-y-6">
      <h1>Simulation</h1>

      <Card>
        <p className="text-sm text-gray-600">
          Practice investing using virtual money. No real funds involved.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/simulate/portfolio">
          <Card>
            <h3>Portfolio</h3>
            <p className="text-sm text-gray-500">
              View your holdings and performance.
            </p>
          </Card>
        </Link>

        <Link href="/simulate/trade">
          <Card>
            <h3>Trade</h3>
            <p className="text-sm text-gray-500">
              Place simulated buy or sell orders.
            </p>
          </Card>
        </Link>

        <Link href="/simulate/history">
          <Card>
            <h3>History</h3>
            <p className="text-sm text-gray-500">
              Review past simulated trades.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
