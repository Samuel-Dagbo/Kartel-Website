'use client';
import { useEffect, useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import OrderStatusBadge from '@/components/OrderStatusBadge';
import ExportCsvButton from '@/components/ExportCsvButton';

export default function OrdersPage() {
  const { orders, loading, error, exportCsv } = useOrders();
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  const handleStatusChange = (id, newStatus) => exportCsv();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="flex mb-4 justify-between">
        <button onClick={exportCsv}>Export CSV</button>
        <button onClick={() => window.history.back()}>← Back</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(o => (
          <div key={o._id} className="border rounded p-4 shadow hover:shadow-md">
            <p className="font-medium">Order #{o.orderNumber}</p>
            <OrderStatusBadge status={o.status} />
            <div className="mt-2">{o.customerName}</div>
            <div className="mt-1">{o.totalAmount.toFixed(2)}</div>
            <div className="mt-1 text-sm text-gray-500">
              Items: {o.items.length}
            </div>
            {o.status !== 'delivered' && (
              <button
                onClick={() => handleStatusChange(o._id, o.status === 'processing' ? 'shipped' : 'delivered')}
                className="mt-2 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Mark Delivered
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}