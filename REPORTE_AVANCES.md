**Fecha del reporte:** 31 de marzo de 2026
**Ubicación:** web-marca/REPORTE_AVANCES.md

## 📊 Resumen Ejecutivo
El sistema se encuentra estable. Se ha logrado la conexión exitosa entre el frontend y el backend, resolviendo errores de validación de la API. Los productos ya se muestran en la web, aunque con datos parciales (sin imágenes).

## ✅ Avances Recientes
- [x] Backend de Strapi iniciado en puerto 1338.
- [x] Frontend Next.js estable en puerto 3000 (0 issues en consola).
- [x] Importación básica de productos completada.
- [x] Resolución de errores 400 (Bad Request) mediante ajuste de parámetros `populate`.

## 📋 Tareas Pendientes
- [ ] **Esquema de Strapi:** Añadir campos de tipo "Media" (`image` e `images`) al tipo de contenido "Producto".
- [ ] **Relaciones:** Crear relación inversa de Productos en el esquema de Categorías para habilitar contadores.
- [ ] **Imágenes:** Actualizar el script de importación para que suba y asocie archivos de imagen.
- [ ] **Categorías:** Verificar por qué no se listan en el frontend a pesar de estar en la API.

## 📈 Métricas y KPIs
| Indicador | Valor Actual | Meta | Estado |
|-----------|--------------|------|--------|
| Avance general | 35% | 100% | 🟡 En progreso |
| Bugs abiertos | 0 | 0 | 🟢 Al día |

## 🚧 Bloqueos y Riesgos
- Falta definir campos de imagen en Strapi para mostrar fotos reales.
- La ausencia de relaciones inversas impide mostrar el recuento de productos por categoría de forma eficiente.

---
*Reporte actualizado por el agente de ingeniería.*
