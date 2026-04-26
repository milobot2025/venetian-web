# DIAGNÓSTICO DEL PROYECTO WEB-MARCA (Venetian)
*Fecha: 29 de marzo de 2026*
*Última revisión: Análisis automatizado*

## 📋 RESUMEN EJECUTIVO

El proyecto **web-marca** (catálogo Venetian) tiene una base sólida pero presenta **problemas críticos** que impiden su funcionamiento, especialmente en el backend Strapi. El frontend Next.js está desarrollado pero **no se comunica con la API** (usa datos estáticos). Strapi **no inicia** debido a conflictos de nombres, bloqueando toda operación del CMS.

---

## 🚨 PROBLEMAS CRÍTICOS (IMPIDEN FUNCIONAMIENTO)

### 1. **STOP: Strapi no inicia - Error de nombres duplicados**
**Archivo:** `strapi/strapi.log` (líneas 4-6)
**Error:** `Error: The singular name "categoria" should be unique`

**Causa:** Conflicto entre dos APIs con nombres similares:
- `src/api/category/` (singularName: "category") ← API activa
- `categoria.backup/` (singularName: "categoria") ← Carpeta backup en raíz

**Impacto:** Strapi NO ARRANCA. Sin backend, no hay API, no hay importación de datos, no hay CMS.

**Solución inmediata:**
```bash
# Eliminar las carpetas backup conflictivas
rm -rf "C:\Users\User\milobot\web-marca\strapi\categoria.backup"
rm -rf "C:\Users\User\milobot\web-marca\strapi\producto.backup"
```

### 2. **STOP: Importación fallida - "Method Not Allowed"**
**Archivo:** `strapi/import3.log` (540 errores consecutivos)
**Errores:** `❌ Error creando categoría "linga": Method Not Allowed`

**Causa:** Los endpoints POST (`/api/categories`, `/api/productos`) rechazan peticiones porque:
1. Strapi no inicia (problema anterior)
2. Permisos de roles no configurados para creación
3. Token de administrador inválido/ausente

**Impacto:** Los 1138 productos del catálogo NO se importan. Catálogo vacío.

---

## ⚠️ PROBLEMAS GRAVES (AFECTAN FUNCIONALIDAD)

### 3. **Configuración CORS demasiado restrictiva**
**Archivo:** `strapi/config/middlewares.ts` (líneas 10-13)
```typescript
origin: ['https://venetian.com.ar', 'https://www.venetian.com.ar']
```

**Problema:** Solo permite orígenes de producción, bloqueando:
- Desarrollo local (`http://localhost:3000`)
- Previsualizaciones de Vercel
- Testing y desarrollo

**Solución:** Agregar orígenes de desarrollo:
```typescript
origin: [
  'https://venetian.com.ar',
  'https://www.venetian.com.ar',
  'http://localhost:3000',
  'http://localhost:1337'
]
```

### 4. **Frontend usando datos estáticos (no consume API)**
**Archivo:** `lib/api.ts` (línea 2)
```typescript
const USE_STATIC_DATA = true;  // ← DEBE SER false
```

**Problema:** El frontend carga datos desde `public/products-data.json` en lugar de consumir Strapi. Anula el propósito del CMS.

**Impacto:** Cambios en Strapi NO se reflejan en el sitio.

### 5. **Permisos de roles mal configurados**
**Archivo:** `strapi/scripts/setup-permissions.js` (líneas 43-45)
```typescript
const contentTypes = [
  'api::producto.producto',
  'api::categoria.categoria',  // ← ERROR: Debe ser 'api::category.category'
];
```

**Problema:** Los permisos no se aplican a la colección real `category`.

---

## 🐛 PROBLEMAS TÉCNICOS

### 6. **Errores TypeScript en frontend**
**Archivo:** `lib/api.ts`
**Error:** `TS2322: Type 'StaticData | null' is not assignable to type 'StaticData'`

**Problema:** El código no maneja correctamente `cachedData` nulo.

### 7. **Configuración de base de datos ambigua**
**Archivo:** `strapi/.env`
```bash
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

**Problema:** SQLite es para desarrollo, no producción. Limitaciones:
- No escala
- No soporta múltiples instancias
- No recomendado para entornos cloud

**Recomendación:** Migrar a PostgreSQL para producción.

---

## 📋 CHECKLIST DE TAREAS PENDIENTES

### FRONTEND (Next.js)
- [ ] **Cambiar `USE_STATIC_DATA = false`** en `lib/api.ts`
- [ ] **Corregir error TypeScript** en función `loadStaticData()`
- [ ] **Verificar build** (`npm run build`) sin errores
- [ ] **Configurar variables de entorno** `.env.production` con `NEXT_PUBLIC_STRAPI_URL`

### BACKEND (Strapi)
- [ ] **Eliminar APIs duplicadas** (`categoria.backup`, `producto.backup`)
- [ ] **Iniciar Strapi exitosamente** (`npm run develop`)
- [ ] **Corregir CORS** para desarrollo + producción
- [ ] **Configurar permisos correctamente** (ejecutar `setup-permissions.js`)
- [ ] **Generar secrets de producción** con `openssl rand -base64 32`
- [ ] **Migrar a PostgreSQL** (configurar `DATABASE_URL`)
- [ ] **Configurar `.env.production`** con todas las variables necesarias
- [ ] **Importar catálogo exitosamente** (1138 productos)

### DESPLIEGUE
- [ ] **Backend en Railway/Heroku** con PostgreSQL
- [ ] **Frontend en Vercel** con dominio `venetian.com.ar`
- [ ] **Configurar DNS**: `api.venetian.com.ar` → backend
- [ ] **SSL/TLS** automático (Let's Encrypt)
- [ ] **Verificar comunicación** frontend-backend sin errores CORS

---

## 🔧 PASOS DE SOLUCIÓN INMEDIATA

### Fase 1: Arreglar Strapi (HOY)
1. **Eliminar conflictos:**
   ```bash
   cd C:\Users\User\milobot\web-marca\strapi
   rm -rf categoria.backup producto.backup
   ```
2. **Iniciar Strapi:**
   ```bash
   npm run develop
   ```
3. **Verificar que arranca** en `http://localhost:1337/admin`

