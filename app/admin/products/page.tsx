'use client';
import { useEffect, useState } from 'react';
import { Table } from '@/components/ui/table';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AddProductIcon from '@/components/icons/AddProductIcon';
import EditIcon from '@/components/icons/EditIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', category: '', status: 'active' });
  const [editing, setEditing] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', price: 0 });

  useEffect(() => {
    fetch('/api/admin/products')
      .then(r => r.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      search: filter.search,
      category: filter.category,
      status: filter.status,
    });
    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => setProducts(data));
  }, [filter]);

  const handleSave = async (product) => {
    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setProducts(prev => prev.filter(p => p._id !== id));
  };

  const handleAdd = () => setEditing(true);
  const cancelEdit = () => setEditing(false);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={handleAdd}>
          <AddProductIcon />
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Input
          placeholder="Search products..."
          value={filter.search}
          onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
        />
        <Select
          value={filter.category}
          onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
          options={['All', 'Men', 'Women', 'Unisex', 'Arabic', 'Designer', 'Niche', 'Gift', 'Body', 'Oils']}
        />
        <Select
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value as 'active' | 'inactive' | 'archived' }))}
          options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }, { label: 'Archived', value: 'archived' }]}
        />
        <Button className="ml-2">Apply</Button>
      </div>

      {/* Table */}
      <Table
        columns={[
          { header: 'Name', accessorKey: 'name', sortable: true },
          { header: 'SKU', accessorKey: 'sku' },
          { header: 'Brand', accessorKey: 'brand' },
          { header: 'Category', accessorKey: 'category' },
          { header: 'Price', accessorKey: 'price', numeric: true },
          { header: 'Status', accessorKey: 'status' },
          { header: 'Actions', accessorKey: 'actions', cell: (p) => (
            <div className="flex gap-2">
              <Button onClick={() => setEditing(p)} size="sm">
                <EditIcon />
              </Button>
              <Button onClick={() => deleteProduct(p._id)} size="sm" dangerous>
                <DeleteIcon />
              </Button>
            </div>
          )},
        ]}
        data={products}
      />

      {/* Edit Modal */}
      {editing && editing._id && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-3">Edit Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Name"
                  value={editing.name}
                  onChange={e => {
                    const updated = { ...editing, name: e.target.value };
                    setEditing(updated);
                  }}
                />
                <Input
                  label="SKU"
                  value={editing.sku}
                  onChange={e => {
                    const updated = { ...editing, sku: e.target.value };
                    setEditing(updated);
                  }}
                />
                <Input
                  type="number"
                  label="Price"
                  value={editing.price}
                  onChange={e => {
                    const updated = { ...editing, price: Number(e.target.value) };
                    setEditing(updated);
                  }}
                />
              </div>
              <div>
                <Select
                  label="Status"
                  value={editing.status}
                  onChange={e => {
                    const updated = { ...editing, status: e.target.value };
                    setEditing(updated);
                  }}
                  options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }, { label: 'Archived', value: 'archived' }]}
                />
                <Select
                  label="Category"
                  value={editing.category}
                  onChange={e => {
                    const updated = { ...editing, category: e.target.value };
                    setEditing(updated);
                  }}
                  options={[{ label: 'Men', value: 'men' }, { label: 'Women', value: 'women' }, { label: 'Unisex', value: 'unisex' }, { label: 'Arabic', value: 'arabic' }, { label: 'Designer', value: 'designer' }, { label: 'Niche', value: 'niche' }, { label: 'Gift', value: 'gift' }, { label: 'Body', value: 'body' }, { label: 'Oils', value: 'oils' }]}
                />
                <Checkbox
                  label="Featured"
                  checked={editing.featured}
                  onChange={() => setEditing(prev => ({ ...prev, featured: !prev.featured }))}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button onClick={handleSave(editing)}>Save</Button>
              <Button onClick={cancelEdit}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {editing && !editing._id && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-3">Add New Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Input
                label="SKU"
                value={newProduct.sku}
                onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
              />
              <Input
                type="number"
                label="Price"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              />
              <Select
                label="Category"
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                options={[{ label: 'Men', value: 'men' }, { label: 'Women', value: 'women' }, { label: 'Unisex', value: 'unisex' }, { label: 'Arabic', value: 'arabic' }, { label: 'Designer', value: 'designer' }, { label: 'Niche', value: 'niche' }, { label: 'Gift', value: 'gift' }, { label: 'Body', value: 'body' }, { label: 'Oils', value: 'oils' }]}
              />
              <Checkbox
                label="Featured"
                checked={newProduct.featured}
                onChange={() => setNewProduct(prev => ({ ...prev, featured: !prev.featured }))}
              />
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <Button onClick={() => {
                fetch('/api/admin/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newProduct),
                }).then(r => r.json()).then(data => {
                  setProducts(prev => [...prev, data]);
                  setNewProduct({ name: '', sku: '', price: 0 });
                  setEditing(false);
                });
              })>Save</Button>
              <Button onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}