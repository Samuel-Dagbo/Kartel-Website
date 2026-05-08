'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { AdminLayout } from './admin/layout'
import { CustomerLayout } from './customer/layout'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const isAdminRoute = pathname?.startsWith('/admin')
  
  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>
  }
  
  return <CustomerLayout>{children}</CustomerLayout>
}
