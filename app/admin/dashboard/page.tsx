'use client';
import Link from 'next/link';
import { LineChart, BarChart, PieChart } from 'recharts';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import CategoryCard from '@/components/CategoryCard';
import InventoryTable from '@/components/InventoryTable';
import RecentOrders from '@/components/RecentOrders';
import StatisticsWidget from '@/components/StatisticsWidget';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({});
  const [categories, setCategories] = useState([]);
  const [inventoryLow, setInventoryLow] = useState([]);

  useEffect(() => {
    async function load() {
      const d = await fetch('/api/admin/dashboard/metrics').then(r => r.json());
      const c = await fetch('/api/admin/categories').then(r => r.json());
      const i = await fetch('/api/admin/inventory/low').then(r => r.json());
      setMetrics(d), setCategories(c), setInventoryLow(i);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900">
      <nav className="bg-gold dark:bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/settings">Settings</Link>
        </div>
        <span className="text-lg font-semibold">Unique Perfumes Admin</span>
      </nav>
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Statistics */}
        {[...Array(6)].map((_, i) => (
          <StatisticsWidget key={i} title={['Sales', 'Weekly', 'Monthly', 'Orders', 'Low Stock', 'Profit'][i]} data={metrics[i]} />
        ))}

        {/* Category cards */}
        {[categories.map(cat => (
          <CategoryCard key={cat._id} category={cat} />
        ))]}

        {/* Low stock inventory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventoryLow.map(item => (
            <div key={item._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-red-600">Only {item.quantity} left</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <RecentOrders orders={metrics.recentOrders || []} />
      </div>
    </div>
  );
}