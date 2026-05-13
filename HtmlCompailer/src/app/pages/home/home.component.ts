import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { EditorPanelComponent } from '../../features/editor/editor-panel/editor-panel.component';
import { PreviewFrameComponent } from '../../features/preview/preview-frame/preview-frame.component';
import { OutputConsoleComponent } from '../../features/console/output-console/output-console.component';
import { CompilerService } from '../../core/services/compiler.service';
import { ConsoleService } from '../../core/services/console.service';
import { StorageService } from '../../core/services/storage.service';
import { ThemeService } from '../../core/services/theme.service';
import { MetaService } from '../../core/services/meta.service';
import { SchemaService } from '../../core/services/schema.service';
import { TemplatesService } from '../../core/services/templates.service';
import { Template } from '../../shared/models/editor-state.model';
// Lucide icons
import {
  LucideAngularModule,
  Play,
  Trash2,
  Grid3X3,
  ChevronRight,
  Download,
  Sun,
  Moon,
  Code
} from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    EditorPanelComponent,
    PreviewFrameComponent,
    OutputConsoleComponent,
    LucideAngularModule,
    AngularSplitModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  private compiler = inject(CompilerService);
  private consoleService = inject(ConsoleService);
  private storage = inject(StorageService);
  private themeService = inject(ThemeService);
  private meta = inject(MetaService);
  private schema = inject(SchemaService);
  private templatesService = inject(TemplatesService);
  private platformId = inject(PLATFORM_ID);

  htmlCode = signal('<h1>Hello, World! 🌍</h1>\n<p>Start coding in CodeCanvas</p>\n<button id="btn">Click me</button>\n<p id="output"></p>');
  cssCode = signal('* { margin: 0; padding: 0; box-sizing: border-box; }\nbody {\n  font-family: "Inter", sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: #fff;\n  text-align: center;\n}\nh1 { font-size: 3rem; margin-bottom: 1rem; }\np { font-size: 1.2rem; margin-bottom: 1rem; }\nbutton {\n  padding: 12px 32px;\n  font-size: 1rem;\n  border: none;\n  border-radius: 8px;\n  background: #fff;\n  color: #764ba2;\n  cursor: pointer;\n  font-weight: 600;\n  transition: transform 0.2s;\n}\nbutton:hover { transform: scale(1.05); }');
  jsCode = signal('document.getElementById("btn").addEventListener("click", function() {\n  document.getElementById("output").textContent = "You clicked the button! 🎉";\n  console.log("Button clicked!");\n});');

  compiledOutput = signal('');
  autoRun = signal(true);
  showConsole = signal(true);
  templates: Template[] = [];

  // Lucide icons
  readonly PlayIcon = Play;
  readonly Trash2Icon = Trash2;
  readonly Grid3X3Icon = Grid3X3;
  readonly ChevronRightIcon = ChevronRight;
  readonly DownloadIcon = Download;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly CodeIcon = Code;

  private debounceTimer: any;

  constructor() {
    // Auto-compile when code changes (debounced)
    effect(() => {
      const html = this.htmlCode();
      const css = this.cssCode();
      const js = this.jsCode();

      if (this.autoRun()) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.compile();
          this.saveState();
        }, 600);
      }
    });
  }

  ngOnInit(): void {
    // SEO
    this.meta.setMeta({
      title: 'CodeCanvas — Free Online HTML CSS JS Compiler & Editor',
      description:
        'Write, compile, and test HTML, CSS, and JavaScript code instantly in your browser. Free online code editor with live preview, console output, and starter templates.',
      keywords:
        'html compiler, css compiler, javascript compiler, online code editor, live preview, html editor online, code playground',
      canonicalUrl: 'https://codecanvas.vercel.app/',
    });
    this.schema.injectWebApplicationSchema();
    this.themeService.initialize();

    // Load saved state
    if (isPlatformBrowser(this.platformId)) {
      const saved = this.storage.loadEditorState();
      if (saved) {
        this.htmlCode.set(saved.html);
        this.cssCode.set(saved.css);
        this.jsCode.set(saved.js);
      }
      this.consoleService.startListening();
      this.compile();
    }

    this.templates = this.templatesService.getAll();
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    this.consoleService.stopListening();
    this.schema.removeAllSchemas();
  }

  compile(): void {
    const output = this.compiler.compileCode(
      this.htmlCode(),
      this.cssCode(),
      this.jsCode()
    );
    this.compiledOutput.set(output);
  }

  onHtmlChange(code: string): void {
    this.htmlCode.set(code);
  }

  onCssChange(code: string): void {
    this.cssCode.set(code);
  }

  onJsChange(code: string): void {
    this.jsCode.set(code);
  }

  runCode(): void {
    this.consoleService.clearMessages();
    this.compile();
    this.saveState();
  }

  clearCode(): void {
    this.htmlCode.set('');
    this.cssCode.set('');
    this.jsCode.set('');
    this.compiledOutput.set('');
    this.consoleService.clearMessages();
    this.storage.clearAll();
  }

  loadTemplate(template: Template): void {
    this.htmlCode.set(template.html.replace(/\\n/g, '\n'));
    this.cssCode.set(template.css.replace(/\\n/g, '\n'));
    this.jsCode.set(template.js.replace(/\\n/g, '\n'));
    this.compile();
    this.saveState();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  get isDark(): boolean {
    return this.themeService.isDark();
  }

  toggleConsole(): void {
    this.showConsole.update(v => !v);
  }

  downloadCode(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const content = this.compiler.compileCode(
      this.htmlCode(),
      this.cssCode(),
      this.jsCode()
    );
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codecanvas-project.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  private saveState(): void {
    this.storage.saveEditorState({
      html: this.htmlCode(),
      css: this.cssCode(),
      js: this.jsCode(),
    });
  }

  onDragEnd() {
    // This can be used to trigger window resize event or any other logic
    // to ensure Monaco editor adjusts correctly.
    if (isPlatformBrowser(this.platformId)) {
      window.dispatchEvent(new Event('resize'));
    }
  }
}
