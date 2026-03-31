import type { NextConfig } from "next";
import path from 'path';
import { fileURLToPath } from 'url';
import skuRewrites from './public/sku-rewrites.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbopack: false,
  },
  async rewrites() {
    return [
      // Redirecciones SKU → slug para productos
      ...skuRewrites.map((rewrite: any) => ({
        source: rewrite.source,
        destination: rewrite.destination,
      })),
      // Otras redirecciones pueden agregarse aquí
    ];
  },
  async redirects() {
    return [
      // Redirecciones permanentes (301) para SEO
      ...skuRewrites.map((rewrite: any) => ({
        source: rewrite.source,
        destination: rewrite.destination,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
