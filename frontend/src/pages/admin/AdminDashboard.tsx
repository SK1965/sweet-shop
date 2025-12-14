import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSweets, deleteSweet, type Sweet } from '@/api/sweets';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from '@/context/AuthContext';
import { Plus, Pencil, Trash2, Package, AlertCircle, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const { logout } = useAuth();
  
  // Stats calculation
  const totalSweets = sweets.length;
  const lowStockCount = sweets.filter(s => s.stock < 10).length;
  const totalStockValue = sweets.reduce((acc, s) => acc + (s.price * s.stock), 0);

  const fetchSweets = async () => {
    try {
        const data = await getSweets();
        setSweets(data);
    } catch (error) {
        console.error("Failed to fetch sweets", error);
    }
  }

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleDelete = async (id: string, name: string) => {
      if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
          try {
              await deleteSweet(id);
              fetchSweets(); 
          } catch (error) {
              alert('Failed to delete sweet');
              console.error(error);
          }
      }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Manage your sweet inventory and track performance.</p>
        </div>
        <div className="flex gap-2">
             <Button onClick={logout} variant="outline">Logout</Button>
             <Button asChild className="bg-pink-600 hover:bg-pink-700">
                <Link to="/admin/sweets/new">
                    <Plus className="mr-2 h-4 w-4" /> Add Sweet
                </Link>
             </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sweets</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalSweets}</div>
                <p className="text-xs text-muted-foreground">Products in catalog</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertCircle className={`h-4 w-4 ${lowStockCount > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{lowStockCount}</div>
                <p className="text-xs text-muted-foreground">Items with stock &lt; 10</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${totalStockValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total asset value</p>
            </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border-t-4 border-t-pink-500 shadow-sm">
        <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>A list of all sweets available for sale.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sweets.map((sweet) => (
                        <TableRow key={sweet._id} className="group hover:bg-gray-50">
                            <TableCell className="font-medium text-gray-900">{sweet.name}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-slate-100">{sweet.category}</Badge>
                            </TableCell>
                            <TableCell>${sweet.price.toFixed(2)}</TableCell>
                            <TableCell>
                                {sweet.stock === 0 ? (
                                    <Badge variant="destructive">Out of Stock</Badge>
                                ) : sweet.stock < 10 ? (
                                    <Badge variant="warning">Low ({sweet.stock})</Badge>
                                ) : (
                                    <Badge variant="success">In Stock ({sweet.stock})</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link to={`/admin/sweets/${sweet._id}/edit`}>
                                        <Pencil className="h-4 w-4 text-blue-600" />
                                    </Link>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDelete(sweet._id, sweet.name)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {sweets.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No sweets found. Not sweet at all!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
