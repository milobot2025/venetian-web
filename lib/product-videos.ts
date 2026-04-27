// Mapping de productos → video destacado.
// Key: documentId del producto en Strapi.
// Value: ruta del video bajo /videos/products/

export const PRODUCT_VIDEOS: Record<string, { src: string; title: string; modelo: string }> = {
  okdjnyxjinwbm7ya39n8wsnx: { src: '/videos/products/beam-core-150.mp4', title: 'BEAMCORE 150', modelo: 'BEAMCORE 150' },
  gpszfnvne1lgaeq0khsc0lmh: { src: '/videos/products/beam-core-150.mp4', title: 'BEAMCORE 150 KIT', modelo: 'BEAMCORE 150 KIT' },
  u5bakvedcexnzwsr7readq3t: { src: '/videos/products/nova-spider.mp4', title: 'NOVA SPIDER', modelo: 'NOVA SPIDER' },
  k94c597srtu8exguajbdpw5g: { src: '/videos/products/quantum-60.mp4', title: 'QUANTUM 60', modelo: 'QUANTUM 60' },
  ss0xsl7z786rnkohuitcrcyf: { src: '/videos/products/x-photon.mp4', title: 'X-PHOTON', modelo: 'X-PHOTON' },
};

// Para el banner del home: 4 videos destacados (sin duplicar BEAMCORE KIT).
export const HOME_VIDEO_HIGHLIGHTS = [
  { documentId: 'okdjnyxjinwbm7ya39n8wsnx', src: '/videos/products/beam-core-150.mp4', title: 'BEAMCORE 150' },
  { documentId: 'u5bakvedcexnzwsr7readq3t', src: '/videos/products/nova-spider.mp4', title: 'NOVA SPIDER' },
  { documentId: 'k94c597srtu8exguajbdpw5g', src: '/videos/products/quantum-60.mp4', title: 'QUANTUM 60' },
  { documentId: 'ss0xsl7z786rnkohuitcrcyf', src: '/videos/products/x-photon.mp4', title: 'X-PHOTON' },
];
