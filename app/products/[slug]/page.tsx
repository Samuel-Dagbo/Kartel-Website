'use client';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then(r => r.json())
      .then(data => setProduct(data[0] || null));
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const addHandler = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.images && (
          <div className="space-y-2">
            {[...Array(product.images.length)].map((_, i) => (
              <Image key={i} src={product.images[i]} alt={product.name} width={200} height={200} className="rounded" />
            ))}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-gray-600">{product.brand}</p>
          <p className="mt-2 text-xl text-gold">{product.price.toFixed(2)}</p>
          {product.discountPrice && (
            <p className="text-lg text-red-600 font-medium">
              {product.discountPrice.toFixed(2)}
            </p>
          )}
          <p className="mt-3">{product.description}</p>
          <p className="mt-2 text-sm text-gray-500">{product.notes}</p>
          <div className="mt-4 flex items-center space-x-2">
            <label className="flex items-center space-x-1">
              <Checkbox />
              <span className="text-sm">Add gift wrap?</span>
            </label>
            <div className="flex items-center gap-2">
              <Select>
                <option>30ml</option>
                <option>50ml</option>
              </Select>
            </div>
          </div>
          <form onSubmit={addHandler} className="mt-6">
            <Button type="submit" className="w-full bg-gold text-white py-2 rounded">Add to Cart</Button>
          </form>
          <p className="mt-3 text-lg">
            {product.shippingInfo || 'Free shipping on orders over $50'}
          </p>
        </div>
      </div>
    </div>
  );
}