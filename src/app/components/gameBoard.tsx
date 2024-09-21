"use client";

import { KeyboardEvent, use, useEffect, useRef, useState } from "react";
import { ROWS, COLS, tetrominoes } from "../utils/constants";
import { Grid, Position } from "../utils/types";

const GameBoard = () => {
    const createGrid = (): Grid => Array(ROWS).fill(null).map(() => Array(COLS).fill({ filled: 0 }));

    const calcCenter = () => {
        const tetromino = activeTetromino.current;
        const width = tetromino[0].length;
        return Math.floor((COLS - width + 1) / 2);
    };

    const [grid, setGrid] = useState(createGrid());

    const activeTetromino = useRef(tetrominoes["T"]);
    const positionRef = useRef({x: calcCenter(), y: 0});
    const gridRef = useRef(grid);

    const renderTetromino = () => {
        const tetromino = activeTetromino.current;
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

    const placeTetromino = () => {
        const tetromino = activeTetromino.current;
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
        const tetromino = activeTetromino.current;
        const width = tetromino[0].length;
        const height = tetromino.length;
        let newX, newY;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                newY = newPosition.y + i;
                newX = newPosition.x + j;
                // refを参照して置かれたミノとの衝突を確認する
                if (newY >= ROWS || 
                    newX <= -1 ||
                    newX >= COLS ||
                    gridRef.current[newY][newX].filled) {
                    return false;
                }
            }
        }
        return true;
    };
    
    const setRandomTetromino = () => {
        const keys = Object.keys(tetrominoes);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        activeTetromino.current = tetrominoes[randomKey];
    }
    
        const moveTetromino = (direction: string) => {
            let nextPosition;
            if (direction === "left") {
                nextPosition = {x: positionRef.current.x - 1, y: positionRef.current.y};
                if (canMove(nextPosition)) {
                    positionRef.current = nextPosition;
                    renderTetromino();
                }
            } else if (direction === "right") {
                nextPosition = {x: positionRef.current.x + 1, y: positionRef.current.y};
                if (canMove(nextPosition)) {
                    positionRef.current = nextPosition;
                    renderTetromino();
                }
            }else if (direction === "down") {
                nextPosition = {x: positionRef.current.x, y: positionRef.current.y + 1};
                if (canMove(nextPosition)) {
                    positionRef.current = nextPosition;
                } else {
                    placeTetromino();
                    setRandomTetromino();
                }
                renderTetromino();
            }
        }
    
    useEffect(() => {
        // setInterval内のstateは初期値が保存されているためuseRefで対応する。
        renderTetromino();
        const interval = setInterval(() => {
            moveTetromino("down");
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEventInit) => {
            if (e.key === "ArrowLeft") {
                moveTetromino("left");
            } else if (e.key === "ArrowRight") {
                moveTetromino("right");
            } else if (e.key === "ArrowDown") {
                moveTetromino("down");
            }
        }
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    });

    return (
        <div>
            <button>おす</button>
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((cell, cellIndex) => (
                        <span
                            key={cellIndex}
                            className={`inline-block w-3 h-3 ${cell.filled? "bg-sky-500": "bg-white"} border-black border`}>
                        </span>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default GameBoard;