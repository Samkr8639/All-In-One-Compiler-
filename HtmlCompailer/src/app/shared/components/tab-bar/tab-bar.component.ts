import { Component, input, output } from '@angular/core';
import { EditorTab } from '../../models/editor-state.model';

@Component({
  selector: 'app-tab-bar',
  standalone: true,
  template: `
    <div class="tab-bar">
      @for (tab of tabs; track tab.id) {
        <button
          class="tab"
          [class.active]="activeTab() === tab.id"
          (click)="tabChange.emit(tab.id)"
          [id]="'tab-' + tab.id"
        >
          <span class="tab-dot" [style.background]="tab.color"></span>
          {{ tab.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .tab-bar {
      display: flex; background: var(--editor-header-bg);
      border-bottom: 1px solid var(--border-color); flex-shrink: 0;
    }
    .tab {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 20px; border: none; background: none;
      color: var(--text-secondary); font-size: 0.85rem; font-weight: 500;
      cursor: pointer; border-bottom: 2px solid transparent;
      transition: all var(--transition-fast); position: relative;
    }
    .tab:hover { color: var(--text-primary); background: var(--surface-hover); }
    .tab.active {
      color: var(--text-primary); border-bottom-color: var(--accent);
      background: var(--editor-bg);
    }
    .tab-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  `]
})
export class TabBarComponent {
  activeTab = input<EditorTab>('html');
  tabChange = output<EditorTab>();

  tabs: { id: EditorTab; label: string; color: string }[] = [
    { id: 'html',       label: 'HTML',       color: '#e34c26' },
    { id: 'css',        label: 'CSS',        color: '#264de4' },
    { id: 'javascript', label: 'JavaScript', color: '#f7df1e' }
  ];
}
