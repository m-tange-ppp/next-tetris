"use client";

import { useEffect, useState } from "react";
import { ROWS, COLS, tetrominoes } from "../utils/constants";
import { Grid } from "../utils/types";


const GameBoard = () => {
    const createGrid = (): Grid => Array(ROWS).fill(null).map(() => Array(COLS).fill({ filled: 0 }));

    const [grid, setGrid] = useState(createGrid());
    const [activeTetromino, setActiveTetromino] = useState(tetrominoes["T"]);
    
    const placeTetromino = () => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        const height = tetromino.length;
        const firstLeft = Math.floor((COLS - width + 1) / 2);
        const newGrid = grid.map(row => row.map(cell => ({...cell})));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                newGrid[i][j + firstLeft].filled = tetromino[i][j];
            }
        }
        setGrid(newGrid);
    }

    return (
        <div>
            {grid.map(row => (
                row.map(cell => (
                    <div>{cell.filled}</div>
                ))
            ))}
            <button onClick={placeTetromino}>おく</button>
        </div>
    )
}

export default GameBoard;