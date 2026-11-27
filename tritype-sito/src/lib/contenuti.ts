import fs from 'node:fs';
import path from 'node:path';
import { load } from 'js-yaml';

// Legge i file YAML modificati dal cliente tramite Pages CMS.
export function leggi<T = any>(nome: string): T {
  const file = path.join(process.cwd(), 'src/contenuti', `${nome}.yml`);
  return (load(fs.readFileSync(file, 'utf8')) ?? {}) as T;
}

// I segnaposto "[DA INSERIRE: ...]" non vanno trasformati in link.
export const segnaposto = (v?: string) => !v || v.trim().startsWith('[');

// Divide un testo in paragrafi sulle righe vuote.
export const paragrafi = (testo = '') =>
  testo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
