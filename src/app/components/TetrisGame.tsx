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
        <div className="flex gap-4 justify-center">
            <ScoreBoard score={score} /> 
            <GameBoard 
            setTypesArray={setTypesArray} 
            setScore={setScore}
            resetGame={resetGame} 
            key={key} />
            <div>
                <ShowNextTetromino 
                typesArray={typesArray} 
                typesArrayIndex={1} />
                <ShowNextTetromino 
                typesArray={typesArray} 
                typesArrayIndex={2} />
            </div>
        </div>
    );
};


export default TetrisGame;