type CognitiveLoadPromptProps = {
    message: string;
};

export default function CognitiveLoadPrompt({ message }: CognitiveLoadPromptProps) {
    return (
        <p className="text-xs text-gray-400">
            {message}
        </p>
    );
}