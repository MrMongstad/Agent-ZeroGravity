export type EngineStatus = 'idle' | 'scraping' | 'reading' | 'paused' | 'error';

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TextChunk {
    text: string;
    rects: Rect[];
}
