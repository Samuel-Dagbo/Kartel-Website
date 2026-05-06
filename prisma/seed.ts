import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('MongoDB connected');

  // Ensure roles setting exists
  const RoleModel = require('@/app/models/Setting').model;
  await RoleModel.findOneAndUpdate({ key: 'roles' }, { value: 'Owner,Manager,Cashier,Staff' }, { upsert: true });

  // Categories
  const categories = [
    { name: "Men's Perfumes", slug: "men", description: "Men's fragrances" },
    { name: "Women's Perfumes", slug: "women", description: "Women's fragrances" },
    { name: "Unisex", slug: "unisex", description: "Unisex fragrances" },
    { name: "Arabic Perfumes", slug: "arabic", description: "Arabic fragrances" },
    { name: "Designer Brands", slug: "designer", description: "Designer perfume brands" },
    { name: "Niche Perfumes", slug: "niche", description: "Niche perfume houses" },
    { name: "Gift Sets", slug: "gift", description: "Gift perfume sets" },
    { name: "Body Sprays", slug: "body", description: "Body sprays and mists" },
    { name: "Oils / Attars", slug: "oils", description: "Perfume oils and attars" },
  ];
  for (const c of categories) {
    await mongoose.connection.db.collection('categories').updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
  }

  // Sample brands
  const brands = ['Unique Perfumes', 'Aroma', 'Luxury scent', 'Eternal', 'Royal Essence'];
  for (const b of brands) {
    await mongoose.connection.db.collection('brands').updateOne({ name: b }, { $set: {} }, { upsert: true });
  }

  // Sample products (15)
  const catDocs = await mongoose.connection.db.collection('categories').find({}).toArray();
  const existing = await mongoose.connection.db.collection('products').find({}).limit(1).toArray();
  if (existing.length === 0) {
    for (let i = 1; i <= 15; i++) {
      await mongoose.connection.db.collection('products').insertOne({
        name: `Perfume ${i}`,
        sku: `P${i}`,
        brand: 'Unique Perfumes',
        category: { _id: catDocs[0]._id }, // just use first category
        description: `Description for perfume ${i}`,
        notes: '',
        fragranceNotes: ['top', 'middle', 'base'],
        longevity: '6 hours',
        sillage: 'moderate',
        price: i * 50,
        costPrice: (i * 50) * 0.6,
        sizes: ['30ml', '50ml'],
        quantity: 100,
        images: [`/images/perfume${i}.jpg`],
        featured: i % 5 === 0,
        status: 'active',
      });
    }
    console.log('Inserted 15 sample products');
  }

  // Create admin user if not exist
  const users = await mongoose.connection.db.collection('users').find({}).limit(1).toArray();
  if (users.length === 0) {
    await mongoose.connection.db.collection('users').insertOne({
      name: 'Admin Owner',
      email: 'admin@uniqueperfumes.com',
      passwordHash: 'hashed',
      role: 'Owner',
    });
    console.log('Created admin user');
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});