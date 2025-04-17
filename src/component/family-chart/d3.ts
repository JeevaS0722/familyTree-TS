// src/d3.ts
import * as _d3 from 'd3';

// This allows using either global d3 or imported d3
const d3: typeof _d3 =
  typeof window === 'object' && window.d3 ? window.d3 : _d3;

// Add d3 to window type
declare global {
  interface Window {
    d3?: typeof _d3;
    fs?: {
      readFile: (
        filepath: string,
        options?: { encoding?: string }
      ) => Promise<any>;
    };
  }
}

export default d3;
