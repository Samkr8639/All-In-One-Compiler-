import { Component, inject, input, output } from '@angular/core';
import { ConsoleService } from '../../../core/services/console.service';
import { InternalExecutionResult } from '../../../core/models/compiler.models';
import { LucideAngularModule, Terminal, X } from 'lucide-angular';

@Component({
  selector: 'app-output-console',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="console-panel">
      <div class="console-header">
        <span class="console-title">
          <lucide-icon [img]="TerminalIcon" [size]="13"></lucide-icon>
          CONSOLE
        </span>
        @if (consoleService.errorCount > 0) {
          <span class="error-badge">{{ consoleService.errorCount }}</span>
        }
        <button class="clear-btn" (click)="onClearConsole()" id="clear-console-btn">
          <lucide-icon [img]="XIcon" [size]="12"></lucide-icon>
          Clear
        </button>
      </div>
      <div class="console-output" id="console-output">
        <!-- Backend API Result -->
        @if (result()) {
          @if (result()!.compileOutput) {
            <div class="console-line msg-compile">
              <span class="msg-label">COMPILE</span>
              <span class="msg-text">{{ result()!.compileOutput }}</span>
            </div>
          }
          @if (result()!.stdout) {
            <div class="console-line msg-stdout">
              <span class="msg-label">OUTPUT</span>
              <span class="msg-text">{{ result()!.stdout }}</span>
            </div>
          }
          @if (result()!.stderr) {
            <div class="console-line msg-stderr">
              <span class="msg-label">ERROR</span>
              <span class="msg-text">{{ result()!.stderr }}</span>
            </div>
          }
          <div class="console-line" [class]="result()!.success ? 'msg-success' : 'msg-stderr'">
            <span class="msg-label">EXIT</span>
            <span class="msg-text">Process exited with code {{ result()!.exitCode }}</span>
          </div>
        }

        <!-- Iframe Web Console -->
        @for (msg of consoleService.messages(); track $index) {
          <div class="console-line" [class]="'msg-' + msg.type">
            <span class="msg-label">{{ msg.type.toUpperCase() }}</span>
            <span class="msg-text">{{ msg.args.join(' ') }}</span>
          </div>
        }

        <!-- Empty State -->
        @if (consoleService.messages().length === 0 && !result()) {
          <div class="console-empty">
            <lucide-icon [img]="TerminalIcon" [size]="20" style="opacity: 0.3"></lucide-icon>
            <span>Console output will appear here</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; height: 100%; }

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
        padding: 0 14px;
        background: var(--surface-0);
        border-bottom: 1px solid var(--border-color);
        flex-shrink: 0;
        height: 36px;
      }

      .console-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--text-muted);
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .error-badge {
        background: var(--error);
        color: #fff;
        font-size: 0.6rem;
        font-weight: 700;
        padding: 1px 6px;
        border-radius: var(--radius-full);
        line-height: 1.4;
      }

      .clear-btn {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 4px;
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 0.7rem;
        font-weight: 500;
        padding: 3px 8px;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
      }
      .clear-btn:hover {
        background: var(--bg-hover);
        color: var(--text-secondary);
      }

      .console-output {
        flex: 1;
        overflow-y: auto;
        padding: 4px 0;
        font-family: var(--font-mono, 'JetBrains Mono', monospace);
        font-size: 0.78rem;
        line-height: 1.5;
      }

      .console-line {
        display: flex;
        align-items: baseline;
        gap: 10px;
        padding: 4px 14px;
        transition: background var(--transition-fast);
      }
      .console-line:hover {
        background: var(--surface-hover);
      }

      .msg-label {
        font-size: 0.6rem;
        font-weight: 600;
        padding: 1px 5px;
        border-radius: 3px;
        flex-shrink: 0;
        letter-spacing: 0.04em;
      }

      .msg-text {
        color: var(--text-primary);
        word-break: break-all;
        white-space: pre-wrap;
      }

      /* Log types */
      .msg-log .msg-label,
      .msg-stdout .msg-label {
        background: rgba(99, 102, 241, 0.1);
        color: #818cf8;
      }
      .msg-warn .msg-label {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }
      .msg-warn .msg-text { color: #d97706; }

      .msg-error .msg-label,
      .msg-stderr .msg-label {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
      .msg-error .msg-text,
      .msg-stderr .msg-text { color: #ef4444; }

      .msg-info .msg-label,
      .msg-compile .msg-label {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
      }

      .msg-success .msg-label {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
      }

      .console-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 100%;
        color: var(--text-muted);
        font-size: 0.78rem;
      }
    `,
  ],
})
export class OutputConsoleComponent {
  consoleService = inject(ConsoleService);

  result = input<InternalExecutionResult | null>(null);
  clearConsole = output<void>();

  readonly TerminalIcon = Terminal;
  readonly XIcon = X;

  onClearConsole(): void {
    this.clearConsole.emit();
  }
}
