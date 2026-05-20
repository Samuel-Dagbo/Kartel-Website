export interface User {
  _id: string
  email: string
  name: string
  role: 'user' | 'admin'
  image?: string
  shippingAddress?: Address
  createdAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: 'mens' | 'womens' | 'unisex' | 'niche'
  brand: string
  notes: {
    top: string[]
    middle: string[]
    base: string[]
  }
  size: string
  concentration: 'EDT' | 'EDP' | 'Parfum'
  quantity: number
  inStock: boolean
  featured: boolean
  new: boolean
  rating: number
  reviewCount: number
  tags: string[]
  createdAt: string | Date
  updatedAt: string | Date
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export interface Order {
  _id: string
  user: string | User
  items: OrderItem[]
  shippingAddress: Address
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'completed' | 'failed'
  stripePaymentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id: string
  user: User
  product: string
  rating: number
  comment: string
  createdAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
  size?: string
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest' | 'rating'
