'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Package, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product as ProductType } from '@/types'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'unisex',
    brand: '',
    size: '100ml',
    concentration: 'EDP',
    quantity: '',
    images: [''],
    notes: { top: [''], middle: [''], base: [''] }
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/customer')
    } else if (status === 'authenticated') {
      fetchProducts()
    }
  }, [status, session, router])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        inStock: parseInt(formData.quantity) > 0
      }

      const url = editingProduct 
        ? `/api/admin/products?id=${editingProduct._id}` 
        : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast({
          title: editingProduct ? 'Product Updated' : 'Product Created',
          description: editingProduct ? 'Product has been updated successfully.' : 'New product has been added to inventory.'
        })
        setIsModalOpen(false)
        setEditingProduct(null)
        resetForm()
        fetchProducts()
      } else {
        const data = await res.json()
        toast({ title: 'Error', description: data.error || 'Failed to save product', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: 'Product Deleted', description: 'Product has been removed from inventory.' })
        fetchProducts()
      } else {
        toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' })
    }
  }

  const openEditModal = (product: ProductType) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      size: product.size,
      concentration: product.concentration,
      quantity: product.quantity.toString(),
      images: product.images,
      notes: product.notes || { top: [], middle: [], base: [] }
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'unisex',
      brand: '',
      size: '100ml',
      concentration: 'EDP',
      quantity: '',
      images: [''],
      notes: { top: [''], middle: [''], base: [''] }
    })
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-white/60">Add, update, and track your fragrance collection.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setEditingProduct(null); setIsModalOpen(true) }}
          className="btn-primary flex items-center gap-2 px-6 py-3"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search products by name, brand..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-kartel-gold/50 outline-none transition-all" 
          />
        </div>
      </div>

      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/60 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{product.name}</p>
                        <p className="text-xs text-white/60">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/80 capitalize">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-white/40" />
                      <span className="text-sm text-white/80">{product.quantity} units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                      product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2 text-white/40 hover:text-kartel-gold transition-colors" 
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-white/60">
            No products found
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl luxury-card p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-white">
                  {editingProduct ? 'Edit Fragrance' : 'Add New Fragrance'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Product Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Brand</label>
                    <input 
                      type="text" 
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none"
                    >
                      <option value="mens">Men&apos;s</option>
                      <option value="womens">Women&apos;s</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Initial Stock</label>
                    <input 
                      type="number" 
                      value={formData.quantity}
                      onChange={e => setFormData({...formData, quantity: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Size (e.g. 100ml)</label>
                    <input 
                      type="text" 
                      value={formData.size}
                      onChange={e => setFormData({...formData, size: e.target.value})}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/60">Concentration</label>
                    <select 
                      value={formData.concentration}
                      onChange={e => setFormData({...formData, concentration: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none"
                    >
                      <option value="EDT">EDT</option>
                      <option value="EDP">EDP</option>
                      <option value="Parfum">Parfum</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-white/60">Image URL</label>
                    <input 
                      type="url" 
                      value={formData.images[0]}
                      onChange={e => setFormData({...formData, images: [e.target.value]})}
                      required
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/60">Description</label>
                  <textarea 
                    rows={4} 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-kartel-gold/50 outline-none" 
                  />
                </div>
                <div className="flex justify-end gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="btn-primary px-8 py-3 text-sm disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}