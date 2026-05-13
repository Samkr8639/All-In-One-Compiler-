import { Component, input, effect, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-preview-frame',
  standalone: true,
  template: `
    <div class="preview-wrapper">
      <div class="preview-header">
        <div class="window-dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="preview-label">Preview</span>
      </div>
      <iframe
        #previewIframe
        class="preview-iframe"
        sandbox="allow-scripts allow-modals"
        title="Preview"
        id="preview-frame"
      ></iframe>
    </div>
  `,
  styles: [
    `
      :host { display: block; height: 100%; }

      .preview-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--surface-0);
      }

      .preview-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 14px;
        background: var(--surface-0);
        border-bottom: 1px solid var(--border-color);
        flex-shrink: 0;
        height: 36px;
      }

      .window-dots {
        display: flex;
        gap: 5px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        opacity: 0.8;
      }
      .dot.red { background: #ff5f57; }
      .dot.yellow { background: #febc2e; }
      .dot.green { background: #28c840; }

      .preview-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-muted);
        letter-spacing: 0.02em;
        text-transform: uppercase;
      }

      .preview-iframe {
        flex: 1;
        width: 100%;
        border: none;
        background: #fff;
      }
    `,
  ],
})
export class PreviewFrameComponent {
  @ViewChild('previewIframe', { static: true })
  iframeRef!: ElementRef<HTMLIFrameElement>;

  readonly srcdoc = input<string>('');

  private readonly updatePreview = effect(() => {
    const srcdoc = this.srcdoc();
    if (this.iframeRef) {
      this.iframeRef.nativeElement.srcdoc = srcdoc;
    }
  });
}
