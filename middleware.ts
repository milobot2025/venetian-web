import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirectsList from './public/sku-rewrites.json';

// Construir Map para O(1) lookup. Se ejecuta una vez al boot del edge worker.
const REDIRECT_MAP = new Map<string, string>();
for (const r of redirectsList as Array<{ source: string; destination: string; permanent: boolean }>) {
  // Normalizar source a lowercase para match case-insensitive
  REDIRECT_MAP.set(r.source.toLowerCase(), r.destination);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Solo intercepta paths de producto. Otros casos pasan directo.
  if (!pathname.startsWith('/producto/')) return NextResponse.next();
  // Si la URL ya es la canónica destino, no hacer nada.
  const key = pathname.toLowerCase();
  const destination = REDIRECT_MAP.get(key);
  if (!destination) return NextResponse.next();
  // Si el destination es el mismo path (no cambio), continuar
  if (destination.toLowerCase() === pathname.toLowerCase()) return NextResponse.next();
  // Redirect 308 permanent
  const url = request.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Solo se aplica a rutas /producto/* (no toca /admin, /api, /_next, etc.)
  matcher: ['/producto/:path*'],
};
