import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SchemaService {
  private doc = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  private injectedScripts: HTMLScriptElement[] = [];

  /**
   * Injects a JSON-LD structured data script tag into the document <head>.
   */
  injectSchema(schema: object): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    this.doc.head.appendChild(script);
    this.injectedScripts.push(script);
  }

  /**
   * Removes all previously injected schema scripts.
   */
  removeAllSchemas(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.injectedScripts.forEach(script => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    this.injectedScripts = [];
  }

  /**
   * Convenience: inject WebApplication schema
   */
  injectWebApplicationSchema(): void {
    this.injectSchema({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'CodeCanvas',
      'url': 'https://codecanvas.vercel.app',
      'description': 'Free online HTML CSS JavaScript compiler with live preview. Write, compile, and test code instantly in your browser.',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'All',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    });
  }

  /**
   * Convenience: inject BreadcrumbList schema
   */
  injectBreadcrumbSchema(items: { name: string; url: string }[]): void {
    this.injectSchema({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    });
  }

  /**
   * Convenience: inject FAQPage schema
   */
  injectFaqSchema(faqs: { question: string; answer: string }[]): void {
    this.injectSchema({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    });
  }
}
