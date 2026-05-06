'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gold">Thank You!</h1>
        <p className="mb-4">Your order has been placed successfully.</p>
        <Link href="/" className="text-gold hover:underline">Continue Shopping</Link>
        <button
          onClick={() => router.push('/checkout')}
          className="mt-4 bg-gold text-white px-4 py-2 rounded hover:bg-gold-dark transition-colors"
        >
          Make Another Purchase
        </button>
      </div>
    </div>
  );
}