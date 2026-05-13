import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CompilerService {
  /**
   * Combines HTML, CSS, and JS into a full document string
   * suitable for use as an iframe srcdoc attribute.
   * Injects console capture and error handling scripts.
   */
  compileCode(html: string, css: string, js: string): string {
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
  <\/script>
</body>
</html>`;
  }

  private buildDocumentFromFullHtml(html: string, css: string, js: string, resetStyles: string): string {
    let documentHtml = html;
    const styleTag = `<style>\n${resetStyles}\n${this.escapeCss(css)}\n<\/style>`;
    const consoleScript = this.buildConsoleScript();
    const userScript = `<script>\ntry {\n${js}\n} catch(e) {\n  console.error('JavaScript Error: ' + e.message);\n}\n<\/script>`;

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
})();\n<\/script>`;
  }

  private isFullDocument(html: string): boolean {
    return /<!doctype|<html|<head|<body/i.test(html);
  }

  private escapeCss(css: string): string {
    // Escape </style> tags that might appear in user CSS
    return css.replace(/<\/style>/gi, '<\\/style>');
  }
}
