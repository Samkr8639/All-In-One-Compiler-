import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MetaService } from '../../../core/services/meta.service';
import { TemplatesService } from '../../../core/services/templates.service';
import { StorageService } from '../../../core/services/storage.service';
import { Template } from '../../../shared/models/editor-state.model';

@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page">
      <nav class="page-nav">
        <a routerLink="/" class="back-link"><span>⟨/⟩</span> CodeCanvas</a>
      </nav>
      @if (template) {
        <div class="page-content">
          <div class="breadcrumb">
            <a routerLink="/">Home</a> / <a routerLink="/templates">Templates</a> / <span>{{ template.name }}</span>
          </div>
          <h1 class="page-title">{{ template.name }}</h1>
          <p class="page-subtitle">{{ template.description }}</p>
          <div class="detail-actions">
            <button class="cta-btn" (click)="openInEditor()" id="open-in-editor-btn">Open in Editor</button>
            <span class="template-category">{{ template.category }}</span>
          </div>
          <div class="code-preview">
            <div class="code-section"><h3>HTML</h3><pre><code>{{ template.html }}</code></pre></div>
            <div class="code-section"><h3>CSS</h3><pre><code>{{ template.css }}</code></pre></div>
            <div class="code-section"><h3>JS</h3><pre><code>{{ template.js }}</code></pre></div>
          </div>
        </div>
      } @else {
        <div class="page-content">
          <h1 class="page-title">Template Not Found</h1>
          <a routerLink="/templates" class="cta-btn">Browse Templates</a>
        </div>
      }
    </div>
  `,
  styleUrl: './template-detail.component.css',
})
export class TemplateDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private meta = inject(MetaService);
  private templatesService = inject(TemplatesService);
  private storage = inject(StorageService);
  template: Template | undefined;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    this.template = this.templatesService.getBySlug(slug);
    if (this.template) {
      this.meta.setMeta({
        title: `${this.template.name} — CodeCanvas Template`,
        description: this.template.description,
        canonicalUrl: `https://codecanvas.vercel.app/templates/${slug}`,
      });
    }
  }

  openInEditor(): void {
    if (!this.template) return;
    this.storage.saveEditorState({
      html: this.template.html.replace(/\\n/g, '\n'),
      css: this.template.css.replace(/\\n/g, '\n'),
      js: this.template.js.replace(/\\n/g, '\n'),
    });
    this.router.navigate(['/']);
  }
}
