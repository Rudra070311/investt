import Card from "../ui/Card";

type OrderPreviewProps = {
    asset: string;
    quantity: number;
};

export default function OrderPreview({ asset, quantity }: OrderPreviewProps) {
    return (
        <Card>
            <p className="text-sm">Asset: {asset}</p>
            <p className="text-sm">Quantity: {quantity}</p>
        </Card>
    );
}