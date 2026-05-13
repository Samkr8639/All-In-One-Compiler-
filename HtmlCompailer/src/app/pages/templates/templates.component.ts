import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../core/services/meta.service';
import { TemplatesService } from '../../core/services/templates.service';
import { Template } from '../../shared/models/editor-state.model';

@Component({
  selector: 'app-templates',
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
  templates: Template[] = [];

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
