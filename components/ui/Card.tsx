type CardProps = {
    children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
    return <div className="card p-4">{children}</div>;
}