"use client";


import { useState } from "react";
import GameBoard from "./GameBoard";
import NextTetromino from "./NextTetromino";


const TetrisGame: React.FC = () => {
    const [nextTetrominoType, setNextTetrominoType] = useState<string>("I");
    const [score, setScore] = useState<number>(0);


    return (
        <div className="flex gap-4">
            <GameBoard setNextTetrominoType={setNextTetrominoType} />
            <NextTetromino nextTetrominoType={nextTetrominoType} />
        </div>
    );
};


export default TetrisGame;