import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularSplitModule } from 'angular-split';
import { GenericEditorComponent } from '../../features/editor/generic-editor/generic-editor.component';
import { EditorPanelComponent } from '../../features/editor/editor-panel/editor-panel.component';
import { PreviewFrameComponent } from '../../features/preview/preview-frame/preview-frame.component';
import { OutputConsoleComponent } from '../../features/console/output-console/output-console.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { CompilerService } from '../../core/services/compiler.service';
import { ConsoleService } from '../../core/services/console.service';
import { StorageService } from '../../core/services/storage.service';
import { ThemeService } from '../../core/services/theme.service';
import { MetaService } from '../../core/services/meta.service';
import { SchemaService } from '../../core/services/schema.service';
import { TemplatesService } from '../../core/services/templates.service';
import { LanguageDef, InternalExecutionResult } from '../../core/models/compiler.models';
import { Template } from '../../shared/models/editor-state.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    GenericEditorComponent,
    EditorPanelComponent,
    PreviewFrameComponent,
    OutputConsoleComponent,
    ToolbarComponent,
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

  // --- Backend Mode State ---
  languages = signal<LanguageDef[]>([]);
  selectedLanguage = signal<LanguageDef | undefined>(undefined);
  codeByLanguage = signal<Record<string, string>>({});
  executionResult = signal<InternalExecutionResult | null>(null);
  isRunning = signal<boolean>(false);

  // --- Web Mode State ---
  htmlCode = signal('<h1>Hello, World! 🌍</h1>\n<p>Start coding in CodeCanvas</p>\n<button id="btn">Click me</button>\n<p id="output"></p>');
  cssCode = signal('* { margin: 0; padding: 0; box-sizing: border-box; }\nbody {\n  font-family: "Inter", sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  color: #fff;\n  text-align: center;\n}\nh1 { font-size: 3rem; margin-bottom: 1rem; }\np { font-size: 1.2rem; margin-bottom: 1rem; }\nbutton {\n  padding: 12px 32px;\n  font-size: 1rem;\n  border: none;\n  border-radius: 8px;\n  background: #fff;\n  color: #764ba2;\n  cursor: pointer;\n  font-weight: 600;\n  transition: transform 0.2s;\n}\nbutton:hover { transform: scale(1.05); }');
  jsCode = signal('document.getElementById("btn").addEventListener("click", function() {\n  document.getElementById("output").textContent = "You clicked the button! 🎉";\n  console.log("Button clicked!");\n});');
  
  compiledWebOutput = signal('');
  autoRun = signal(true);
  templates: Template[] = [];

  // Computed
  isWebMode = computed(() => this.selectedLanguage()?.id === 'web');

  private debounceTimer: any;

  constructor() {
    // Auto-compile when web code changes (debounced)
    effect(() => {
      const html = this.htmlCode();
      const css = this.cssCode();
      const js = this.jsCode();
      const isWeb = this.isWebMode();

      if (isWeb && this.autoRun()) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.compileWeb();
          this.saveWebState();
        }, 600);
      }
    });
  }

  ngOnInit(): void {
    // SEO
    this.meta.setMeta({
      title: 'CodeCanvas — Free Online Multi-Language Compiler & Editor',
      description: 'Write, compile, and run Web (HTML/CSS/JS), Python, JavaScript, Java, C++, and C code instantly in your browser.',
      keywords: 'online compiler, code editor, html compiler, python compiler, javascript runner',
      canonicalUrl: 'https://codecanvas.vercel.app/',
    });
    this.schema.injectWebApplicationSchema();
    this.themeService.initialize();

    this.templates = this.templatesService.getAll();
    const langs = this.compiler.getLanguages();
    this.languages.set(langs);

    // Initialize backend code map with defaults
    const initialCode: Record<string, string> = {};
    langs.forEach(l => {
      initialCode[l.id] = l.defaultCode;
    });

    if (isPlatformBrowser(this.platformId)) {
      // Load Backend State
      const savedCode = localStorage.getItem('codeByLanguage');
      if (savedCode) {
        try { Object.assign(initialCode, JSON.parse(savedCode)); } catch (e) {}
      }
      
      // Load Web State
      const savedWeb = this.storage.loadEditorState();
      if (savedWeb) {
        this.htmlCode.set(savedWeb.html);
        this.cssCode.set(savedWeb.css);
        this.jsCode.set(savedWeb.js);
      }

      // Restore Language Selection
      const savedLang = localStorage.getItem('selectedLanguage');
      const defaultLang = langs.find(l => l.id === savedLang) || langs[0];
      this.selectedLanguage.set(defaultLang);
      
      this.consoleService.startListening();
      if (defaultLang.id === 'web') {
        this.compileWeb();
      }
    } else {
      this.selectedLanguage.set(langs[0]);
    }

    this.codeByLanguage.set(initialCode);
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    this.consoleService.stopListening();
    this.schema.removeAllSchemas();
  }

  // --- Backend Methods ---
  get currentBackendCode(): string {
    const lang = this.selectedLanguage();
    if (!lang) return '';
    return this.codeByLanguage()[lang.id] || '';
  }

  onBackendCodeChange(newCode: string): void {
    const lang = this.selectedLanguage();
    if (lang) {
      this.codeByLanguage.update(map => ({ ...map, [lang.id]: newCode }));
      this.saveBackendState();
    }
  }

  runBackendCode(): void {
    const lang = this.selectedLanguage();
    const code = this.currentBackendCode;
    if (!lang || !code || this.isRunning()) return;

    this.isRunning.set(true);
    this.executionResult.set(null);

    this.compiler.executeBackendCode(lang.id, code).subscribe(result => {
      this.executionResult.set(result);
      this.isRunning.set(false);
    });
  }

  // --- Web Methods ---
  compileWeb(): void {
    const output = this.compiler.compileWebCode(this.htmlCode(), this.cssCode(), this.jsCode());
    this.compiledWebOutput.set(output);
  }

  runWebCode(): void {
    this.consoleService.clearMessages();
    this.compileWeb();
    this.saveWebState();
  }

  loadTemplate(template: Template): void {
    this.htmlCode.set(template.html.replace(/\\n/g, '\n'));
    this.cssCode.set(template.css.replace(/\\n/g, '\n'));
    this.jsCode.set(template.js.replace(/\\n/g, '\n'));
    this.compileWeb();
    this.saveWebState();
  }

  onHtmlChange(code: string): void { this.htmlCode.set(code); }
  onCssChange(code: string): void { this.cssCode.set(code); }
  onJsChange(code: string): void { this.jsCode.set(code); }

  onAutoRunChange(val: boolean): void {
    this.autoRun.set(val);
  }

  private saveWebState(): void {
    this.storage.saveEditorState({
      html: this.htmlCode(),
      css: this.cssCode(),
      js: this.jsCode(),
    });
  }

  // --- Shared Methods ---
  selectLanguage(lang: LanguageDef): void {
    this.selectedLanguage.set(lang);
    this.executionResult.set(null);
    this.consoleService.clearMessages();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedLanguage', lang.id);
    }
    if (lang.id === 'web') {
      this.compileWeb();
    }
  }

  runCode(): void {
    if (this.isWebMode()) {
      this.runWebCode();
    } else {
      this.runBackendCode();
    }
  }

  clearConsole(): void {
    if (this.isWebMode()) {
      this.consoleService.clearMessages();
    } else {
      this.executionResult.set(null);
    }
  }

  downloadCode(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const lang = this.selectedLanguage();
    if (!lang) return;

    if (this.isWebMode()) {
      const content = this.compiler.compileWebCode(this.htmlCode(), this.cssCode(), this.jsCode());
      this.downloadBlob(content, 'codecanvas-project.html', 'text/html');
    } else {
      const content = this.currentBackendCode;
      this.downloadBlob(content, `main.${lang.extension}`, 'text/plain');
    }
  }

  private downloadBlob(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  private saveBackendState(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('codeByLanguage', JSON.stringify(this.codeByLanguage()));
    }
  }

  onDragEnd() {
    if (isPlatformBrowser(this.platformId)) {
      window.dispatchEvent(new Event('resize'));
    }
  }
}
