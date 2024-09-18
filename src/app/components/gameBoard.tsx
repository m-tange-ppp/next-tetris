"use client";

import { use, useEffect, useRef, useState } from "react";
import { ROWS, COLS, tetrominoes } from "../utils/constants";
import { Grid, Position } from "../utils/types";

const GameBoard = () => {
    const createGrid = (): Grid => Array(ROWS).fill(null).map(() => Array(COLS).fill({ filled: 0 }));

    const calcCenter = () => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        return Math.floor((COLS - width + 1) / 2);
    };

    const [grid, setGrid] = useState(createGrid());
    const [activeTetromino, setActiveTetromino] = useState(tetrominoes["T"]);

    const positionRef = useRef({x: calcCenter(), y: 0});
    const gridRef = useRef(grid);

    const renderTetromino = () => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        const height = tetromino.length;
        const newGrid = gridRef.current.map(row => row.map(cell => ({...cell})));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino[i][j] !== 0) {
                    newGrid[positionRef.current.y + i][positionRef.current.x + j].filled = tetromino[i][j];
                }
            }
        }
        setGrid(newGrid);
    };

    const removeTetromino = () => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        const height = tetromino.length;
        const newGrid = gridRef.current.map(row => row.map(cell => ({...cell})));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino[i][j] !== 0) {
                    newGrid[positionRef.current.y + i][positionRef.current.x + j].filled = 0;
                }
            }
        }
        setGrid(newGrid);
    }

    const dropTetromino = () => {
        const nextPosition = {x: positionRef.current.x, y: positionRef.current.y + 1}
        if (canMove(nextPosition)) {
            positionRef.current = nextPosition;
        } else {
            placeTetromino();
        }
    };

    const placeTetromino = () => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        const height = tetromino.length;
        const newGrid = gridRef.current.map(row => row.map(cell => ({...cell})));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino[i][j] !== 0) {
                    newGrid[positionRef.current.y + i][positionRef.current.x + j].filled = tetromino[i][j];
                }
            }
        }
        // 置くときだけrefを更新して保存
        gridRef.current = newGrid;
        setGrid(newGrid);
        positionRef.current = {x: calcCenter(), y: 0};
    }

    const canMove = (newPosition: Position) => {
        const tetromino = activeTetromino;
        const width = tetromino[0].length;
        const height = tetromino.length;
        let newX, newY;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                newY = newPosition.y + i;
                newX = newPosition.x + j;
                // refを参照して置かれたミノとの衝突を確認する
                if (newY >= ROWS || gridRef.current[newY][newX].filled) {
                    return false;
                }
            }
        }
        return true;
    };

    useEffect(() => {
        // setInterval内のstateは初期値が保存されているためuseRefで対応する。
        renderTetromino();
        const interval = setInterval(() => {
            dropTetromino();
            renderTetromino();
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <button>おす</button>
            {grid.map(row => (
                <div>
                    {row.map(cell => (
                        <span>{cell.filled}</span>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default GameBoard;