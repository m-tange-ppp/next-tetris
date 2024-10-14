"use client";

import { useEffect, useState } from "react";
import { Grid, Tetromino } from "../utils/types";
import { TETROMINOES } from "../utils/constants";


interface GameBoardProps {
    nextTetrominoType: string|null;
};


const ShowTetromino: React.FC<GameBoardProps> = ({ nextTetrominoType }) => {
    const createGrid = (): Grid => {
        let width: number = 3;
        if (nextTetrominoType !== null) {
            width = TETROMINOES[nextTetrominoType].shape.length;
        }
        return Array(width).fill(null).map(() => Array(width).fill({ filled: 0 }));
    };


    const [grid, setGrid] = useState<Grid>(() => createGrid());


    const renderTetromino = () => {
        const newGrid: Grid = createGrid();
        const width: number = newGrid.length;
        const tetromino: Tetromino = TETROMINOES[nextTetrominoType as string];

        for (let i = 0; i < width; i++) {
            for (let j = 0; j < width; j++) {
                if (tetromino.shape[i][j]) {
                    newGrid[i][j] = {filled: 1, type: tetromino.type};
                }
            }
        }

        setGrid(newGrid);
    };
    
    
    useEffect(() => {
        if (nextTetrominoType !== null) {
            renderTetromino();
        }
    }, [nextTetrominoType]);


    return (
        <div className="">
            <div className="">
                <p>NEXT</p>
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
                                    : "bg-gray-300"
                                    : "bg-white"}`}>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
};


export default ShowTetromino;