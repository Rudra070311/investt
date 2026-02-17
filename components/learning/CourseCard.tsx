import Card from '../ui/Card';

type CourseCardProps = {
    title: string;
    level: string;
};

export default function CourseCard({ title, level }: CourseCardProps) {
    return (
        <Card>
            <h3>{title}</h3>
            <p className="text-sm text-gray-400">Level: {level}</p>
        </Card>
    );
}