import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EditorState } from '../../shared/models/editor-state.model';

const STORAGE_KEY = 'codecanvas_editor_state';
const THEME_KEY = 'codecanvas_theme';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private platformId = inject(PLATFORM_ID);

  saveEditorState(state: EditorState): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save editor state:', e);
    }
  }

  loadEditorState(): EditorState | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to load editor state:', e);
      return null;
    }
  }

  saveTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
  }

  loadTheme(): boolean | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const data = localStorage.getItem(THEME_KEY);
      return data !== null ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  clearAll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
  }
}
