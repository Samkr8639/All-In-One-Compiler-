import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../core/services/meta.service';
import { SchemaService } from '../../core/services/schema.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <nav class="page-nav">
        <a routerLink="/" class="back-link"><span>⟨/⟩</span> CodeCanvas</a>
      </nav>
      <div class="page-content">
        <div class="breadcrumb"><a routerLink="/">Home</a> / <span>About</span></div>
        <h1 class="page-title">About CodeCanvas</h1>
        <div class="about-body">
          <p>CodeCanvas is a free, open-source, browser-based HTML, CSS, and JavaScript compiler designed for developers, students, and anyone who wants to quickly prototype and test web code.</p>
          <h2>Our Mission</h2>
          <p>We believe everyone should have access to professional-grade development tools without barriers. CodeCanvas provides a Monaco Editor-powered IDE experience right in your browser — no sign-ups, no downloads, no limits.</p>
          <h2>Features</h2>
          <ul>
            <li>Professional Monaco Editor with syntax highlighting and IntelliSense</li>
            <li>Real-time live preview with sandboxed iframe</li>
            <li>Console output capture (log, warn, error, info)</li>
            <li>10+ starter templates to jump-start your projects</li>
            <li>Dark and light theme support</li>
            <li>Auto-save to localStorage</li>
            <li>Download your project as HTML</li>
            <li>Fully responsive design</li>
          </ul>
          <h2>Technology</h2>
          <p>Built with Angular 21, Monaco Editor, and deployed on Vercel with SSR for optimal performance and SEO.</p>
        </div>
        <div class="cta-section">
          <a routerLink="/" class="cta-btn">Start Coding Now</a>
        </div>
      </div>
    </div>
  `,
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {
  private meta = inject(MetaService);
  private schema = inject(SchemaService);

  ngOnInit(): void {
    this.meta.setMeta({
      title: 'About — CodeCanvas Online HTML Compiler',
      description: 'Learn about CodeCanvas, the free browser-based HTML, CSS, and JavaScript compiler with live preview and professional Monaco Editor.',
      canonicalUrl: 'https://codecanvas.vercel.app/about',
    });
    this.schema.injectBreadcrumbSchema([
      { name: 'Home', url: 'https://codecanvas.vercel.app/' },
      { name: 'About', url: 'https://codecanvas.vercel.app/about' },
    ]);
  }
}
