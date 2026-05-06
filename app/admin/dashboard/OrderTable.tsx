'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGetOrders } from '@/hooks/useGetOrders';

export default function OrderTable() {
  const { orders, loading, error } = useGetOrders();
  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div>
      {orders.map(order => (
        <div key={order._id}>
          <p>Order #{order.orderNumber} – {order.status}</p>
          {order.items.map(item => (
            <p key={item.productId}>{item.name}: {item.quantity} × ${item.price}</p>
          ))}
          <p>Total: ${order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}