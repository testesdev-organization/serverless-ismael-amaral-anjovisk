import { auth } from '@/auth'

export default auth((req) => {
  if (req.auth === null && req.nextUrl.pathname.startsWith('/u/')) {
    const newUrl = new URL('/logout', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

  if (req.auth !== null && (req.nextUrl.pathname === '/logout' || req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/u')) {
    const newUrl = new URL('/u/home', req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
