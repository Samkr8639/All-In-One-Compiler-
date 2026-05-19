import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../core/services/meta.service';
import { TemplatesService } from '../../core/services/templates.service';
import { ThemeService } from '../../core/services/theme.service';
import { Template } from '../../shared/models/editor-state.model';
import { LucideAngularModule, Code, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-templates',
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
              <a routerLink="/templates" class="nav-link active">Templates</a>
              <a routerLink="/faq" class="nav-link">FAQ</a>
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
          <a routerLink="/">Home</a> / <span>Templates</span>
        </div>
        <h1 class="page-title">Starter Templates</h1>
        <p class="page-subtitle">Jump-start your project with ready-to-use code templates.</p>

        <div class="templates-grid">
          @for (t of templates; track t.slug) {
            <a [routerLink]="['/templates', t.slug]" class="template-card" [id]="'template-' + t.slug">
              <div class="template-category">{{ t.category }}</div>
              <h3>{{ t.name }}</h3>
              <p>{{ t.description }}</p>
              <span class="template-link">Open Template →</span>
            </a>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './templates.component.css',
})
export class TemplatesComponent implements OnInit {
  private meta = inject(MetaService);
  private templatesService = inject(TemplatesService);
  themeService = inject(ThemeService);
  templates: Template[] = [];
  readonly CodeIcon = Code;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  ngOnInit(): void {
    this.templates = this.templatesService.getAll();
    this.meta.setMeta({
      title: 'Templates — CodeCanvas Starter Code Templates',
      description: 'Browse 10+ starter templates for HTML, CSS, and JavaScript. Includes Todo App, Landing Page, CSS Animations, Form Validation, and more.',
      keywords: 'html templates, css templates, javascript templates, code starter, code playground templates',
      canonicalUrl: 'https://codecanvas.vercel.app/templates',
    });
  }
}
