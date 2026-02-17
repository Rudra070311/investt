type MistakeAnalyzerProps = {
    feedback: string;
};

export default function MistakeAnalyzer({ feedback }: MistakeAnalyzerProps) {
    return (
        <div className="text-sm text-red-400">
            {feedback}
        </div>
    );
}
            