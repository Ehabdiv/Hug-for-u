export interface ImageData {
  file: File;
  previewUrl: string;
  base64: string; // Raw base64 without prefix
  mimeType: string;
}

export interface GenerationResult {
  imageUrl: string | null;
  text: string | null;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
