import Card from "../ui/Card";

type BioCardProps = {
    name: string;
    bio?: string;
};

export default function BioCard({ name, bio }: BioCardProps) {
    return (
        <Card>
            <h3>{name}</h3>
            {bio && <p className="text-sm mt-1">{bio}</p>}
        </Card>
    );
}