import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../core/services/meta.service';
import { SchemaService } from '../../core/services/schema.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <nav class="page-nav">
        <a routerLink="/" class="back-link">
          <span>⟨/⟩</span> CodeCanvas
        </a>
      </nav>
      <div class="page-content">
        <div class="breadcrumb">
          <a routerLink="/">Home</a> / <span>FAQ</span>
        </div>
        <h1 class="page-title">Frequently Asked Questions</h1>
        <p class="page-subtitle">Everything you need to know about CodeCanvas.</p>

        <div class="faq-list">
          @for (faq of faqs; track faq.q; let i = $index) {
            <details class="faq-item" [attr.id]="'faq-' + i">
              <summary class="faq-question">{{ faq.q }}</summary>
              <div class="faq-answer">{{ faq.a }}</div>
            </details>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './faq.component.css',
})
export class FaqComponent implements OnInit {
  private meta = inject(MetaService);
  private schema = inject(SchemaService);

  faqs = [
    { q: 'What is CodeCanvas?', a: 'CodeCanvas is a free, browser-based online HTML, CSS, and JavaScript compiler that lets you write, compile, and test code instantly with a live preview.' },
    { q: 'Do I need to install anything?', a: 'No! CodeCanvas runs entirely in your browser. No downloads, plugins, or sign-ups required.' },
    { q: 'Is CodeCanvas free?', a: 'Yes, CodeCanvas is completely free to use with no limits or premium tiers.' },
    { q: 'Does my code get saved?', a: 'Yes, your code is automatically saved to your browser\'s localStorage. It persists across sessions on the same device.' },
    { q: 'Can I download my code?', a: 'Yes! Click the download button to export your project as a single HTML file.' },
    { q: 'What code editor does CodeCanvas use?', a: 'CodeCanvas uses Monaco Editor, the same editor that powers Visual Studio Code, with full syntax highlighting, autocomplete, and IntelliSense.' },
    { q: 'Is the preview sandboxed?', a: 'Yes. The preview iframe is sandboxed with allow-scripts permission for security while supporting full JavaScript execution.' },
    { q: 'Can I use external libraries?', a: 'Yes! You can include external CSS and JavaScript libraries by adding link and script tags in your HTML code.' },
    { q: 'Does CodeCanvas work on mobile?', a: 'Yes, CodeCanvas is responsive and works on mobile devices, though a desktop experience is recommended for the best coding experience.' },
    { q: 'How do I report a bug?', a: 'You can report bugs through our GitHub repository or contact us through the About page.' },
  ];

  ngOnInit(): void {
    this.meta.setMeta({
      title: 'FAQ — CodeCanvas Online HTML Compiler',
      description: 'Frequently asked questions about CodeCanvas. Learn how to use the free online HTML, CSS, and JavaScript compiler.',
      keywords: 'codecanvas faq, html compiler faq, online editor questions, code editor help',
      canonicalUrl: 'https://codecanvas.vercel.app/faq',
    });
    this.schema.injectFaqSchema(
      this.faqs.map(f => ({ question: f.q, answer: f.a }))
    );
    this.schema.injectBreadcrumbSchema([
      { name: 'Home', url: 'https://codecanvas.vercel.app/' },
      { name: 'FAQ', url: 'https://codecanvas.vercel.app/faq' },
    ]);
  }
}
