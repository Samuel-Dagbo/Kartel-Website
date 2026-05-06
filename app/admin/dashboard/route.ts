'use client';

import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { LineChart } from 'recharts';

export default function Dashboard() {
  const data = useDashboardMetrics();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
              <h2 className="text-lg font-semibold mb-2">{data[i].title}</h2>
              <LineChart width={150} height={30} data={data[i].data}>
                <Line dataSeries={[data[i].series]} />
              </LineChart>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}