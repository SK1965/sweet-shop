import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSweets, type Sweet } from '@/api/sweets';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" // We might need to install these components if not present, but for now standard table HTML or check shadcn
import { useAuth } from '@/context/AuthContext';


export default function AdminDashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const { logout } = useAuth();

  useEffect(() => {
    // Fetch sweets
    const fetchSweets = async () => {
        try {
            const data = await getSweets();
            setSweets(data); // Assuming data is array
        } catch (error) {
            console.error("Failed to fetch sweets", error);
        }
    }
    fetchSweets();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
             <Button onClick={logout} variant="outline">Logout</Button>
             <Button asChild>
                <Link to="/admin/sweets/new">Add Sweet</Link>
             </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sweets.map((sweet) => (
                    <TableRow key={sweet._id}>
                        <TableCell className="font-medium">{sweet.name}</TableCell>
                        <TableCell>{sweet.category}</TableCell>
                        <TableCell>${sweet.price}</TableCell>
                        <TableCell>{sweet.stock}</TableCell>
                        <TableCell>
                            <span className="text-blue-600 hover:underline cursor-pointer">Edit</span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {sweets.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">No sweets found. Add one!</div>
        )}
      </div>
    </div>
  );
}
