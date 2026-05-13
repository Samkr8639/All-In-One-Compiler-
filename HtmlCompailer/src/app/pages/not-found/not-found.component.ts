import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MetaService } from '../../core/services/meta.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <div class="content">
        <div class="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <a routerLink="/" class="cta-btn" id="go-home-btn">Go to Editor</a>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .not-found {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      color: var(--text-primary);
      text-align: center;
      padding: 24px;
    }
    .error-code {
      font-size: 8rem;
      font-weight: 900;
      background: linear-gradient(135deg, #6366f1, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 16px;
    }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 12px; }
    p { color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 32px; }
    .cta-btn {
      display: inline-block;
      padding: 14px 40px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99,102,241,0.35);
    }
  `],
})
export class NotFoundComponent implements OnInit {
  private meta = inject(MetaService);

  ngOnInit(): void {
    this.meta.setMeta({
      title: '404 — Page Not Found | CodeCanvas',
      description: 'This page could not be found.',
      robots: 'noindex, follow',
    });
  }
}
