"use client";

import { useEffect, useState } from "react";
import { Grid, Tetromino } from "../utils/types";
import { TETROMINOES } from "../utils/constants";
import React from "react";


interface GameBoardProps {
    typesArray: string[]|null;
};


const ShowNextTetromino: React.FC<GameBoardProps> = ({ typesArray }) => {
    const createGrid = (): Grid => {
        let width: number = 3;
        if (typesArray !== null) {
            width = TETROMINOES[typesArray[typesArray.length - 1]].shape.length;
        }
        return Array(width).fill(null).map(() => Array(width).fill({ filled: 0 }));
    };


    const [grid, setGrid] = useState<Grid>(() => createGrid());


    const renderTetromino = (): void => {
        const newGrid: Grid = createGrid();
        const width: number = newGrid.length;
        if (typesArray !== null) {
            const tetromino: Tetromino = TETROMINOES[typesArray[typesArray.length - 1]];

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
        console.log(typesArray);
        renderTetromino();
        return () => {
        }
    }, [typesArray?.length]);


    return (
        <div>
            <div>
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
    );
};


export default ShowNextTetromino;