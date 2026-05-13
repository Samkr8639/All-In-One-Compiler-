export interface EditorState {
  html: string;
  css: string;
  js: string;
}

export interface ConsoleMessage {
  type: 'log' | 'warn' | 'error' | 'info';
  args: string[];
  timestamp: Date;
}

export interface Template {
  slug: string;
  name: string;
  description: string;
  category: string;
  html: string;
  css: string;
  js: string;
}

export type EditorTab = 'html' | 'css' | 'javascript';

export interface ThemeMode {
  isDark: boolean;
  monacoTheme: string;
}
