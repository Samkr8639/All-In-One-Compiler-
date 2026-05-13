import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../core/services/meta.service';
import { SchemaService } from '../../core/services/schema.service';
import { LucideAngularModule, Code } from 'lucide-angular';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <div class="page">
      <nav class="page-nav">
        <a routerLink="/" class="back-link">
          <lucide-icon [img]="CodeIcon" [size]="16"></lucide-icon>
          CodeCanvas
        </a>
      </nav>
      <div class="page-content">
        <div class="breadcrumb">
          <a routerLink="/">Home</a> / <span>Features</span>
        </div>
        <h1 class="page-title">Powerful Features</h1>
        <p class="page-subtitle">Everything you need to write, compile, and test code in your browser.</p>

        <div class="features-grid">
          @for (feature of features; track feature.title) {
            <div class="feature-card">
              <div class="feature-icon">{{ feature.icon }}</div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          }
        </div>

        <div class="cta-section">
          <h2>Ready to start coding?</h2>
          <a routerLink="/" class="cta-btn">Open Editor</a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './features.component.css',
})
export class FeaturesComponent implements OnInit {
  private meta = inject(MetaService);
  private schema = inject(SchemaService);

  // Lucide icon
  readonly CodeIcon = Code;

  features = [
    { icon: 'Zap', title: 'Live Preview', description: 'See your HTML, CSS, and JavaScript changes instantly with real-time preview rendering.' },
    { icon: 'Palette', title: 'Monaco Editor', description: 'Professional-grade code editor with syntax highlighting, autocomplete, and IntelliSense.' },
    { icon: 'Monitor', title: 'Console Output', description: 'Capture console.log, warn, and error messages from your code with color-coded output.' },
    { icon: 'Package', title: 'Starter Templates', description: '10+ ready-to-use templates including Todo App, Landing Page, CSS Animations, and more.' },
    { icon: 'Moon', title: 'Dark/Light Mode', description: 'Switch between dark and light themes for comfortable coding day or night.' },
    { icon: 'Save', title: 'Auto-Save', description: 'Your code is automatically saved to localStorage and persists across sessions.' },
    { icon: 'Smartphone', title: 'Responsive Design', description: 'Works seamlessly on desktop, tablet, and mobile devices.' },
    { icon: 'Download', title: 'Download Code', description: 'Export your project as a single HTML file ready for deployment.' },
    { icon: 'Shield', title: 'Sandboxed Preview', description: 'Iframe preview is sandboxed for security while allowing full JavaScript execution.' },
  ];

  ngOnInit(): void {
    this.meta.setMeta({
      title: 'Features — CodeCanvas Online HTML Compiler',
      description: 'Explore CodeCanvas features: Monaco editor, live preview, console output, starter templates, dark mode, auto-save, and more.',
      keywords: 'html editor features, code editor features, monaco editor, live preview, online compiler features',
      canonicalUrl: 'https://codecanvas.vercel.app/features',
    });
    this.schema.injectBreadcrumbSchema([
      { name: 'Home', url: 'https://codecanvas.vercel.app/' },
      { name: 'Features', url: 'https://codecanvas.vercel.app/features' },
    ]);
  }
}
