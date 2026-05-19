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
      color: var(--accent);
      line-height: 1;
      margin-bottom: 16px;
    }
    h1 { font-size: var(--font-size-xxl); font-weight: 700; margin-bottom: 12px; letter-spacing: -0.025em; }
    p { color: var(--text-secondary); font-size: var(--font-size-lg); margin-bottom: 32px; }
    .cta-btn {
      display: inline-block;
      padding: 12px 32px;
      background: var(--accent);
      color: #fff;
      text-decoration: none;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: var(--font-size-base);
      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color var(--transition-fast);
    }
    .cta-btn:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: var(--active-glow);
    }
    .cta-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .cta-btn:active {
      transform: translateY(0) scale(0.98);
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
