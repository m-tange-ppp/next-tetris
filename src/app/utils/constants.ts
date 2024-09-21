import { Tetrominoes } from "./types";

export const ROWS = 20;
export const COLS = 6;

export const tetrominoes: Tetrominoes = {
    I: [
    [1],
    [1],
    [1],
    [1],
    ],
    O: [
    [1, 1], 
    [1, 1],
    ],
    T: [
    [0, 1, 0], 
    [1, 1, 1],
    ],
    L: [
    [1, 0], 
    [1, 0], 
    [1, 1],
    ],
    J: [
    [0, 1], 
    [0, 1], 
    [1, 1],
    ],
    S: [
    [0, 1, 1],
    [1, 1, 0],
    ],
    Z: [
    [1, 1, 0],
    [0, 1, 1],
    ],
};