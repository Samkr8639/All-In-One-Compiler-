import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MetaService {
  private meta = inject(Meta);
  private title = inject(Title);
  private doc = inject(DOCUMENT);

  private readonly siteName = 'CodeCanvas';
  private readonly defaultImage = '/assets/og/og-image.png';
  private readonly baseUrl = 'https://codecanvas.vercel.app';

  setMeta(config: {
    title: string;
    description: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    robots?: string;
    author?: string;
  }): void {
    const fullTitle = config.title;

    // Title
    this.title.setTitle(fullTitle);

    // Standard meta
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords || '' });
    this.meta.updateTag({ name: 'robots', content: config.robots || 'index, follow' });
    this.meta.updateTag({ name: 'author', content: config.author || 'CodeCanvas' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.ogImage || this.defaultImage });
    this.meta.updateTag({ property: 'og:url', content: config.canonicalUrl || this.baseUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.ogImage || this.defaultImage });
    this.meta.updateTag({ name: 'twitter:creator', content: '@codecanvas' });

    // Canonical URL
    if (config.canonicalUrl) {
      this.setCanonical(config.canonicalUrl);
    }
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.doc.head.appendChild(link);
    }
  }

  removeCanonical(): void {
    const link = this.doc.querySelector('link[rel="canonical"]');
    if (link) {
      link.remove();
    }
  }
}
