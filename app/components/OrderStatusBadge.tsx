'use client';
import { useState } from 'react';

export default function OrderStatusBadge({ status }: { status: string }) {
  const [editing, setEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(status);
  if (editing) {
    return (
      <span className="px-2 py-1 bg-blue-600 text-white rounded">
        {newStatus}
        <input
          type="text"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="border-none focus:outline-none"
        />
        <button
          onClick={() => setEditing(false)}
          className="ml-2 text-xs font-medium text-white hover:underline"
        >
          Done
        </button>
      </span>
    );
  }
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        status === 'pending'
          ? 'bg-yellow-600'
          : status === 'processing'
          ? 'bg-orange-600'
          : status === 'shipped'
          ? 'bg-blue-600'
          : status === 'delivered'
          ? 'bg-green-600'
          : 'bg-gray-400'
      `}`}
      onClick={() => setEditing(true)}
    >
      {status}
    </span>
  );
}