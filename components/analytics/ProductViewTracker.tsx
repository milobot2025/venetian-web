'use client';

import { useEffect } from 'react';
import { trackProductView } from '@/lib/gtag';

interface ProductViewTrackerProps {
  documentId: string;
  name: string;
  sku: string;
  category: string;
  price?: number;
}

export default function ProductViewTracker({ documentId, name, sku, category, price }: ProductViewTrackerProps) {
  useEffect(() => {
    trackProductView({ documentId, name, sku, category, price });
  }, [documentId, name, sku, category, price]);

  return null;
}
