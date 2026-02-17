import Card from "@/components/ui/Card";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <h1>Trade History</h1>

      <Card>
        <p className="text-sm text-gray-500">
          Your past simulated trades will appear here.
        </p>
      </Card>
    </div>
  );
}
