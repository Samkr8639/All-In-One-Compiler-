import { Component, output, input, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { Template } from '../../models/editor-state.model';
import { RouterLink } from '@angular/router';
// Lucide icons
import {
  LucideAngularModule,
  Play,
  Trash2,
  FileText,
  Download,
  Share,
  Sun,
  Moon,
  Code
} from 'lucide-angular';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule,
  ],
  template: `
    <header class="toolbar">
      <div class="toolbar-left">
        <a routerLink="/" class="logo">
          <lucide-icon [img]="CodeIcon" class="logo-icon"></lucide-icon>
          <span class="logo-text">Code<span class="logo-accent">Canvas</span></span>
        </a>
      </div>
      <div class="toolbar-center">
        <button class="btn btn-run" (click)="run.emit()" title="Run Code (Ctrl+S)" id="run-btn">
          <lucide-icon [img]="PlayIcon" [size]="14"></lucide-icon>
          Run
        </button>
        <label class="auto-run-toggle" id="auto-run-toggle">
          <input type="checkbox" [checked]="autoRun()" (change)="autoRunChange.emit(!autoRun())">
          <span class="toggle-slider"></span>
          <span class="toggle-label">Auto</span>
        </label>
        <button class="btn btn-secondary" (click)="clear.emit()" title="Clear Code" id="clear-btn">
          <lucide-icon [img]="Trash2Icon" [size]="14"></lucide-icon>
          Clear
        </button>
        <div class="template-dropdown" id="template-dropdown">
          <button class="btn btn-secondary" (click)="dropdownOpen = !dropdownOpen">
            <lucide-icon [img]="FileTextIcon" [size]="14"></lucide-icon>
            Templates <span class="caret">▾</span>
          </button>
          @if (dropdownOpen) {
            <div class="dropdown-menu">
              @for (t of templates(); track t.slug) {
                <button class="dropdown-item" (click)="selectTemplate(t)">
                  {{ t.name }}
                  <span class="dropdown-cat">{{ t.category }}</span>
                </button>
              }
            </div>
          }
        </div>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-icon-only" (click)="download.emit()" title="Download HTML" id="download-btn">
          <lucide-icon [img]="DownloadIcon" [size]="16"></lucide-icon>
        </button>
        <button class="btn btn-icon-only" (click)="share.emit()" title="Share" id="share-btn">
          <lucide-icon [img]="ShareIcon" [size]="16"></lucide-icon>
        </button>
        <button class="btn btn-icon-only" (click)="themeService.toggle()" title="Toggle Theme" id="theme-btn">
          <lucide-icon [img]="themeService.isDark() ? SunIcon : MoonIcon" [size]="16"></lucide-icon>
        </button>
        <nav class="nav-links">
          <a routerLink="/features">Features</a>
          <a routerLink="/faq">FAQ</a>
          <a routerLink="/templates">Templates</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .toolbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 16px; height: 52px;
      background: var(--toolbar-bg); border-bottom: 1px solid var(--border);
      z-index: 100; gap: 12px; flex-shrink: 0;
    }
    .toolbar-left, .toolbar-center, .toolbar-right { display: flex; align-items: center; gap: 8px; }
    .toolbar-center { flex: 1; justify-content: center; }
    .logo { display: flex; align-items: center; gap: 6px; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
    .logo-icon { color: var(--accent); font-family: monospace; font-size: 1.3rem; }
    .logo-text { color: var(--text-primary); }
    .logo-accent { color: var(--accent); }
    .btn {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 14px; border: 1px solid var(--border); border-radius: 6px;
      background: var(--btn-bg); color: var(--text-primary);
      font-size: 0.85rem; font-weight: 500; cursor: pointer;
      transition: all 0.15s ease; white-space: nowrap;
    }
    .btn:hover { background: var(--btn-hover); }
    .btn-run { background: var(--accent); color: #fff; border-color: var(--accent); }
    .btn-run:hover { background: var(--accent-hover); }
    .btn-icon { font-size: 0.8rem; }
    .btn-icon-only {
      padding: 6px 8px; border: 1px solid var(--border); border-radius: 6px;
      background: var(--btn-bg); color: var(--text-primary); cursor: pointer;
      font-size: 1rem; transition: all 0.15s ease; line-height: 1;
    }
    .btn-icon-only:hover { background: var(--btn-hover); }
    .auto-run-toggle {
      display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none;
    }
    .auto-run-toggle input { display: none; }
    .toggle-slider {
      width: 32px; height: 18px; background: var(--border); border-radius: 9px;
      position: relative; transition: background 0.2s;
    }
    .toggle-slider::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 14px; height: 14px; background: #fff; border-radius: 50%;
      transition: transform 0.2s;
    }
    .auto-run-toggle input:checked + .toggle-slider { background: var(--accent); }
    .auto-run-toggle input:checked + .toggle-slider::after { transform: translateX(14px); }
    .toggle-label { font-size: 0.8rem; color: var(--text-secondary); }
    .template-dropdown { position: relative; }
    .dropdown-menu {
      position: absolute; top: 100%; left: 0; margin-top: 4px;
      background: var(--dropdown-bg); border: 1px solid var(--border);
      border-radius: 8px; min-width: 220px; z-index: 200;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3); overflow: hidden;
    }
    .dropdown-item {
      display: flex; justify-content: space-between; align-items: center;
      width: 100%; padding: 10px 14px; border: none; background: none;
      color: var(--text-primary); font-size: 0.85rem; cursor: pointer; text-align: left;
      transition: background 0.15s;
    }
    .dropdown-item:hover { background: var(--btn-hover); }
    .dropdown-cat { font-size: 0.7rem; color: var(--text-muted); background: var(--badge-bg); padding: 2px 6px; border-radius: 4px; }
    .caret { font-size: 0.7rem; }
    .nav-links { display: flex; gap: 12px; margin-left: 8px; }
    .nav-links a { color: var(--text-secondary); text-decoration: none; font-size: 0.8rem; transition: color 0.15s; }
    .nav-links a:hover { color: var(--text-primary); }
    @media (max-width: 768px) {
      .nav-links, .toggle-label { display: none; }
      .toolbar { padding: 0 8px; gap: 4px; }
      .btn { padding: 6px 8px; font-size: 0.8rem; }
    }
  `]
})
export class ToolbarComponent {
  themeService = inject(ThemeService);

  templates = input<Template[]>([]);
  autoRun = input(true);

  run = output<void>();
  clear = output<void>();
  download = output<void>();
  share = output<void>();
  autoRunChange = output<boolean>();
  templateSelect = output<Template>();

  dropdownOpen = false;

  // Lucide icons
  readonly PlayIcon = Play;
  readonly Trash2Icon = Trash2;
  readonly FileTextIcon = FileText;
  readonly DownloadIcon = Download;
  readonly ShareIcon = Share;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly CodeIcon = Code;

  selectTemplate(t: Template) {
    this.templateSelect.emit(t);
    this.dropdownOpen = false;
  }
}
