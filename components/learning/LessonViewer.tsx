type LessonViewerProps = {
    title: string;
    content: string;
};

export default function LessonViewer({ title, content }: LessonViewerProps) {
    return (
        <article className="prose prose-invert max-w-none">
            <h2>{title}</h2>
            <p>{content}</p>
        </article>
    );
}