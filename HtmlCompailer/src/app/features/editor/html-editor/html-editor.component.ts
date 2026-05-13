import {
  Component,
  input,
  output,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  PLATFORM_ID,
  AfterViewInit,
  NgZone,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-html-editor',
  standalone: true,
  template: `<div #editorContainer class="editor-container"></div>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      .editor-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class HtmlEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: true })
  editorContainer!: ElementRef<HTMLDivElement>;

  readonly code = input<string>('');
  readonly codeChange = output<string>();

  private platformId = inject(PLATFORM_ID);
  private themeService = inject(ThemeService);
  private ngZone = inject(NgZone);
  private editor: any;
  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadMonaco();
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
    this.resizeObserver?.disconnect();
  }

  private async loadMonaco(): Promise<void> {
    const monaco = await import('monaco-editor');

    this.ngZone.runOutsideAngular(() => {
      this.editor = monaco.editor.create(
        this.editorContainer.nativeElement,
        {
          value: this.code(),
          language: 'html',
          theme: this.themeService.monacoTheme,
          automaticLayout: false,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          tabSize: 2,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 12 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: true },
        }
      );

      this.editor.onDidChangeModelContent(() => {
        const value = this.editor.getValue();
        this.ngZone.run(() => this.codeChange.emit(value));
      });

      this.resizeObserver = new ResizeObserver(() => {
        this.editor?.layout();
      });
      this.resizeObserver.observe(this.editorContainer.nativeElement);
    });
  }

  private readonly syncCode = effect(() => {
    const code = this.code();
    if (this.editor && this.editor.getValue() !== code) {
      this.editor.setValue(code);
    }
  });

  updateCode(code: string): void {
    if (this.editor && this.editor.getValue() !== code) {
      this.editor.setValue(code);
    }
  }
}
