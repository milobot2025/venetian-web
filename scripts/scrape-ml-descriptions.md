Crear un script Node.js en scripts/scrape-ml-descriptions.js que:

1. Lee los productos desde Strapi API:
   GET https://strapi-backend-production-35d0.up.railway.app/api/productos?pagination[pageSize]=200&populate=*
   Headers: Authorization: Bearer b430d7dbda584ecc6b469fc1e68f5811097fab28d07dc3af21e966bf2c51b4f016daf99191f9d1409511d36167c2559d0fb7a22104177e9cdae17bcad85156b1a71d0cb8086be1dc2ca685f4b92b27e402827a8bff67501721bed818631fbf0a439ce48348295c2c9eb12d477d21535237860a0ce4c6dfa453d026b739d7aff0

2. Para cada producto que tenga descripción corta (menos de 80 chars) o vacía:
   a. Busca en MercadoLibre Argentina: https://api.mercadolibre.com/sites/MLA/search?q=<titulo_producto>&limit=3
   b. Del primer resultado que matchee bien, obtiene el item_id
   c. Llama a https://api.mercadolibre.com/items/<item_id>/description
   d. Extrae el campo "plain_text"

3. Limpia el texto: elimina saltos de línea excesivos, bullet points raros, referencias a MercadoLibre o vendedores. Deja máximo 500 chars.

4. Actualiza el producto en Strapi:
   PUT https://strapi-backend-production-35d0.up.railway.app/api/productos/<documentId>
   Body: { "data": { "description": "<descripcion_limpia>" } }
   Headers: Authorization: Bearer <token>

5. Guarda un log en scripts/ml-scrape-log.json con: { documentId, titulo, descripcion_anterior, descripcion_nueva, fuente_ml_url }

6. Espera 500ms entre requests para no hacer rate limit.

7. Al final muestra resumen: cuántos actualizados, cuántos sin match, cuántos ya tenían descripción larga.

Usa solo fetch nativo (Node 18+), sin dependencias externas.
Manejo de errores: si falla un producto, loguea el error y continúa con el siguiente.
