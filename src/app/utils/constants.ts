import { Tetrominoes } from "./types";

export const ROWS = 20;
export const COLS = 6;

export const tetrominoes: Tetrominoes = {
    I: {type: "I", shape: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    ]}, 
    O: {type: "O", shape: [
    [1, 1], 
    [1, 1],
    ]},
    T: {type: "T", shape: [
    [0, 1, 0], 
    [1, 1, 1],
    [0, 0, 0]
    ]},
    L: {type: "L", shape: [
    [0, 0, 1], 
    [1, 1, 1], 
    [0, 0, 0],
    ]},
    J: {type: "J", shape: [
    [1, 0, 0], 
    [1, 1, 1], 
    [0, 0, 0],
    ]},
    S: {type: "S", shape: [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
    ]},
    Z: {type: "Z", shape: [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
    ]}
};