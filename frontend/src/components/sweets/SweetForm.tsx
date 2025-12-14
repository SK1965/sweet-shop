import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const sweetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
});

type SweetFormData = z.infer<typeof sweetSchema>;

interface SweetFormProps {
  initialData?: SweetFormData;
  onSubmit: (data: SweetFormData) => void;
  isLoading?: boolean;
}

export default function SweetForm({ initialData, onSubmit, isLoading }: SweetFormProps) {
  // Casting resolver to any to avoid strict type mismatch with coercion
  const { register, handleSubmit, formState: { errors } } = useForm<SweetFormData>({
    resolver: zodResolver(sweetSchema) as any,
    defaultValues: initialData || {
      name: '',
      price: 0,
      category: '',
      stock: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Chocolate Bar" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" placeholder="100.00" {...register('price')} />
        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" placeholder="Chocolate" {...register('category')} />
         {/* Might want a Select here later */}
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock</Label>
        <Input id="stock" type="number" placeholder="10" {...register('stock')} />
        {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Sweet'}
      </Button>
    </form>
  );
}
