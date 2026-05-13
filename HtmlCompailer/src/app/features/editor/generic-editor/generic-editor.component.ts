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
  selector: 'app-generic-editor',
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
        background: var(--surface-0);
      }
    `,
  ],
})
export class GenericEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editorContainer', { static: true })
  editorContainer!: ElementRef<HTMLDivElement>;

  readonly code = input<string>('');
  readonly language = input<string>('javascript');
  readonly readOnly = input<boolean>(false);
  readonly codeChange = output<string>();

  private platformId = inject(PLATFORM_ID);
  private themeService = inject(ThemeService);
  private ngZone = inject(NgZone);
  private editor: any;
  private resizeObserver: ResizeObserver | null = null;
  private monacoInstance: any;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadMonaco();
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
    this.resizeObserver?.disconnect();
  }

  private async loadMonaco(): Promise<void> {
    this.monacoInstance = await import('monaco-editor');

    this.ngZone.runOutsideAngular(() => {
      this.editor = this.monacoInstance.editor.create(
        this.editorContainer.nativeElement,
        {
          value: this.code(),
          language: this.language(),
          theme: this.themeService.monacoTheme,
          readOnly: this.readOnly(),
          automaticLayout: false,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          tabSize: 2,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: true },
          lineHeight: 20,
          renderLineHighlight: 'line',
          guides: {
            indentation: true,
            bracketPairs: true,
          },
          overviewRulerBorder: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
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

  private readonly syncLanguage = effect(() => {
    const lang = this.language();
    if (this.editor && this.monacoInstance) {
      this.monacoInstance.editor.setModelLanguage(this.editor.getModel(), lang);
    }
  });

  private readonly syncReadOnly = effect(() => {
    const readOnly = this.readOnly();
    if (this.editor) {
      this.editor.updateOptions({ readOnly });
    }
  });

  private readonly syncTheme = effect(() => {
    const isDark = this.themeService.isDark();
    if (this.editor && this.monacoInstance) {
      this.monacoInstance.editor.setTheme(isDark ? 'vs-dark' : 'vs');
    }
  });

  updateCode(code: string): void {
    if (this.editor && this.editor.getValue() !== code) {
      this.editor.setValue(code);
    }
  }
}
