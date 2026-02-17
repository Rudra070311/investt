type ContextBarProps = {
    title: string;
};

export default function ContextBar({ title }: ContextBarProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 p-3 text-sm">{title}</div>
    );
}