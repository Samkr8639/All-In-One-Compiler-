import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import {
  LanguageDef,
  InternalExecutionResult
} from '../models/compiler.models';

// Wandbox compiler IDs for each language
const WANDBOX_COMPILERS: Record<string, { compiler: string; options?: string }> = {
  python:     { compiler: 'cpython-3.12.7' },
  javascript: { compiler: 'nodejs-18.20.4' },
  java:       { compiler: 'openjdk-jdk-21+35' },
  cpp:        { compiler: 'gcc-head' },
  c:          { compiler: 'gcc-head-c' },
};

@Injectable({ providedIn: 'root' })
export class CompilerService {
  private http = inject(HttpClient);
  private wandboxUrl = 'https://wandbox.org/api/compile.json';

  readonly SUPPORTED_LANGUAGES: LanguageDef[] = [
    {
      id: 'web',
      version: 'HTML5',
      name: 'Web (HTML/CSS/JS)',
      monacoLanguage: 'html',
      extension: 'html',
      defaultCode: ''
    },
    {
      id: 'python',
      version: '3.12.7',
      name: 'Python',
      monacoLanguage: 'python',
      extension: 'py',
      defaultCode: 'print("Hello, World!")\n'
    },
    {
      id: 'javascript',
      version: 'Node 18.20',
      name: 'JavaScript (Node)',
      monacoLanguage: 'javascript',
      extension: 'js',
      defaultCode: 'console.log("Hello, World!");\n'
    },
    {
      id: 'java',
      version: 'OpenJDK 21',
      name: 'Java',
      monacoLanguage: 'java',
      extension: 'java',
      defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n'
    },
    {
      id: 'cpp',
      version: 'GCC (latest)',
      name: 'C++',
      monacoLanguage: 'cpp',
      extension: 'cpp',
      defaultCode: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n'
    },
    {
      id: 'c',
      version: 'GCC (latest)',
      name: 'C',
      monacoLanguage: 'c',
      extension: 'c',
      defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n'
    }
  ];

  getLanguages(): LanguageDef[] {
    return this.SUPPORTED_LANGUAGES;
  }

  getLanguageDef(id: string): LanguageDef | undefined {
    return this.SUPPORTED_LANGUAGES.find(lang => lang.id === id);
  }

  // --- Backend Execution (Wandbox API — free, no auth) ---
  executeBackendCode(languageId: string, code: string, stdin: string = ''): Observable<InternalExecutionResult> {
    const wandbox = WANDBOX_COMPILERS[languageId];
    if (!wandbox) {
      return of({ stdout: '', stderr: `Language "${languageId}" is not supported.`, exitCode: -1, success: false });
    }

    const payload: any = { code, compiler: wandbox.compiler, stdin };
    if (wandbox.options) {
      payload['compiler-option-raw'] = wandbox.options;
    }
    // Java requires the filename to match the public class name
    if (languageId === 'java') {
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      if (classMatch) {
        payload['file'] = `${classMatch[1]}.java`;
      }
    }

    return this.http.post<any>(this.wandboxUrl, payload).pipe(
      map(res => ({
        stdout: res.program_output || '',
        stderr: res.program_error || '',
        compileOutput: res.compiler_error || res.compiler_output || '',
        exitCode: parseInt(res.status ?? '0', 10),
        success: res.status === '0'
      })),
      catchError(error => of({
        stdout: '',
        stderr: `Network or API Error: ${error.message}`,
        exitCode: -1,
        success: false
      }))
    );
  }

