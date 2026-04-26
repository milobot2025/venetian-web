# Despliegue en Producción - Venetian

Esta guía describe los pasos para desplegar el frontend (Next.js) y backend (Strapi) en producción.

## Arquitectura

- **Frontend**: Next.js 15 (App Router) – desplegar en Vercel (recomendado)
- **Backend**: Strapi v5 – desplegar en Railway (recomendado) o Heroku
- **Base de datos**: PostgreSQL (necesario para producción)
- **Dominio**: `venetian.com.ar` (configurar DNS)

## 1. Preparación

### 1.1. Cuentas necesarias
- [Vercel](https://vercel.com) – para frontend
- [Railway](https://railway.app) o [Heroku](https://heroku.com) – para backend
- [PostgreSQL](https://www.elephantsql.com/) (Railway incluye PostgreSQL)

### 1.2. Configuración del código

#### Variables de entorno – Frontend (`web-marca/.env.production`)
```
NEXT_PUBLIC_STRAPI_URL=https://api.venetian.com.ar
```

#### Variables de entorno – Backend (`web-marca/strapi/.env.production.example`)
Renombrar a `.env.production` y configurar con valores reales.

**Secretos** (generar con `openssl rand -base64 32`):
- `APP_KEYS` – 4 claves separadas por comas
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

*Opcional*: Usar el script `scripts/generate-secrets.js` en la carpeta strapi:
```bash
cd strapi
node scripts/generate-secrets.js
```

**Base de datos PostgreSQL** (ejemplo para Railway):
```
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres:password@railway-host:5432/strapi
```

**Configuración de servidor**:
```
PUBLIC_URL=https://api.venetian.com.ar
CORS_ORIGIN=https://venetian.com.ar,https://www.venetian.com.ar
```

### 1.3. Configuración de CORS en Strapi
El archivo `config/server.ts` ya incluye configuración de CORS que usa la variable `CORS_ORIGIN`.

## 2. Despliegue del Backend (Strapi) en Railway

### Pasos
1. **Crear proyecto en Railway**
   - Conectar repositorio GitHub (seleccionar carpeta `web-marca/strapi`)
   - Railway detectará automáticamente que es un proyecto Node.js

2. **Configurar variables de entorno**
   - Agregar todas las variables del archivo `.env.production`
   - **Importante**: `DATABASE_URL` será proporcionada por Railway al añadir un servicio PostgreSQL

3. **Añadir servicio PostgreSQL**
   - En el dashboard de Railway, hacer clic en "+ New" → "Database" → "PostgreSQL"
   - Railway creará una base de datos y expondrá la variable `DATABASE_URL`

4. **Configurar build y start commands**
   - Build Command: `npm run build`
   - Start Command: `strapi start`
   - Node version: 20 (ver `engines` en package.json)

5. **Desplegar**
   - Railway comenzará el despliegue automáticamente
   - Verificar logs para asegurar que Strapi se inicia correctamente

6. **Crear usuario admin**
   - Una vez desplegado, acceder a `https://api.venetian.com.ar/admin`
   - Completar el formulario de registro (solo primera vez)

### Alternativa: Heroku
- Usar buildpack: `heroku/nodejs`
- Añadir addon PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
- Configurar variables de entorno: `heroku config:set KEY=value`
- Deploy: `git push heroku main`

## 3. Despliegue del Frontend (Next.js) en Vercel

### Pasos
1. **Importar proyecto en Vercel**
   - Conectar repositorio GitHub (seleccionar carpeta `web-marca`)
   - Vercel detectará automáticamente que es un proyecto Next.js

2. **Configurar variables de entorno**
   - Agregar `NEXT_PUBLIC_STRAPI_URL` (apuntando a la URL del backend desplegado)

3. **Configurar build settings**
   - Build Command: `next build`
   - Output Directory: `.next`
   - Node version: 20

4. **Dominio personalizado**
   - En "Domains" agregar `venetian.com.ar` y `www.venetian.com.ar`
   - Configurar registros DNS según instrucciones de Vercel

5. **Desplegar**
   - Vercel desplegará automáticamente con cada push a la rama principal
   - Verificar que el frontend se comunique correctamente con el backend

## 4. Configuración de DNS y SSL

### Dominio `venetian.com.ar`
1. **Registrar dominio** (si aún no está registrado)
2. **Configurar registros DNS**:
   - A record: `@` → IP de Vercel (ver dashboard de Vercel)
   - CNAME: `www` → cname.vercel-dns.com
   - Subdominio `api`: apuntar a Railway (ver dashboard de Railway)

3. **SSL automático**
   - Tanto Vercel como Railway proporcionan SSL/TLS automático (Let's Encrypt)

## 5. Comprobación post-despliegue

### Backend
- ✅ `https://api.venetian.com.ar/admin` – panel de administración
- ✅ `https://api.venetian.com.ar/api/productos` – endpoint de productos
- ✅ Base de datos conectada

### Frontend
- ✅ `https://venetian.com.ar` – sitio cargado
- ✅ Catálogo de productos cargando desde backend
- ✅ CSS y imágenes funcionando

### CORS
- ✅ El frontend puede hacer requests al backend sin errores de CORS

## 6. Scripts de utilidad

### `scripts/deploy-backend.sh` (ejemplo)
```bash
#!/bin/bash
cd strapi
railway up --service strapi
```

### `scripts/deploy-frontend.sh` (ejemplo)
```bash
#!/bin/bash
vercel --prod
```

## 7. Monitoreo y mantenimiento

### Backend
- **Logs**: Dashboard de Railway / Heroku
- **Backups**: Configurar backups automáticos de PostgreSQL
- **Updates**: Mantener Strapi y dependencias actualizadas

### Frontend
- **Analytics**: Integrar Google Analytics (variable `NEXT_PUBLIC_GA_ID`)
- **Performance**: Usar Vercel Analytics

## 8. Solución de problemas

### Error: "Database connection failed"
- Verificar `DATABASE_URL` o variables individuales
- Asegurar que la base de datos PostgreSQL está activa

### Error: "CORS blocked"
- Verificar variable `CORS_ORIGIN` en backend
- Incluir exactamente la URL del frontend

### Error: "Frontend no carga productos"
- Verificar `NEXT_PUBLIC_STRAPI_URL` en frontend
- Comprobar que el backend está respondiendo

---

**Nota**: Esta configuración asume que Strapi ya tiene contenido (productos, categorías). Si es la primera vez, crear contenido desde el panel admin antes de desplegar frontend.