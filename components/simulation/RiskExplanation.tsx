type RiskExplanationProps = {
    text: string;
};

export default function RiskExplanation({ text }: RiskExplanationProps) {
    return (
        <div className="text-sm text-yellow-400">
            {text}
        </div>
    );
}