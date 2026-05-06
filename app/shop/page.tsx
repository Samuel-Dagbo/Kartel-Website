'use client';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/button';
import Grid from '@/components/ui/grid';
import CategoryFilter from '@/components/CategoryFilter';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';

export default function ShopPage() {
  const { addToCart } = useCart();
  const { products, filters, setFilters } = useProducts();
  const [selected, setSelected] = useState({});

  const handleAdd = (product) => addToCart(product);
  const handleFilterChange = (newFilter) => {
    setSelected(prev => ({ ...prev, ...newFilter }));
    setFilters(prev => ({ ...prev, ...newFilter }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900">
      <nav className="bg-gold dark:bg-gray-800 p-4 flex justify-between">
        <Link href="/">Home</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/cart">Cart</Link>
      </nav>
      <div className="container mx-auto p-4">
        <FilterBar filters={filters} onChange={handleFilterChange} />
        <Grid columns={3} spacing={4}>
          {products.map(p => (
            <ProductCard key={p._id} product={p} onAdd={() => handleAdd(p)} />
          ))}
        </Grid>
      </div>
    </div>
  );
}