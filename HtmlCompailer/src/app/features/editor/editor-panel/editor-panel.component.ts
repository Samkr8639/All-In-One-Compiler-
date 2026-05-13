import {
  Component,
  signal,
  input,
  output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { HtmlEditorComponent } from '../html-editor/html-editor.component';
import { CssEditorComponent } from '../css-editor/css-editor.component';
import { JsEditorComponent } from '../js-editor/js-editor.component';
import { EditorTab } from '../../../shared/models/editor-state.model';

@Component({
  selector: 'app-editor-panel',
  standalone: true,
  imports: [NgIf, HtmlEditorComponent, CssEditorComponent, JsEditorComponent],
  template: `
    <div class="editor-panel">
      <div class="tab-bar">
        <button
          class="tab"
          [class.active]="activeTab() === 'html'"
          (click)="activeTab.set('html')"
          id="tab-html"
        >
          <span class="tab-dot html-dot"></span>
          HTML
        </button>
        <button
          class="tab"
          [class.active]="activeTab() === 'css'"
          (click)="activeTab.set('css')"
          id="tab-css"
        >
          <span class="tab-dot css-dot"></span>
          CSS
        </button>
        <button
          class="tab"
          [class.active]="activeTab() === 'javascript'"
          (click)="activeTab.set('javascript')"
          id="tab-js"
        >
          <span class="tab-dot js-dot"></span>
          JS
        </button>
      </div>
      <div class="editor-content">
        <ng-container *ngIf="activeTab() === 'html'">
          <app-html-editor [code]="htmlCode()" (codeChange)="onHtmlChange($event)" />
        </ng-container>
        <ng-container *ngIf="activeTab() === 'css'">
          <app-css-editor [code]="cssCode()" (codeChange)="onCssChange($event)" />
        </ng-container>
        <ng-container *ngIf="activeTab() === 'javascript'">
          <app-js-editor [code]="jsCode()" (codeChange)="onJsChange($event)" />
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; height: 100%; }

      .editor-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--surface-0);
      }

      .tab-bar {
        display: flex;
        gap: 0;
        background: var(--surface-0);
        border-bottom: 1px solid var(--border-color);
        padding: 0 8px;
        flex-shrink: 0;
        height: 36px;
      }

      .tab {
        padding: 0 14px;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        border-bottom: 2px solid transparent;
        font-family: inherit;
        display: flex;
        align-items: center;
        gap: 6px;
        letter-spacing: 0.01em;
      }

      .tab:hover {
        color: var(--text-primary);
      }

      .tab.active {
        color: var(--text-primary);
        border-bottom-color: var(--accent);
      }

      .tab-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        opacity: 0.7;
      }

      .html-dot { background: #f97316; }
      .css-dot { background: #3b82f6; }
      .js-dot { background: #eab308; }

      .tab.active .tab-dot { opacity: 1; }

      .editor-content {
        flex: 1;
        overflow: hidden;
      }
    `,
  ],
})
export class EditorPanelComponent {
  readonly htmlCode = input<string>('');
  readonly cssCode = input<string>('');
  readonly jsCode = input<string>('');

  readonly htmlChange = output<string>();
  readonly cssChange = output<string>();
  readonly jsChange = output<string>();

  activeTab = signal<EditorTab>('html');

  onHtmlChange(code: string): void { this.htmlChange.emit(code); }
  onCssChange(code: string): void { this.cssChange.emit(code); }
  onJsChange(code: string): void { this.jsChange.emit(code); }
}
