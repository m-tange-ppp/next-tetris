"use client";

import { useEffect, useRef, useState } from "react";
import { ROWS, COLS, tetrominoes } from "../utils/constants";
import { Grid, Position } from "../utils/types";

const GameBoard = () => {
    const createGrid = (): Grid => Array(ROWS).fill(null).map(() => Array(COLS).fill({ filled: 0 }));

    const calcCenter = () => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        const height = tetromino.length;
        return Math.floor((COLS - width + 1) / 2);
    };

    const [grid, setGrid] = useState(createGrid());
    const [activeTetromino, setActiveTetromino] = useState(tetrominoes["T"]);
    const [position, setPosition] = useState({x: calcCenter(), y: 0});

    const positionRef = useRef(position);
    const gridRef = useRef(grid);

    const renderTetromino = (position: Position) => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        const height = tetromino.length;
        const newGrid = grid.map(row => row.map(cell => ({...cell})));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                newGrid[i + position.y][j + position.x].filled = tetromino[i][j];
            }
        }
        setGrid(newGrid);
    };

    const dropTetromino = () => {
        setPosition((prevPos) => ({
            x: prevPos.x,
            y: prevPos.y + 1
        }));
    };

    const canMove = (newPosition: Position) => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        const height = tetromino.length;
        let newX, newY;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                newX = newPosition.x + i;
                newY = newPosition.y + j;
                if (newY >= ROWS || grid[newY][newX].filled) {
                    return false;
                }
            }
        }
    };

    useEffect(() => {
        positionRef.current = position;
    }, [position]);

    useEffect(() => {
        // setInterval内のstateは初期値が保存されているためuseRefで対応する。
        const interval = setInterval(() => {
            dropTetromino();
            renderTetromino(positionRef.current);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <button>おす</button>
            {grid.map(row => (
                row.map(cell => (
                    <div>{cell.filled}</div>
                ))
            ))}
        </div>
    )
}

export default GameBoard;