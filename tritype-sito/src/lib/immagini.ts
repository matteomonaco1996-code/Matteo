import type { ImageMetadata } from 'astro';

// Tutte le foto caricate dal cliente finiscono in src/assets/immagini.
// Pages CMS scrive nel contenuto il percorso "/src/assets/immagini/nome.jpg":
// qui lo trasformiamo in un'immagine che Astro ridimensiona e comprime.
const tutte = import.meta.glob<ImageMetadata>(
  '/src/assets/immagini/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
);

export function immagine(percorso?: string | null): ImageMetadata | null {
  if (!percorso) return null;
  const chiave = '/' + percorso.replace(/^\/+/, '');
  return tutte[chiave] ?? null;
}