  // --- Web Compilation (Iframe srcdoc) ---
  compileWebCode(html: string, css: string, js: string): string {
    const trimmedHtml = (html || '').trim();
    const resetStyles = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }`;

    if (this.isFullDocument(trimmedHtml)) {
      return this.buildDocumentFromFullHtml(trimmedHtml, css, js, resetStyles);
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${resetStyles}
    ${this.escapeCss(css)}
  </style>
</head>
<body>
  ${trimmedHtml}
  ${this.buildConsoleScript()}
  <script>
    try {
      ${js}
    } catch(e) {
      console.error('JavaScript Error: ' + e.message);
    }
  </script>
</body>
</html>`;
  }

  private buildDocumentFromFullHtml(html: string, css: string, js: string, resetStyles: string): string {
    let documentHtml = html;
    const styleTag = `<style>\n${resetStyles}\n${this.escapeCss(css)}\n</style>`;
    const consoleScript = this.buildConsoleScript();
    const userScript = `<script>\ntry {\n${js}\n} catch(e) {\n  console.error('JavaScript Error: ' + e.message);\n}\n</script>`;

    if (/<\/head>/i.test(documentHtml)) {
      documentHtml = documentHtml.replace(/<\/head>/i, `${styleTag}\n</head>`);
    } else if (/<head[^>]*>/i.test(documentHtml)) {
      documentHtml = documentHtml.replace(/<head[^>]*>/i, match => `${match}\n${styleTag}`);
    } else if (/<html[^>]*>/i.test(documentHtml)) {
      documentHtml = documentHtml.replace(/<html[^>]*>/i, match => `${match}\n<head>\n${styleTag}\n</head>`);
    } else {
      documentHtml = `${styleTag}\n${documentHtml}`;
    }

    if (/<\/body>/i.test(documentHtml)) {
      documentHtml = documentHtml.replace(/<\/body>/i, `${consoleScript}\n${userScript}\n</body>`);
    } else if (/<\/html>/i.test(documentHtml)) {
      documentHtml = documentHtml.replace(/<\/html>/i, `${consoleScript}\n${userScript}\n</html>`);
    } else {
      documentHtml = `${documentHtml}\n${consoleScript}\n${userScript}`;
    }

    if (!/^<!doctype/i.test(documentHtml)) {
      documentHtml = `<!DOCTYPE html>\n${documentHtml}`;
    }

    return documentHtml;
  }

  private buildConsoleScript(): string {
    return `<script>\n(function() {\n  function serialize(args) {\n    return Array.from(args).map(function(arg) {\n      if (arg === null) return 'null';\n      if (arg === undefined) return 'undefined';\n      if (typeof arg === 'object') {\n        try { return JSON.stringify(arg, null, 2); } catch(e) { return String(arg); }\n      }\n      return String(arg);\n    });\n  }\n\n  var _log = console.log;\n  var _warn = console.warn;\n  var _error = console.error;\n  var _info = console.info;\n  var _clear = console.clear;\n\n  console.log = function() { parent.postMessage({ type: 'log', args: serialize(arguments) }, '*'); _log.apply(console, arguments); };
  console.warn = function() { parent.postMessage({ type: 'warn', args: serialize(arguments) }, '*'); _warn.apply(console, arguments); };
  console.error = function() { parent.postMessage({ type: 'error', args: serialize(arguments) }, '*'); _error.apply(console, arguments); };
  console.info = function() { parent.postMessage({ type: 'info', args: serialize(arguments) }, '*'); _info.apply(console, arguments); };
  console.clear = function() { parent.postMessage({ type: 'clear', args: [] }, '*'); _clear.apply(console, arguments); };
\n  window.onerror = function(msg, src, line, col, error) { parent.postMessage({ type: 'error', args: ['Runtime Error: ' + msg + ' (line ' + line + ', col ' + col + ')'] }, '*'); return false; };
  window.onunhandledrejection = function(event) { parent.postMessage({ type: 'error', args: ['Unhandled Promise Rejection: ' + String(event.reason)] }, '*'); };
})();\n</script>`;
  }

  private isFullDocument(html: string): boolean {
    return /<!doctype|<html|<head|<body/i.test(html);
  }

  private escapeCss(css: string): string {
    return css.replace(/<\/style>/gi, '<\\/style>');
  }
}
