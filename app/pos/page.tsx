'use client';

import { useState, useEffect } from 'react';

export default function PosPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [customerName, setCustomerName] = useState('');
  const [total, setTotal] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setProducts(filtered);
  }, [search, products]);

  const addToCart = (product) => {
    const existing = cart.find(c => c.id === product._id);
    if (existing) {
      setCart(cart.map(c => c.id === product._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setTotal(prev => prev + product.price);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
    const product = products.find(p => p._id === id);
    if (product) setTotal(prev => prev - product.price);
  };

  const increaseQuantity = (product) => {
    setCart(cart.map(c => c.id === product._id ? { ...c, quantity: c.quantity + 1 } : c));
    setTotal(prev => prev + product.price);
  };

  const decreaseQuantity = (product) => {
    const newCart = cart.map(c => c.id === product._id ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c);
    setCart(newCart);
    const prod = products.find(p => p._id === product._id);
    if (prod) setTotal(prev => prev - prod.price);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    const payload = {
      items: cart.map(c => ({
        productId: c._id,
        quantity: c.quantity,
        name: c.name,
        price: c.price,
        subtotal: c.price * c.quantity,
      })),
      customerName,
      paymentMethod,
      total: total,
    };
    const res = await fetch('/api/pos/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success) {
      alert('Transaction completed! Receipt ID: ' + result.order.orderNumber);
      setCart([]);
      setTotal(0);
    } else {
      alert('Error: ' + result.error);
    }
    setCheckingOut(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-2 py-1 border rounded-md mb-2"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {products.map(p => {
            const filtered = products.filter(p => p.name.includes(search));
            const found = filtered.includes(p);
            if (!found) return null;
            return (
              <div key={p._id} className="border rounded p-2 hover:shadow-lg transition-shadow">
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-600">{p.brand}</p>
                <p className="font-medium">{p.price.toFixed(2)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(p)}
                    disabled={p.quantity < 1}
                    className="px-1 py-0.5 text-sm bg-gray-200 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-2 py-1">{p.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(p)}
                    className="px-1 py-0.5 text-sm bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
                <div className="mt-1">
                  <button
                    onClick={() => addToCart(p)}
                    className="w-full bg-gold text-white py-1 rounded hover:bg-gold-dark transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-2 border rounded bg-white dark:bg-gray-800">
          <h2 className="font-semibold mb-2">Cart Summary</h2>
          <div className="flex justify-between items-center mb-2">
            <span>Customer Name:</span>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="px-2 py-1 border rounded w-64"
            />
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Payment Method:</span>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="CASH">Cash</option>
              <option value="MOMO">MoMo</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
          <div className="flex justify-between items-center font-medium mb-2">
            <span>Total: ${total.toFixed(2)}</span>
            <button
              onClick={handleSubmit}
              disabled={checkingOut}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {checkingOut ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>

          {cart.length > 0 && (
            <ul className="space-y-1 mb-2">
              {cart.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}