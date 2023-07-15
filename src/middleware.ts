import { NextRequest, NextResponse } from 'next/server'

export const middleware = (req: NextRequest) => {
  if (req.url.includes('_next')) return

  const token = req.cookies.get('token')

  if (req.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (req.nextUrl.pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}
