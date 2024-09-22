import { Tetrominoes } from "./types";

export const ROWS = 20;
export const COLS = 6;

export const tetrominoes: Tetrominoes = {
    I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    ],
    O: [
    [1, 1], 
    [1, 1],
    ],
    T: [
    [0, 1, 0], 
    [1, 1, 1],
    [0, 0, 0]
    ],
    L: [
    [0, 0, 1], 
    [1, 1, 1], 
    [0, 0, 0],
    ],
    J: [
    [1, 0, 0], 
    [1, 1, 1], 
    [0, 0, 0],
    ],
    S: [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
    ],
    Z: [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
    ],
};