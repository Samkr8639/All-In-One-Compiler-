import { Component, input, effect, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-preview-frame',
  standalone: true,
  template: `
    <div class="preview-wrapper">
      <div class="preview-header">
        <span class="preview-dot red"></span>
        <span class="preview-dot yellow"></span>
        <span class="preview-dot green"></span>
        <span class="preview-title">Preview</span>
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
      :host {
        display: block;
        height: 100%;
      }
      .preview-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--surface-1);
      }
      .preview-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: var(--surface-0);
        border-bottom: 1px solid var(--border-color);
        flex-shrink: 0;
      }
      .preview-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .preview-dot.red { background: #ff5f57; }
      .preview-dot.yellow { background: #ffbd2e; }
      .preview-dot.green { background: #28c840; }
      .preview-title {
        margin-left: 8px;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--text-secondary);
        letter-spacing: 0.02em;
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
