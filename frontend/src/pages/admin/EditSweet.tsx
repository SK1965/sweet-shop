import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateSweet, getSweets, type Sweet } from '@/api/sweets';
import SweetForm from '@/components/sweets/SweetForm';

export default function EditSweet() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sweet, setSweet] = useState<Sweet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ideally we would have getSweetById, but searching or filtering list works for now if API missing specific ID endpoint
    // Or we can assume getSweets returns everything and find it. 
    // Let's implement a quick fetch. 
    // Actually api/sweets.ts doesn't have getSweetById.
    // I will try to fetch all and find, or assume the backend supports GET /sweets/:id (standard REST).
    // Reviewing api/sweets.ts... it only has getSweets (search) and basics.
    // I will assume standard REST GET /sweets/:id works or add it.
    // Let's check api/sweets.ts first.
    
    // For now, let's just fetch all and filter to correct one to be safe if specific endpoint not confirmed.
    // Wait, backend route for GET /sweets is "getSweets" which returns all.
    // Backend "getSweets" in SweetController returns Sweet.find().
    // Backend doesn't seem to have valid GET /sweets/:id in routes/sweetRoutes.ts?
    // Let's checking routes file again if possible or just filter from getSweets.
    const loadSweet = async () => {
        try {
            // Fetching all for now since we don't have dedicated single fetch in routes verified
            const sweets = await getSweets(); 
            const found = sweets.find((s: Sweet) => s._id === id);
            if (found) {
                setSweet(found);
            } else {
                setError('Sweet not found');
            }
        } catch (err) {
            setError('Failed to load sweet');
        }
    };
    if (id) loadSweet();
  }, [id]);

  const handleSubmit = async (data: any) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await updateSweet(id, data);
      navigate('/admin');
    } catch (error) {
      console.error('Failed to update sweet', error);
      setError('Failed to update sweet');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!sweet) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Sweet</h1>
      <SweetForm 
        initialData={sweet}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
