import { Injectable } from '@angular/core';

/**
 * Injects a Google Fonts <link> for a requested family the first time it is
 * used, so a font chosen in the theme editor actually renders in the preview.
 * Without this, selecting anything other than the two fonts hard-coded in
 * index.html / styles.scss set a font-family the browser never downloaded and
 * silently fell back to a default.
 */
@Injectable({ providedIn: 'root' })
export class FontLoaderService {
  private loaded = new Set<string>();

  load(family: string | null | undefined): void {
    const name = (family || '').trim();
    if (!name) return;

    const key = name.toLowerCase();
    if (this.loaded.has(key)) return;
    this.loaded.add(key);

    // Google Fonts expects "+" for spaces (e.g. Open+Sans).
    const familyParam = name.replace(/\s+/g, '+');
    const href =
      `https://fonts.googleapis.com/css2?family=${familyParam}` +
      `:wght@300;400;500;600;700&display=swap`;

    // Don't add a duplicate <link> if one already exists in the document.
    if (document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}
