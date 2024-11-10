"use client";

import { useState } from "react";
import GameBoard from "./GameBoard";
import ShowNextTetromino from "./ShowNextTetromino";
import ScoreBoard from "./ScoreBoard";


const TetrisGame: React.FC = () => {
    // ゲームリセット用のキー
    const [key, setKey] = useState<number>(0);
    const [typesArray, setTypesArray] = useState<string[]|null>(null);
    const [holdTetrominoType, setHoldTetrominoType] = useState<string|null>(null);
    const [score, setScore] = useState<number>(0);


    const resetGame = (): void => {
        setKey(prev => prev + 1);
        setScore(0);
    };


    return (
        <div className="flex gap-4">
            <GameBoard 
            setTypesArray={setTypesArray} 
            setScore={setScore}
            resetGame={resetGame} 
            key={key} />
            <div>
                <ScoreBoard score={score} /> 
                <ShowNextTetromino typesArray={typesArray} />
            </div>
        </div>
    );
};


export default TetrisGame;