type ProgressBarProps = {
    progress: number; // Value between 0 and 100
};

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full bg-gray-800 rounded h-2">
            <div
                className="bg-blue-600 h-2 rounded"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}