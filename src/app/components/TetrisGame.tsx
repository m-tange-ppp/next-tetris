"use client";

import { useState } from "react";
import GameBoard from "./GameBoard";
import ShowTetromino from "./ShowTetromino";


const TetrisGame: React.FC = () => {
    // ゲームリセット用のキー
    const [key, setKey] = useState<number>(0);
    const [nextTetrominoType, setNextTetrominoType] = useState<string|null>(null);
    const [holdTetrominoType, setHoldTetrominoType] = useState<string|null>(null);
    const [score, setScore] = useState<number>(0);


    const resetGame = (): void => {
        setKey(prev => prev + 1);
    };


    return (
        <div className="flex gap-4">
            <GameBoard 
            setNextTetrominoType={setNextTetrominoType} 
            resetGame={resetGame} 
            key={key} />
            <ShowTetromino nextTetrominoType={nextTetrominoType} />
        </div>
    );
};


export default TetrisGame;