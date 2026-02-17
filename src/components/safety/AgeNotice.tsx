type AgeNoticeProps = {
    text: string;
};

export default function AgeNotice({ text }: AgeNoticeProps) {
    return (
        <div className="text-xs text-blue-400">
            {text}
        </div>
    );
}