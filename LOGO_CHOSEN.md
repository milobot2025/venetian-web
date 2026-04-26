# Logo elegido para Venetian

**Fecha**: 29 de marzo de 2026
**Archivo fuente**: `credit_risk/static/LOGO nuevo.png`
**Destino**: `public/logo.png`

## Decisión
- No fue posible extraer imágenes del PDF `DMX_con_logos_copia.pdf` automáticamente (limitaciones técnicas).
- Se seleccionó el logo existente en el proyecto que parece ser redondo (1563×1563 px).
- El logo se integró en los componentes `Header.tsx` y `Footer.tsx` reemplazando el placeholder con la letra "V".

## Instrucciones para cambiar
1. Reemplazar `public/logo.png` con el logo redondo preferido del PDF.
2. Asegurar que tenga fondo transparente y formato PNG.
3. Si el logo no es redondo, ajustar la clase CSS `rounded-full` en los componentes.
4. Regenerar favicon.ico si es necesario.

El usuario puede indicar si desea otro logo y se procederá a extraerlo del PDF manualmente.