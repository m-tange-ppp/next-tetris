"use client";

import { useEffect, useRef, useState } from "react";
import { ROWS, COLS, tetrominoes, TYPES } from "../utils/constants";
import { Grid, Position, Shape, Tetromino } from "../utils/types";

const GameBoard = () => {
    const createGrid = (): Grid => Array(ROWS).fill(null).map(() => Array(COLS).fill({ filled: 0 }));

    const setRandomTetrominoTypesArray = () => {
        const newTypes: string[] = [...TYPES];
        for (let i = TYPES.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newTypes[i], newTypes[j]] = [newTypes[j], newTypes[i]]
        }
        typesRef.current = newTypes;
    };
    
    const setRandomTetromino = () => {
        const types: string[] = typesRef.current;
        if (types.length === 0) {
            setRandomTetrominoTypesArray();
        }
        const randomTypes: string = typesRef.current.pop() as string
        activeTetromino.current = tetrominoes[randomTypes];
    };
    
    const calcCenter = (): number => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        return Math.floor((COLS - width + 1) / 2);
    };
    
    const calcTop = (): number => {
        const tetromino: Tetromino = activeTetromino.current;
        let top: number = 0;
        if (tetromino.shape[0].every(cell => cell === 0)) {
            top -= 1;
        }
        return top;
    };
    
    const [grid, setGrid] = useState(createGrid());
    
    const typesRef = useRef<string[]>(null!);
    if (typesRef.current === null) {
        setRandomTetrominoTypesArray();
    }
    const activeTetromino = useRef<Tetromino>(null!);
    if (activeTetromino.current === null) {
        setRandomTetromino();
    }
    const positionRef = useRef<Position>(null!);
    if (positionRef.current === null) {
        positionRef.current = {x: calcCenter(), y: calcTop()};
    }
    const gridRef = useRef(grid);
    const existFullRowsRef = useRef(false);

    const renderTetromino = () => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        const newGrid: Grid = gridRef.current.map(row => row.map(cell => ({...cell})));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino.shape[i][j]) {
                    newGrid[positionRef.current.y + i][positionRef.current.x + j] = {filled: 1, type: tetromino.type};
                }
            }
        }
        setGrid(newGrid);
    };

    const placeTetromino = () => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        const newGrid: Grid = gridRef.current.map(row => row.map(cell => ({...cell})));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino.shape[i][j]) {
                    newGrid[positionRef.current.y + i][positionRef.current.x + j] = {filled: 1, type: tetromino.type};
                }
            }
        }
        // 置くときだけrefを更新して保存
        gridRef.current = newGrid;
        setGrid(newGrid);
    };

    const canMove = (tetromino: Tetromino, newPosition: Position) => {
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        let newX, newY;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino.shape[i][j]) {
                    newY = newPosition.y + i;
                    newX = newPosition.x + j;
                    // refを参照して置かれたミノとの衝突を確認する
                    if (newY <= - 1 ||
                        newY >= ROWS || 
                        newX <= -1 ||
                        newX >= COLS ||
                        gridRef.current[newY][newX].filled) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    
    const checkFullRows = (): number[] => {
        const fullRows: number[] = [];
        const newGrid: Grid = gridRef.current.map(row => row.map(cell => ({...cell})));
        newGrid.forEach((row, rowIndex) => {
            if (row.every(cell => cell.filled === 1)) {
                fullRows.push(rowIndex);
            }
        });
        return fullRows;
    };

    const clearRows = (rows: number[]) => {
        const newGrid: Grid = gridRef.current.map(row => row.map(cell => ({...cell})));
        rows.forEach(y => {
            newGrid.splice(y, 1);
            newGrid.unshift(Array(COLS).fill({ filled: 0 }));
        });
        // refを更新して保存
        gridRef.current = newGrid;
        setGrid(newGrid);
    };

    const initTetromino = () => {
        setRandomTetromino();
        positionRef.current = {x: calcCenter(), y: calcTop()};
    };

    const moveTetromino = (direction: string) => {
        let nextPosition;
        if (direction === "left") {
            nextPosition = {x: positionRef.current.x - 1, y: positionRef.current.y};
            if (canMove(activeTetromino.current, nextPosition)) {
                positionRef.current = nextPosition;
                renderTetromino();
            }
        } else if (direction === "right") {
            nextPosition = {x: positionRef.current.x + 1, y: positionRef.current.y};
            if (canMove(activeTetromino.current, nextPosition)) {
                positionRef.current = nextPosition;
                renderTetromino();
            }
        }else if (direction === "down") {
            nextPosition = {x: positionRef.current.x, y: positionRef.current.y + 1};
            if (canMove(activeTetromino.current, nextPosition)) {
                positionRef.current = nextPosition;
                renderTetromino();
            } else {
                // ここから切り出したい
                placeTetromino();
                const fullRows: number[] = checkFullRows();
                if (fullRows.length > 0) {
                    clearRows(fullRows);
                    existFullRowsRef.current = true;
                } else {
                    initTetromino();
                    if (checkGameOver()) {
                        console.log("over");
                        resetGameBoard();
                    } else {
                        renderTetromino();
                    }
                }
            }
        }
    };

    const rotateTetromino = (direction: string) => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        const rotated: Shape = [];
        if (direction === "left") {
            for (let i = 0; i < width; i++) {
                rotated[i] = [];
                for (let j = 0; j < height; j++) {
                    rotated[i][j] = tetromino.shape[j][width - 1 - i];
                }
            }
        } else {
            for (let i = 0; i < width; i++) {
                rotated[i] = [];
                for (let j = 0; j < height; j++) {
                    rotated[i][j] = tetromino.shape[height - 1 - j][i];
                }
            }
        }
        if (canMove({type: activeTetromino.current.type, shape: rotated}, positionRef.current)) {
            activeTetromino.current.shape = rotated;
            renderTetromino();
        }
    };

    const dropTetromino = () => {
        const tetromino: Tetromino = activeTetromino.current;
        let newPostion: Position = positionRef.current;
        while (canMove(tetromino, {...newPostion, y: newPostion.y + 1})) {
            newPostion = {...newPostion, y: newPostion.y + 1}
        }
        positionRef.current = newPostion;
        renderTetromino();
    };

    const checkGameOver = () => {
        const tetromino: Tetromino = activeTetromino.current;
        const width: number = tetromino.shape[0].length;
        const height: number = tetromino.shape.length;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino.shape[i][j] && gridRef.current[positionRef.current.y + i][positionRef.current.x + j].filled) {
                    return true
                }
            }
        }
        return false;
    };

    const resetGameBoard = () => {
        gridRef.current = createGrid();
        setRandomTetrominoTypesArray();
        initTetromino();
        setGrid(gridRef.current);
        renderTetromino();
    }
    
    useEffect(() => {
        // setInterval内のstateは初期値が保存されているためuseRefで対応する。
        renderTetromino();
        const interval: NodeJS.Timeout = setInterval(() => {
            if (existFullRowsRef.current) {
                // 消去した後に新しいミノを始める
                initTetromino();
                renderTetromino();
                existFullRowsRef.current = false;
            } else {
                moveTetromino("down");
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEventInit) => {
            if (!existFullRowsRef.current) {
                if (e.key === "ArrowLeft") {
                    moveTetromino("left");
                } else if (e.key === "ArrowRight") {
                    moveTetromino("right");
                } else if (e.key === "ArrowDown") {
                    moveTetromino("down");
                } else if (e.key === "z") {
                    rotateTetromino("left");
                } else if (e.key === "x") {
                    rotateTetromino("right");
                } else if (e.key === "ArrowUp") {
                    dropTetromino();
                }
            }
        }
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    });

    return (
        <div>
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((cell, cellIndex) => (
                        <span
                            key={cellIndex}
                            className={`inline-block w-6 h-6 border border-black -m-px ${cell.filled? cell.type === "I"
                                ? "bg-cyan-500"
                                : cell.type === "O"
                                ? "bg-yellow-500"
                                : cell.type === "T"
                                ? "bg-purple-500"
                                : cell.type === "L"
                                ? "bg-orange-500"
                                : cell.type === "J"
                                ? "bg-blue-500"
                                : cell.type === "S"
                                ? "bg-lime-500"
                                : cell.type === "Z"
                                ? "bg-red-500"
                                : "bg-gray-500"
                                : "bg-white"}`}>
                        </span>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default GameBoard;