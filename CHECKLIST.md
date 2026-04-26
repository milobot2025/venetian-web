# Checklist de configuración para producción

## Frontend (Next.js)
- [ ] Archivo `.env.production` configurado con `NEXT_PUBLIC_STRAPI_URL`
- [ ] Página principal (`app/page.tsx`) marcada como dinámica (`dynamic = 'force-dynamic'`)
- [ ] Cliente API (`lib/api.ts`) maneja errores de build (fallback a datos vacíos)
- [ ] Build pasa sin errores (`npm run build`)

## Backend (Strapi)
- [ ] Archivo `.env.production` generado con secrets reales
- [ ] Secrets generados con `openssl rand -base64 32`:
  - `APP_KEYS` (4 claves separadas por comas)
  - `API_TOKEN_SALT`
  - `ADMIN_JWT_SECRET`
  - `TRANSFER_TOKEN_SALT`
  - `JWT_SECRET`
  - `ENCRYPTION_KEY`
- [ ] Configuración de base de datos PostgreSQL (`DATABASE_URL` o variables individuales)
- [ ] Configuración de CORS en `config/server.ts` (ya actualizado)
- [ ] Variable `PUBLIC_URL` apuntando a la URL pública del backend
- [ ] Variable `CORS_ORIGIN` con dominios permitidos

## Despliegue
- [ ] Backend desplegado en Railway/Heroku
- [ ] Base de datos PostgreSQL conectada
- [ ] Frontend desplegado en Vercel
- [ ] Dominio `venetian.com.ar` configurado en Vercel
- [ ] Subdominio `api.venetian.com.ar` apuntando a backend
- [ ] SSL/TLS funcionando en ambos

## Comprobación post-despliegue
- [ ] Backend: `https://api.venetian.com.ar/admin` accesible
- [ ] Backend: `https://api.venetian.com.ar/api/productos` devuelve datos
- [ ] Frontend: `https://venetian.com.ar` carga sin errores
- [ ] Frontend: Catálogo muestra productos desde backend
- [ ] CORS: No hay errores de CORS en consola del navegador

## Archivos modificados/creados
- `web-marca/.env.production`
- `web-marca/.env.production.example`
- `web-marca/strapi/.env.production.example`
- `web-marca/strapi/config/server.ts`
- `web-marca/app/page.tsx`
- `web-marca/lib/api.ts`
- `web-marca/DEPLOY.md`
- `web-marca/scripts/deploy-backend.sh`
- `web-marca/scripts/deploy-frontend.sh`
- `web-marca/CHECKLIST.md` (este archivo)