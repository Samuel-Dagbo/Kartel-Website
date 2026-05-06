'use client';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900">
      <nav className="bg-gold dark:bg-gray-800 p-4 flex justify-between">
        <Link href="/shop">Shop</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/checkout">Checkout</Link>
        <LoginLink />
      </nav>
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Unique Perfumes</h1>
        <p className="mb-6">Discover our premium fragrance collection.</p>
        <Link href="/shop" className="bg-gold text-white px-4 py-2 rounded">Shop Now</Link>
      </main>
    </div>
  );
}

function LoginLink() {
  return <Link href="/login" className="text-gray-600 hover:underline">Login</Link>;
}