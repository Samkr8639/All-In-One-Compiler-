import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConsoleMessage } from '../../shared/models/editor-state.model';

@Injectable({ providedIn: 'root' })
export class ConsoleService {
  private platformId = inject(PLATFORM_ID);
  private _messages = signal<ConsoleMessage[]>([]);
  readonly messages = this._messages.asReadonly();

  private boundListener: ((event: MessageEvent) => void) | null = null;

  startListening(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.stopListening();

    this.boundListener = (event: MessageEvent) => {
      if (!event.data || !event.data.type) return;

      const { type, args } = event.data;

      if (type === 'clear') {
        this._messages.set([]);
        return;
      }

      if (['log', 'warn', 'error', 'info'].includes(type)) {
        const message: ConsoleMessage = {
          type,
          args: args || [],
          timestamp: new Date()
        };
        this._messages.update(msgs => [...msgs, message]);
      }
    };

    window.addEventListener('message', this.boundListener);
  }

  stopListening(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.boundListener) {
      window.removeEventListener('message', this.boundListener);
      this.boundListener = null;
    }
  }

  clearMessages(): void {
    this._messages.set([]);
  }

  get messageCount(): number {
    return this._messages().length;
  }

  get errorCount(): number {
    return this._messages().filter(m => m.type === 'error').length;
  }
}
