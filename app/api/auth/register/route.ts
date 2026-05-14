import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all fields' },
        { status: 400 }
      )
    }

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    })

    sendWelcomeEmail(email, name).catch(err => console.error('Welcome email failed:', err))

    return NextResponse.json(
      { message: 'User created successfully', userId: user._id },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}