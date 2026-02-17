import Card from "@/components/ui/Card";

export default function CoursePage() {
  return (
    <div className="space-y-4">
      <h1>Course Overview</h1>

      <Card>
        <p className="text-sm text-gray-500">
          Lessons will appear here with progress indicators.
        </p>
      </Card>
    </div>
  );
}
