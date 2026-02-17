type SimplifyPanelProps = {
    text: string;
};

export default function SimplifyPanel({ text }: SimplifyPanelProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 p-3 rounded text-sm">
            {text}
        </div>
    );
}