export interface Cell {
    filled: 0|1;
    type?: string;
    }

export type Grid = Cell[][];

export type Shape = number[][];

export type Tetromino = {type: string, shape: Shape};

export type Tetrominoes = {[key: string]: Tetromino};

export type Position = {x: number, y: number};