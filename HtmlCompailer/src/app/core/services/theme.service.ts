import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT);
  private storage = inject(StorageService);

  private _isDark = signal(true);
  readonly isDark = this._isDark.asReadonly();

  get monacoTheme(): string {
    return this._isDark() ? 'vs-dark' : 'vs';
  }

  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = this.storage.loadTheme();
    if (saved !== null) {
      this._isDark.set(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._isDark.set(prefersDark);
    }
    this.applyTheme();
  }

  toggle(): void {
    this._isDark.update(v => !v);
    this.storage.saveTheme(this._isDark());
    this.applyTheme();
  }

  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const body = this.doc.body;
    if (this._isDark()) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}
