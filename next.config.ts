import type { NextConfig } from "next";
import skuRewrites from './public/sku-rewrites.json';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1338',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi-backend-production-35d0.up.railway.app',
        pathname: '/**',
      },
    ],
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
