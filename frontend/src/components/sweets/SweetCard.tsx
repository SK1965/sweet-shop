import type { Sweet } from '@/api/sweets';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweet: Sweet, quantity: number) => void;
  isPurchasing: boolean;
}

export default function SweetCard({ sweet, onPurchase, isPurchasing }: SweetCardProps) {
  const isOutOfStock = sweet.stock <= 0;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl">{sweet.name}</CardTitle>
                <span className="text-xs text-muted-foreground uppercase tracking-wide bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                    {sweet.category}
                </span>
            </div>
            <div className="text-lg font-bold text-green-600">
                ${sweet.price.toFixed(2)}
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
                Stock: 
                <span className={`ml-2 font-semibold ${isOutOfStock ? 'text-red-500' : 'text-gray-900'}`}>
                    {isOutOfStock ? 'Out of Stock' : sweet.stock}
                </span>
            </p>
          </div>
      </CardContent>
      <CardFooter>
        <Button 
            className={`w-full ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed' : ''}`}
            onClick={() => onPurchase(sweet, 1)}
            disabled={isOutOfStock || isPurchasing}
            variant={isOutOfStock ? "ghost" : "default"}
        >
            {isOutOfStock ? 'Sold Out' : (isPurchasing ? 'Processing...' : 'Purchase')}
        </Button>
      </CardFooter>
    </Card>
  );
}
