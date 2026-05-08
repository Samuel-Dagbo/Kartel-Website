'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Package, X, Eye, Tag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product as ProductType } from '@/types'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

function ProductsContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
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
    if (searchParams.get('action') === 'add') {
      resetForm()
      setEditingProduct(null)
      setIsModalOpen(true)
      router.replace('/admin/products')
    }
  }, [searchParams, router])

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

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-white/40 text-sm">Loading inventory...</span>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Inventory Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage your fragrance collection</p>
        </div>
        <button 
          onClick={() => { resetForm(); setEditingProduct(null); setIsModalOpen(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-kartel-gold/20"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'from-blue-500/20' },
          { label: 'In Stock', value: products.filter(p => p.inStock).length, icon: Eye, color: 'from-green-500/20' },
          { label: 'Out of Stock', value: products.filter(p => !p.inStock).length, icon: Trash2, color: 'from-red-500/20' },
          { label: 'Total Value', value: formatPrice(products.reduce((sum, p) => sum + (p.price * p.quantity), 0)), icon: Tag, color: 'from-kartel-gold/20' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-kartel-gold" />
              </div>
              <div>
                <p className="text-white/50 text-xs">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text" 
            placeholder="Search by name or brand..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white placeholder:text-white/30 focus:border-kartel-gold/30 focus:outline-none transition-all text-sm" 
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-white/[0.02] border border-white/[0.08] rounded-xl text-white/70 focus:border-kartel-gold/30 focus:outline-none transition-all text-sm"
        >
          <option value="all">All Categories</option>
          <option value="mens">Men&apos;s</option>
          <option value="womens">Women&apos;s</option>
          <option value="unisex">Unisex</option>
          <option value="niche">Niche</option>
        </select>
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Product</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Category</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Price</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-5 py-4 text-right text-[10px] font-semibold text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, i) => (
                  <motion.tr 
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/[0.08] shrink-0 bg-white/[0.02]">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-white/20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{product.name}</p>
                          <p className="text-xs text-white/40">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-white/60 capitalize">{product.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-white">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm ${product.quantity < 10 ? 'text-yellow-400' : 'text-white/60'}`}>
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        product.inStock 
                          ? product.quantity < 10 
                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                            : 'bg-green-500/15 text-green-400 border border-green-500/20'
                          : 'bg-red-500/15 text-red-400 border border-red-500/20'
                      }`}>
                        {product.inStock ? (product.quantity < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-kartel-gold hover:bg-white/[0.06] transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
                        <Package className="w-6 h-6 text-white/20" />
                      </div>
                      <p className="text-white/40">No products found</p>
                      <p className="text-white/20 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-kartel-black-900 border border-white/[0.1]"
            >
              <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                <h2 className="font-serif text-xl font-semibold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:border-kartel-gold/30 focus:outline-none transition-all"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Brand</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:border-kartel-gold/30 focus:outline-none transition-all"
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:border-kartel-gold/30 focus:outline-none transition-all resize-none"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:border-kartel-gold/30 focus:outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Quantity</label>
                    <input
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:border-kartel-gold/30 focus:outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:border-kartel-gold/30 focus:outline-none transition-all"
                    >
                      <option value="unisex">Unisex</option>
                      <option value="mens">Men&apos;s</option>
                      <option value="womens">Women&apos;s</option>
                      <option value="niche">Niche</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider">Size</label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white focus:border-kartel-gold/30 focus:outline-none transition-all"
                    >
                      <option value="50ml">50ml</option>
                      <option value="100ml">100ml</option>
                      <option value="150ml">150ml</option>
                      <option value="200ml">200ml</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/50 uppercase tracking-wider">Image URL</label>
                  <input
                    type="url"
                    value={formData.images[0]}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:border-kartel-gold/30 focus:outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/70 hover:bg-white/[0.06] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-kartel-gold to-kartel-gold-light text-kartel-black font-semibold hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-white/40 text-sm">Loading...</span>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}