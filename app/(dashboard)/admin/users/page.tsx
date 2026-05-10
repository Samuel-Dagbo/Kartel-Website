'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Shield, ShieldOff, Trash2, Eye, X, Mail } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  image?: string
  createdAt: string
  wishlist: string[]
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/customer')
    } else if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status, session, router])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
        setSelectedUser(null)
      }
    } catch (error) {
      console.error('Failed to update user role:', error)
    } finally {
      setUpdating(false)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' })
      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId))
        setSelectedUser(null)
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    } finally {
      setUpdating(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-kartel-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-muted text-sm">Loading users...</span>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  const roleStats = [
    { label: 'Total Users', value: users.length, color: 'from-blue-500/20' },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'from-purple-500/20' },
    { label: 'Customers', value: users.filter(u => u.role === 'user').length, color: 'from-green-500/20' },
  ]

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-heading">Users Management</h1>
          <p className="text-muted text-sm mt-1">Manage user roles and accounts</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {roleStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 glass-card rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <Users className="w-4 h-4 text-kartel-gold" />
              </div>
              <div>
                <p className="text-muted text-xs">{stat.label}</p>
                <p className="text-lg font-bold text-heading">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-luxury w-full pl-11 pr-4 py-3 rounded-xl text-sm" 
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input-luxury px-4 py-3 rounded-xl text-sm"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Customer</option>
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-kartel-cream dark:bg-kartel-black">
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">User</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Email</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Role</th>
                <th className="px-5 py-4 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Joined</th>
                <th className="px-5 py-4 text-right text-[10px] font-semibold text-muted uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, i) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden glass shrink-0">
                          {user.image ? (
                            <Image src={user.image} alt={user.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-kartel-gold/20 flex items-center justify-center">
                              <span className="text-kartel-gold text-sm font-medium">
                                {user.name?.charAt(0).toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-heading">{user.name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-muted" />
                        <span className="text-sm text-body">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' 
                          : 'bg-green-500/15 text-green-400 border border-green-500/20'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2 rounded-lg glass-card text-muted hover:text-kartel-gold hover:border-kartel-gold/20 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full glass-card flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-muted" />
                      </div>
                      <p className="text-muted">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
            >
              <div className="p-6 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden glass">
                    {selectedUser.image ? (
                      <Image src={selectedUser.image} alt={selectedUser.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-kartel-gold/20 flex items-center justify-center">
                        <span className="text-kartel-gold text-lg font-medium">
                          {selectedUser.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-heading">
                      {selectedUser.name || 'Guest User'}
                    </h2>
                    <p className="text-muted text-sm">{selectedUser.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-2 rounded-lg glass-card text-muted hover:text-heading hover:border-kartel-gold/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="p-4 rounded-xl glass-card">
                  <p className="text-muted text-xs uppercase tracking-wider mb-3">Current Role</p>
                  <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
                    selectedUser.role === 'admin' 
                      ? 'bg-purple-500/15 text-purple-400' 
                      : 'bg-green-500/15 text-green-400'
                  }`}>
                    {selectedUser.role || 'user'}
                  </span>
                </div>

                <div className="p-4 rounded-xl glass-card">
                  <p className="text-muted text-xs uppercase tracking-wider mb-3">Change Role</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateUserRole(selectedUser._id, 'user')}
                      disabled={updating || selectedUser.role === 'user'}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedUser.role === 'user' 
                          ? 'btn-primary' 
                          : 'glass text-muted hover:text-heading hover:border-kartel-gold/20'
                      } disabled:opacity-40`}
                    >
                      <ShieldOff className="w-4 h-4" />
                      Customer
                    </button>
                    <button
                      onClick={() => updateUserRole(selectedUser._id, 'admin')}
                      disabled={updating || selectedUser.role === 'admin'}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedUser.role === 'admin' 
                          ? 'btn-primary' 
                          : 'glass text-muted hover:text-heading hover:border-kartel-gold/20'
                      } disabled:opacity-40`}
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl glass-card">
                  <p className="text-muted text-xs uppercase tracking-wider mb-3">Account Info</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">User ID</span>
                      <span className="text-body font-mono text-xs">{selectedUser._id.slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Joined</span>
                      <span className="text-body">
                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedUser._id !== session.user.id && (
                  <button
                    onClick={() => deleteUser(selectedUser._id)}
                    disabled={updating}
                    className="w-full py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}