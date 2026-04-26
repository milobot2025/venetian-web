import { AdminClient } from '@/components/admin/AdminClient';
import { fetchProductsFromStrapi, fetchCategoriesFromStrapi } from '@/lib/strapi-api';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [products, categories] = await Promise.all([
    fetchProductsFromStrapi(),
    fetchCategoriesFromStrapi(),
  ]);

  return <AdminClient initialProducts={products} initialCategories={categories} />;
}