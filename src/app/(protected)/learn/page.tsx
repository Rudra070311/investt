import Card from "@/components/ui/Card";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <h1>Learn</h1>

      <Card>
        <h3>Available Courses</h3>
        <p className="text-sm text-gray-500">
          Choose a course to begin learning finance concepts.
        </p>
      </Card>
    </div>
  );
}