import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { searchSweets, purchaseSweet, type Sweet, type SearchParams } from '@/api/sweets';
import SweetCard from '@/components/sweets/SweetCard';
import SweetSearch from '@/components/sweets/SweetSearch';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const fetchSweets = async (params: SearchParams = {}) => {
    setIsLoading(true);
    try {
      const data = await searchSweets(params);
      setSweets(data);
    } catch (error) {
      console.error('Failed to fetch sweets', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handlePurchase = async (sweet: Sweet, quantity: number) => {
      setPurchasingId(sweet._id);
      try {
          await purchaseSweet(sweet._id, quantity);
          // Refresh list to show updated stock
          // We could also just update local state for optimization
          fetchSweets(); 
          alert(`Successfully purchased ${sweet.name}!`);
      } catch (error: any) {
          alert(error.response?.data?.message || 'Purchase failed');
      } finally {
          setPurchasingId(null);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-pink-600">🍬 Sweet Shop</h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        <section>
            <h2 className="text-xl font-semibold mb-4">Find your favorite treats</h2>
            <SweetSearch onSearch={fetchSweets} />
        </section>

        <section>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                </div>
            ) : (
                <>
                    {sweets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No sweets found matching your search.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sweets.map((sweet) => (
                                <SweetCard 
                                    key={sweet._id} 
                                    sweet={sweet} 
                                    onPurchase={handlePurchase}
                                    isPurchasing={purchasingId === sweet._id}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
      </main>

      <footer className="bg-white border-t py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Sweet Shop Management System. All rights reserved.
          </div>
      </footer>
    </div>
  );
}