### Fase 2: Configurar permisos y CORS (HOY)
1. **Corregir `setup-permissions.js`:**
   - Cambiar `'api::categoria.categoria'` → `'api::category.category'`
2. **Ejecutar script de permisos:**
   ```bash
   node scripts/setup-permissions.js
   ```
3. **Actualizar CORS** en `config/middlewares.ts`
4. **Reiniciar Strapi**

### Fase 3: Importar catálogo (HOY)
1. **Verificar que los endpoints POST funcionen**
2. **Ejecutar script de importación** (si existe) o importar manualmente
3. **Verificar datos** en `http://localhost:1337/api/productos`

### Fase 4: Conectar frontend (HOY-MAÑANA)
1. **Cambiar `USE_STATIC_DATA = false`** en `lib/api.ts`
2. **Corregir error TypeScript** (retornar objeto vacío en lugar de null)
3. **Iniciar frontend:**
   ```bash
   npm run dev
   ```
4. **Verificar que carga productos desde Strapi**

---

## 📁 ARCHIVOS CLAVE PARA REVISIÓN

| Archivo | Problema | Estado |
|---------|----------|--------|
| `strapi/categoria.backup/` | Conflicto de nombres | **CRÍTICO** |
| `strapi/config/middlewares.ts` | CORS restrictivo | **ALTO** |
| `strapi/scripts/setup-permissions.js` | Permisos incorrectos | **ALTO** |
| `lib/api.ts` | Datos estáticos + error TS | **MEDIO** |
| `strapi/.env` | SQLite (no producción) | **MEDIO** |
| `next.config.ts` | Ignora errores TypeScript | **BAJO** |
| `CHECKLIST.md` | Tareas pendientes | **GUÍA** |
| `DEPLOY.md` | Instrucciones despliegue | **GUÍA** |

---

## 🚀 PREPARACIÓN PARA PRODUCCIÓN

### Secrets necesarios (generar con `openssl rand -base64 32`):
- `APP_KEYS` (4 claves separadas por comas)
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

### Variables de entorno BACKEND (`strapi/.env.production`):
```bash
DATABASE_URL=postgresql://usuario:password@host:5432/strapi
PUBLIC_URL=https://api.venetian.com.ar
CORS_ORIGIN=https://venetian.com.ar,https://www.venetian.com.ar,http://localhost:3000
# + todos los secrets generados
```

### Variables de entorno FRONTEND (`web-marca/.env.production`):
```bash
NEXT_PUBLIC_STRAPI_URL=https://api.venetian.com.ar
```

---

## 📈 ESTADO ACTUAL DE COMPONENTES

| Componente | Estado | Notas |
|------------|--------|-------|
| **Strapi Backend** | ❌ NO FUNCIONA | Error de nombres duplicados |
| **API REST** | ❌ NO DISPONIBLE | Strapi no inicia |
| **Base de datos** | ⚠️ SQLite (dev) | Funciona localmente |
| **Frontend Next.js** | ⚠️ CON DATOS ESTÁTICOS | Build con errores TS |
| **Catálogo de productos** | ❌ NO IMPORTADO | 0/1138 productos |
| **Panel Admin** | ❌ NO ACCESIBLE | Strapi no inicia |
| **Despliegue** | ❌ NO CONFIGURADO | Dominios no apuntan |

---

## 🆘 PRÓXIMOS PASOS RECOMENDADOS

1. **Ejecutar Fase 1 inmediatamente** (eliminar backups conflictivos)
2. **Verificar que Strapi inicia** sin errores
3. **Importar catálogo** desde `productos_con_subtipo.xlsx`
4. **Conectar frontend** a la API real
5. **Completar checklist** de producción
6. **Desplegar** según `DEPLOY.md`

---

## 📞 SOPORTE TÉCNICO

- **Logs de error:** `strapi/strapi.log`, `strapi/import*.log`
- **Configuración Strapi:** `strapi/config/`
- **API Frontend:** `lib/api.ts`
- **Checklist:** `CHECKLIST.md`
- **Despliegue:** `DEPLOY.md`

---

*Documento generado automáticamente por análisis del proyecto.*
*Última actualización: 29/03/2026*
