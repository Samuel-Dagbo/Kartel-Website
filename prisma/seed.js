import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('MongoDB connected');

  // ...seed logic similar to previous seed.ts (omitted for brevity)...
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});