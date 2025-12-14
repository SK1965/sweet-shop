import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SweetForm from '@/components/sweets/SweetForm';
import { createSweet } from '@/api/sweets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AddSweet() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      await createSweet(data);
      navigate('/admin');
    } catch (err: any) {
        console.error(err);
      setError(err.response?.data?.message || 'Failed to create sweet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
        <Button variant="outline" onClick={() => navigate('/admin')} className="mb-4">
            &larr; Back to Dashboard
        </Button>
      <Card>
        <CardHeader>
          <CardTitle>Add New Sweet</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <SweetForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
