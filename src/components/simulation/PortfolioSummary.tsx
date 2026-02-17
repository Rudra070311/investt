import Card from "../ui/Card";

type OrderPreviewProps = {
    balance: number;
};

export default function PortfolioSummary({ balance }: OrderPreviewProps) {
    return (
        <Card>
            <h3 className="text-lg font-bold">Virtual Balance</h3>
            <p className="text-sm">${balance.toFixed(2)}</p>
        </Card>
    );
}