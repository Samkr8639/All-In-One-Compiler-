export interface LanguageDef {
  id: string; // Piston identifier (e.g., 'python')
  version: string; // Piston version (e.g., '3.10.0')
  name: string; // Display name
  monacoLanguage: string; // Monaco editor syntax identifier
  extension: string; // File extension without dot
  defaultCode: string;
}

export interface ExecutionRequest {
  language: string;
  version: string;
  files: {
    name?: string;
    content: string;
  }[];
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
}

export interface ExecutionResponse {
  language: string;
  version: string;
  run: ExecutionResult;
  compile?: ExecutionResult;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  output: string;
  code: number;
  signal: string | null;
}

export interface InternalExecutionResult {
  stdout: string;
  stderr: string;
  compileOutput?: string;
  exitCode: number;
  success: boolean;
  duration?: number;
}
