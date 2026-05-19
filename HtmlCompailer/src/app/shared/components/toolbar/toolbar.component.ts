import { Component, output, input, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageDef } from '../../../core/models/compiler.models';
import { Template } from '../../models/editor-state.model';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Play,
  Trash2,
  Code,
  Download,
  Share2,
  Sun,
  Moon,
  ChevronDown,
  FileCode,
  Layers
} from 'lucide-angular';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  template: `
    <header class="toolbar">
      <!-- Left: Logo -->
      <div class="toolbar-left">
        <a routerLink="/" class="logo" id="brand-logo">
          <div class="logo-mark">
            <lucide-icon [img]="CodeIcon" [size]="18"></lucide-icon>
          </div>
          <span class="logo-text">CodeCanvas</span>
        </a>
      </div>

      <!-- Center: Actions -->
      <div class="toolbar-center">
        <!-- Run -->
        <button class="action-btn run-btn" (click)="run.emit()" [disabled]="isRunning()" id="run-btn">
          <lucide-icon [img]="PlayIcon" [size]="14"></lucide-icon>
          {{ isRunning() ? 'Running...' : 'Run' }}
        </button>

        <!-- Auto toggle (web only) -->
        @if (selectedLanguage()?.id === 'web') {
          <label class="auto-toggle" id="auto-run-toggle">
            <input type="checkbox" [checked]="autoRun()" (change)="autoRunChange.emit(!autoRun())">
            <span class="toggle-track"></span>
            <span class="toggle-text">Auto</span>
          </label>
        }

        <!-- Separator -->
        <div class="separator"></div>

        <!-- Language Dropdown -->
        <div class="dropdown-wrap" id="language-dropdown">
          <button class="action-btn" (click)="dropdownOpen = !dropdownOpen; templateDropdownOpen = false">
            <lucide-icon [img]="LayersIcon" [size]="14"></lucide-icon>
            {{ selectedLanguage()?.name || 'Language' }}
            <lucide-icon [img]="ChevronDownIcon" [size]="12" class="chevron" [class.open]="dropdownOpen"></lucide-icon>
          </button>
          @if (dropdownOpen) {
            <div class="dropdown-panel">
              @for (lang of languages(); track lang.id) {
                <button class="dropdown-option" [class.active]="selectedLanguage()?.id === lang.id" (click)="selectLanguage(lang)">
                  <span class="option-name">{{ lang.name }}</span>
                  <span class="option-badge">{{ lang.version }}</span>
                </button>
              }
            </div>
          }
        </div>

        <!-- Templates (web only) -->
        @if (selectedLanguage()?.id === 'web') {
          <div class="dropdown-wrap" id="template-dropdown">
            <button class="action-btn" (click)="templateDropdownOpen = !templateDropdownOpen; dropdownOpen = false">
              <lucide-icon [img]="FileCodeIcon" [size]="14"></lucide-icon>
              Templates
              <lucide-icon [img]="ChevronDownIcon" [size]="12" class="chevron" [class.open]="templateDropdownOpen"></lucide-icon>
            </button>
            @if (templateDropdownOpen) {
              <div class="dropdown-panel">
                @for (t of templates(); track t.slug) {
                  <button class="dropdown-option" (click)="selectTemplate(t)">
                    <span class="option-name">{{ t.name }}</span>
                    <span class="option-badge">{{ t.category }}</span>
                  </button>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Right: Utils -->
      <div class="toolbar-right">
        <button class="icon-btn" (click)="clear.emit()" title="Clear Output" id="clear-btn">
          <lucide-icon [img]="Trash2Icon" [size]="15"></lucide-icon>
        </button>
        <button class="icon-btn" (click)="download.emit()" title="Download" id="download-btn">
          <lucide-icon [img]="DownloadIcon" [size]="15"></lucide-icon>
        </button>
        <button class="icon-btn" (click)="share.emit()" title="Share" id="share-btn">
          <lucide-icon [img]="ShareIcon" [size]="15"></lucide-icon>
        </button>

        <div class="separator"></div>

        <button class="icon-btn theme-toggle" (click)="themeService.toggle()" title="Toggle Theme" id="theme-btn">
          <lucide-icon [img]="themeService.isDark() ? SunIcon : MoonIcon" [size]="15"></lucide-icon>
        </button>

        <nav class="nav-links">
          <a routerLink="/features">Features</a>
          <a routerLink="/templates">Templates</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      height: 48px;
      background: var(--toolbar-bg);
      border-bottom: 1px solid var(--border-color);
      z-index: 100;
      gap: 12px;
      flex-shrink: 0;
    }

    .toolbar-left,
    .toolbar-center,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toolbar-center {
      flex: 1;
      justify-content: center;
      gap: 4px;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      transition: opacity var(--transition-fast);
    }
    .logo:hover { opacity: 0.8; }

    .logo-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: var(--accent);
      color: #fff;
    }

    .logo-text {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    /* Action Buttons */
    .action-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 14px;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--text-primary);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;
      height: 32px;
    }
    .action-btn:hover:not(:disabled) {
      background: var(--surface-hover);
      border-color: var(--border-hover);
    }
    .action-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .action-btn:active:not(:disabled) {
      transform: scale(0.97);
    }
    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .run-btn {
      background: var(--accent);
      color: #fff;
      border: none;
      font-weight: 500;
      padding: 8px 16px;
      height: auto;
    }
    .run-btn:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: scale(1.02);
      box-shadow: var(--active-glow);
    }
    .run-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .run-btn:active:not(:disabled) {
      transform: scale(0.98);
    }

    .chevron {
      transition: transform var(--transition-fast);
      opacity: 0.5;
    }
    .chevron.open {
      transform: rotate(180deg);
    }

    /* Icon Buttons */
    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .icon-btn:hover {
      background: var(--btn-hover);
      color: var(--text-primary);
    }
    .icon-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .icon-btn:active {
      transform: scale(0.95);
    }

    /* Toggle */
    .auto-toggle {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      user-select: none;
    }
    .auto-toggle input { display: none; }
    .toggle-track {
      width: 28px;
      height: 16px;
      background: var(--btn-bg);
      border-radius: var(--radius-full);
      position: relative;
      transition: background var(--transition-normal);
      border: 1px solid var(--border-color);
    }
    .toggle-track::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 10px;
      height: 10px;
      background: var(--text-secondary);
      border-radius: 50%;
      transition: all var(--transition-normal);
    }
    .auto-toggle input:checked + .toggle-track {
      background: var(--accent-muted);
      border-color: var(--accent);
    }
    .auto-toggle input:checked + .toggle-track::after {
      transform: translateX(12px);
      background: var(--accent);
    }
    .toggle-text {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* Separator */
    .separator {
      width: 1px;
      height: 20px;
      background: var(--border-color);
      margin: 0 4px;
    }

    /* Dropdown */
    .dropdown-wrap { position: relative; }

    .dropdown-panel {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      min-width: 220px;
      max-height: 320px;
      overflow-y: auto;
      background: var(--dropdown-bg);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      z-index: 300;
      padding: 4px;
      animation: slideDown 0.15s ease-out;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .dropdown-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: none;
      color: var(--text-primary);
      font-size: 0.8rem;
      cursor: pointer;
      text-align: left;
      border-radius: var(--radius-md);
      transition: background var(--transition-fast);
      gap: 12px;
    }
    .dropdown-option:hover {
      background: var(--bg-hover);
    }
    .dropdown-option.active {
      background: var(--accent-muted);
      color: var(--accent);
    }
    .option-name { font-weight: 500; }
    .option-badge {
      font-size: 0.65rem;
      color: white;
      background: var(--badge-bg);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      font-weight: 500;
    }

    /* Nav */
    .nav-links {
      display: flex;
      gap: 4px;
      margin-left: 4px;
    }
    .nav-links a {
      padding: 4px 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 500;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }
    .nav-links a:hover {
      color: var(--text-primary);
      background: var(--bg-hover);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-links, .toggle-text, .auto-toggle, .separator { display: none; }
      .toolbar { padding: 0 10px; gap: 4px; }
      .action-btn { padding: 5px 8px; font-size: 0.78rem; }
      .logo-text { display: none; }
    }
  `]
})
export class ToolbarComponent {
  themeService = inject(ThemeService);

  languages = input<LanguageDef[]>([]);
  selectedLanguage = input<LanguageDef | undefined>(undefined);
  isRunning = input<boolean>(false);
  templates = input<Template[]>([]);
  autoRun = input<boolean>(true);

  run = output<void>();
  clear = output<void>();
  download = output<void>();
  share = output<void>();
  languageSelect = output<LanguageDef>();
  templateSelect = output<Template>();
  autoRunChange = output<boolean>();

  dropdownOpen = false;
  templateDropdownOpen = false;

  readonly PlayIcon = Play;
  readonly Trash2Icon = Trash2;
  readonly DownloadIcon = Download;
  readonly ShareIcon = Share2;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly CodeIcon = Code;
  readonly ChevronDownIcon = ChevronDown;
  readonly FileCodeIcon = FileCode;
  readonly LayersIcon = Layers;

  selectLanguage(lang: LanguageDef) {
    this.languageSelect.emit(lang);
    this.dropdownOpen = false;
  }

  selectTemplate(t: Template) {
    this.templateSelect.emit(t);
    this.templateDropdownOpen = false;
  }
}
