import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../core/services/meta.service';
import { SchemaService } from '../../core/services/schema.service';
import { ThemeService } from '../../core/services/theme.service';
import { LucideAngularModule, Code, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <div class="page">
      <nav class="page-nav">
        <div class="nav-container">
          <a routerLink="/" class="logo">
            <div class="logo-mark">
              <lucide-icon [img]="CodeIcon" [size]="18"></lucide-icon>
            </div>
            <span class="logo-text">CodeCanvas</span>
          </a>
          <div class="nav-right">
            <div class="nav-links">
              <a routerLink="/" class="nav-link">Editor</a>
              <a routerLink="/features" class="nav-link">Features</a>
              <a routerLink="/templates" class="nav-link">Templates</a>
              <a routerLink="/faq" class="nav-link active">FAQ</a>
              <a routerLink="/about" class="nav-link">About</a>
            </div>
            <button class="icon-btn theme-toggle" (click)="themeService.toggle()" title="Toggle Theme" id="theme-btn">
              <lucide-icon [img]="themeService.isDark() ? SunIcon : MoonIcon" [size]="15"></lucide-icon>
            </button>
          </div>
        </div>
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
  themeService = inject(ThemeService);
  readonly CodeIcon = Code;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

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
