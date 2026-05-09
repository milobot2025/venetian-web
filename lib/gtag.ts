const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export function pageview(url: string) {
  if (typeof window === 'undefined' || !GA_ID) return;
  window.gtag('config', GA_ID, { page_path: url });
}

export function gtagEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !GA_ID) return;
  window.gtag('event', action, params);
}

export function trackProductView(params: {
  documentId: string;
  name: string;
  sku: string;
  category: string;
  price?: number;
}) {
  gtagEvent('view_item', {
    currency: 'ARS',
    value: params.price,
    items: [{
      item_id: params.sku,
      item_name: params.name,
      item_category: params.category,
      price: params.price,
    }],
  });
}

export function trackWhatsAppConsult(params: {
  productName: string;
  sku: string;
  category: string;
}) {
  gtagEvent('whatsapp_consult', {
    product_name: params.productName,
    sku: params.sku,
    category: params.category,
  });
}

export function trackContactClick() {
  gtagEvent('contact_click');
}

export function trackResellerClick() {
  gtagEvent('reseller_click');
}

export function trackManualDownload(productName: string) {
  gtagEvent('manual_download', { product_name: productName });
}

export function trackSearch(query: string, resultsCount: number) {
  gtagEvent('search', { search_term: query, results_count: resultsCount });
}

export function trackCategoryFilter(category: string) {
  gtagEvent('category_filter', { category });
}

export function trackDistributorClick(distributorName: string) {
  gtagEvent('distributor_click', { distributor_name: distributorName });
}
