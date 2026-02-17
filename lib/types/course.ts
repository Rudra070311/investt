export type Course = {
    id: string;
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    isPublished: boolean;
};

export type Lesson = {
    id: string;
    courseId: string;
    title: string;
    order: number;
};