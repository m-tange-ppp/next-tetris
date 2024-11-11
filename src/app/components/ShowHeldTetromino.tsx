"use client";

import { useEffect, useState } from "react";
import { Grid, Tetromino } from "../utils/types";
import { TETROMINOES } from "../utils/constants";
import React from "react";


interface ShowHeldTetrominoProps {
    heldTetrominoType: string|null;
};


const ShowHeldTetromino: React.FC<ShowHeldTetrominoProps> = ({ heldTetrominoType }) => {
    const createGrid = (): Grid => {
        let width: number = 0;
        if (heldTetrominoType != null) {
            width = TETROMINOES[heldTetrominoType].shape.length;
        }
        return Array(width).fill(null).map(() => Array(width).fill({ filled: 0 }));
    };


    const [grid, setGrid] = useState<Grid>(() => createGrid());


    const renderTetromino = (): void => {
        const newGrid: Grid = createGrid();
        const width: number = newGrid.length;
        if (heldTetrominoType != null) {
            const tetromino: Tetromino = TETROMINOES[heldTetrominoType];

            for (let i = 0; i < width; i++) {
                for (let j = 0; j < width; j++) {
                    if (tetromino.shape[i][j]) {
                        newGrid[i][j] = {filled: 1, type: tetromino.type};
                    }
                }
            }
        }
        setGrid(newGrid);
    };


    useEffect(() => {
        renderTetromino();
    }, [heldTetrominoType]);


    return (
        <div>
            <p>HOLD</p>
            <div className="w-24 h-24 flex items-center justify-center">
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
                                        : "bg-gray-300"
                                        : "bg-white"}`}>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default ShowHeldTetromino;