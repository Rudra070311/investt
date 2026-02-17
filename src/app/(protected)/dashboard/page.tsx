import Card from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <h3>Learning Progress</h3>
        <p className="text-sm text-gray-500">
          Track your course completion and lessons.
        </p>
      </Card>

      <Card>
        <h3>Simulation Portfolio</h3>
        <p className="text-sm text-gray-500">
          View your virtual investments.
        </p>
      </Card>

      <Card>
        <h3>AI Insights</h3>
        <p className="text-sm text-gray-500">
          Understand mistakes and concepts.
        </p>
      </Card>
    </div>
  );
}
