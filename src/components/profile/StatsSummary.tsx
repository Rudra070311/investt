type StatSummaryProps = {
    coursesCompleted: number;
    simulationsRun: number;
};

export default function StatsSummary({
    coursesCompleted,
    simulationsRun,
}: StatSummaryProps) {
    return (
        <div className="flex gap-6 text-sm">
            <div>
                <p className="font-medium">{coursesCompleted} Courses Completed</p>
                <p className="text-gray-400">Courses</p>
            </div>
            <div>
                <p className="font-medium">{simulationsRun} Simulations Run</p>
                <p className="text-gray-400">Simulations</p>
            </div>
        </div>
    );
}