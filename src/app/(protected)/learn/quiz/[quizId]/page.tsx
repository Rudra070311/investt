import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function QuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const { quizId } = params;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quiz</h1>

      <Card>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Quiz ID: <span className="font-mono">{quizId}</span>
          </p>

          <p className="text-sm text-gray-600">
            This quiz tests your understanding of the course concepts.
            Questions, scoring, and AI explanations will be loaded here.
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-2">Instructions</h3>
        <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
          <li>Each question has one correct answer</li>
          <li>Your progress will be saved automatically</li>
          <li>AI explanations will appear after submission</li>
        </ul>
      </Card>

      <div className="flex justify-end">
        <Button>
          Start Quiz
        </Button>
      </div>
    </div>
  );
}
