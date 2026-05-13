import { Component, inject } from '@angular/core';
import { ConsoleService } from '../../../core/services/console.service';
import { LucideAngularModule, Terminal } from 'lucide-angular';

@Component({
  selector: 'app-output-console',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="console-panel">
      <div class="console-header">
        <span class="console-title">
          <lucide-icon [img]="TerminalIcon" [size]="14"></lucide-icon>
          Console
        </span>
        @if (consoleService.errorCount > 0) {
          <span class="error-badge">{{ consoleService.errorCount }}</span>
        }
        <button class="clear-btn" (click)="consoleService.clearMessages()" id="clear-console-btn">
          Clear
        </button>
      </div>
      <div class="console-output" id="console-output">
        @for (msg of consoleService.messages(); track $index) {
          <div class="console-line" [class]="'msg-' + msg.type">
            <span class="msg-type">{{ msg.type.toUpperCase() }}</span>
            <span class="msg-content">{{ msg.args.join(' ') }}</span>
          </div>
        }
        @if (consoleService.messages().length === 0) {
          <div class="console-empty">
            <span>Console output will appear here...</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
      .console-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--surface-0);
      }
      .console-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        background: var(--surface-0);
        border-bottom: 1px solid var(--border-color);
        flex-shrink: 0;
      }
      .console-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-secondary);
        letter-spacing: 0.02em;
      }
      .error-badge {
        background: #ff4757;
        color: #fff;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 1px 7px;
        border-radius: 10px;
      }
      .clear-btn {
        margin-left: auto;
        background: none;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        font-size: 0.75rem;
        padding: 3px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s;
      }
      .clear-btn:hover {
        background: var(--surface-hover);
        color: var(--text-primary);
      }
      .console-output {
        flex: 1;
        overflow-y: auto;
        padding: 8px 0;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.8rem;
      }
      .console-line {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 4px 14px;
        border-bottom: 1px solid var(--border-subtle);
        transition: background 0.1s;
      }
      .console-line:hover {
        background: var(--surface-hover);
      }
      .msg-type {
        font-size: 0.65rem;
        font-weight: 700;
        padding: 1px 5px;
        border-radius: 3px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      .msg-content {
        color: var(--text-primary);
        word-break: break-all;
        white-space: pre-wrap;
      }
      .msg-log .msg-type {
        background: rgba(99, 102, 241, 0.15);
        color: #818cf8;
      }
      .msg-warn .msg-type {
        background: rgba(245, 158, 11, 0.15);
        color: #f59e0b;
      }
      .msg-warn .msg-content {
        color: #f59e0b;
      }
      .msg-error .msg-type {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
      }
      .msg-error .msg-content {
        color: #ef4444;
      }
      .msg-info .msg-type {
        background: rgba(59, 130, 246, 0.15);
        color: #3b82f6;
      }
      .console-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--text-muted);
        font-size: 0.8rem;
      }
    `,
  ],
})
export class OutputConsoleComponent {
  consoleService = inject(ConsoleService);

  // Lucide icon
  readonly TerminalIcon = Terminal;
}
