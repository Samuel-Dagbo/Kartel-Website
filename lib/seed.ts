import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import mongoose from 'mongoose'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import User from '@/models/User'

const PERFUME_IMAGES = [
  'https://images.unsplash.com/photo-1594035910382-6a517397765c?w=800&q=80',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  'https://images.unsplash.com/photo-1523293188086-b431e93f9afb?w=800&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
  'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=800&q=80',
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80',
  'https://images.unsplash.com/photo-1595535373197-8b8e90e2a5c3?w=800&q=80',
  'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
  'https://images.unsplash.com/photo-1594035910382-6a517397765c?w=800&q=80',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  'https://images.unsplash.com/photo-1523293188086-b431e93f9afb?w=800&q=80',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
]

const BRANDS = ['CARL JONES', 'Velvet Scents', 'Desert Gold', 'Starlight Fragrances', 'Bloom House', 'Royal Scents', 'Aqua Essence', 'Dark Art', 'Pure Essence', 'Luxe Parfums']

const CATEGORIES = ['womens', 'mens', 'unisex']

const CONCENTRATIONS = ['EDT', 'EDP', 'Parfum']

const SIZES = ['30ml', '50ml', '75ml', '100ml']

const NOTES_TOP = ['Bergamot', 'Lemon', 'Orange', 'Lime', 'Grapefruit', 'Pear', 'Apple', 'Mint', 'Sea Salt', 'Saffron', 'Cardamom', 'Black Pepper']

const NOTES_MIDDLE = ['Rose', 'Jasmine', 'Lily', 'Lavender', 'Geranium', 'Iris', 'Lotus', 'Peony', 'Orange Blossom', 'Tuberose', 'Cinnamon', 'Black Pepper', 'Tobacco', 'Leather', 'Green Tea']

const NOTES_BASE = ['Vanilla', 'Sandalwood', 'Musk', 'Patchouli', 'Oud', 'Amber', 'Cedar', 'Vetiver', 'Tonka Bean', 'Incense', 'Dark Chocolate', 'White Musk', 'Cashmere', 'Guaiac Wood']

const TAGS = ['Fresh', 'Warm', 'Floral', 'Woody', 'Oriental', 'Citrus', 'Spicy', 'Sweet', 'Dark', 'Light', 'Classic', 'Modern', 'Luxury', 'Elegant', 'Bold', 'Soft', 'Pure', 'Intense']

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomItems<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateProduct(index: number) {
  const isUnisex = Math.random() > 0.6
  const category = isUnisex ? 'unisex' : (Math.random() > 0.5 ? 'womens' : 'mens')
  
  const topNotes = getRandomItems(NOTES_TOP, 2, 4)
  const middleNotes = getRandomItems(NOTES_MIDDLE, 2, 3)
  const baseNotes = getRandomItems(NOTES_BASE, 2, 3)
  const productTags = getRandomItems(TAGS, 2, 4)

  const baseNames = [
    'Midnight', 'Golden', 'Celestial', 'Eternal', 'Royal', 'Ocean', 'Noir', 'Ivory',
    'Velvet', 'Silk', 'Shadow', 'Light', 'Dream', 'Storm', 'Sunset', 'Dawn',
    'Mystic', 'Secret', 'Luxe', 'Pure', 'Divine', 'Rare', 'Elite', 'Prestige',
    'Amber', 'Pearl', 'Diamond', 'Platinum', 'Emerald', 'Sapphire', 'Crimson', 'Silver'
  ]

  const prefixNames = ['Bloom', 'Oasis', 'Mist', 'Rose', 'Breeze', 'Absolute', 'Silk', 'Essence', 'Aura', 'Essence', 'Elixir', 'Nectar', ' Essence', 'Capture']

  const name = `${getRandomItem(baseNames)} ${getRandomItem(prefixNames)}`
  const brand = getRandomItem(BRANDS)
  
  const descriptions = [
    `A captivating ${productTags[0].toLowerCase()} fragrance that embodies elegance and sophistication. ${name} blends rare ingredients to create an unforgettable sensory experience.`,
    `An exquisite scent that captures the essence of luxury. This ${productTags[0].toLowerCase()} fragrance features rare notes and masterful composition.`,
    `${name} is a stunning ${productTags[0].toLowerCase()} perfume that radiates confidence and charm. Perfect for those who appreciate the finer things in life.`,
    `A timeless creation that speaks to the soul. ${name} combines ${topNotes[0].toLowerCase()} and ${baseNotes[0].toLowerCase()} for an extraordinary result.`,
    `Experience the art of perfumery with ${name}. A ${productTags[0].toLowerCase()} masterpiece that leaves a lasting impression.`,
  ]

  return {
    name,
    description: getRandomItem(descriptions),
    price: Math.floor(Math.random() * 1500) + 300,
    comparePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 800) + 2000 : null,
    images: [PERFUME_IMAGES[index % PERFUME_IMAGES.length]],
    category,
    brand,
    notes: {
      top: topNotes,
      middle: middleNotes,
      base: baseNotes,
    },
    size: getRandomItem(SIZES),
    concentration: getRandomItem(CONCENTRATIONS),
    quantity: Math.floor(Math.random() * 80) + 10,
    inStock: true,
    featured: Math.random() > 0.7,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 200) + 10,
    tags: productTags,
  }
}

const SEED_USERS = [
  {
    name: 'Admin User',
    email: 'admin@carljones.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Customer',
    email: 'john@customer.com',
    password: 'customer123',
    role: 'user',
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
  },
]

async function seed() {
  try {
    console.log('Connecting to database...')
    await connectDB()
    const db = mongoose.connection.db!

    console.log('Creating users...')
    await User.deleteMany({})
    for (const user of SEED_USERS) {
      await User.create(user)
      console.log(`Created user: ${user.email} (${user.role})`)
    }

    console.log('Seeding products...')
    await Product.deleteMany({})

    const productsToCreate = []
    for (let i = 0; i < 30; i++) {
      const product = generateProduct(i)
      productsToCreate.push({
        ...product,
        slug: product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + i
      })
    }

    await Product.insertMany(productsToCreate)
    console.log(`Successfully seeded ${productsToCreate.length} products!`)

    console.log('\n=== LOGIN CREDENTIALS ===')
    console.log('Admin: admin@carljones.com / admin123')
    console.log('Customer: john@customer.com / customer123')
    console.log('Customer 2: sarah@example.com / password123')
    console.log('=========================\n')

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()