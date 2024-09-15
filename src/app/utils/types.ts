export interface Cell {
    filled: number;
    color?: string;
    }

export type Grid = Cell[][];

export type Shape = number[][];

export type Tetrominoes = {[key: string]: Shape}