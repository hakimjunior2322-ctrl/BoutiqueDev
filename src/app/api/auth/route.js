import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const { action, username, password } = await req.json()

    if (action === 'login') {
      // Vérifier les credentials
      if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        // Créer un JWT token
        const token = jwt.sign(
          { username, role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )

        const response = NextResponse.json(
          { success: true, message: 'Login successful', token },
          { status: 200 }
        )

        // Set cookie
        response.cookies.set('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        })

        return response
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        )
      }
    }

    if (action === 'logout') {
      const response = NextResponse.json(
        { success: true, message: 'Logout successful' },
        { status: 200 }
      )
      response.cookies.delete('auth_token')
      return response
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
