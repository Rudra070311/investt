type BadgeProps = {
    label: string;
};

export default function Badge({ label }: BadgeProps) {
    return (
        <span className="text-xs bg-gray-800 px-2 py-1 rounded">
            {label}
        </span>
    );
}