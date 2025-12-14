import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface SweetSearchProps {
  onSearch: (params: SearchParams) => void;
}

export default function SweetSearch({ onSearch }: SweetSearchProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const handleSearch = (e?: React.FormEvent) => {
      e?.preventDefault();
      onSearch({
          name: name || undefined,
          category: category || undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined
      });
  };

  // Debounce optional if we want instant type-to-search
  useEffect(() => {
      const timer = setTimeout(() => {
          handleSearch();
      }, 500);
      return () => clearTimeout(timer);
  }, [name, category, maxPrice]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
      <div className="flex-1 space-y-1">
        <Label htmlFor="search-name">Search by Name</Label>
        <Input 
            id="search-name"
            placeholder="Chocolate..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="w-full md:w-1/4 space-y-1">
        <Label htmlFor="search-category">Category</Label>
         <Input 
            id="search-category" 
            placeholder="Candy, Cake..." 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="w-full md:w-1/4 space-y-1">
          <Label htmlFor="max-price">Max Price ($)</Label>
          <Input 
             id="max-price" 
             type="number" 
             placeholder="100" 
             value={maxPrice}
             onChange={(e) => setMaxPrice(e.target.value)}
          />
      </div>
      
      {/* Button fallback if JS disabled or explicit action needed, hidden given useEffect */}
      <Button onClick={() => handleSearch()} className="hidden">Search</Button>
    </div>
  );
}
