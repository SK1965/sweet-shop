import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sweet Shop Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.email}</span>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </div>
      <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
        <p>This is the protected dashboard. Sweets catalog will go here.</p>
      </div>
    </div>
  );
}
