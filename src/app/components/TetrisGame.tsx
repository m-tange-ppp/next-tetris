"use client";

import { useState } from "react";
import GameBoard from "./GameBoard";
import ShowNextTetromino from "./ShowNextTetromino";
import ScoreBoard from "./ScoreBoard";
import ShowHeldTetromino from "./ShowHeldTetromino";
import LevelBoard from "./LevelBoard";


const TetrisGame: React.FC = () => {
    // ゲームリセット用のキー
    const [key, setKey] = useState<number>(0);
    const [typesArray, setTypesArray] = useState<string[]|null>(null);
    const [heldTetrominoType, setHeldTetrominoType] = useState<string|null>(null);
    const [score, setScore] = useState<number>(0);
    const [level, setLevel] = useState<number>(1);


    const resetGame = (): void => {
        setKey(prev => prev + 1);
        setScore(0);
        setLevel(1);
        setHeldTetrominoType(null);
    };


    return (
        <div className="flex gap-4 justify-center">
            <div className=" flex flex-col justify-between">
                <ShowHeldTetromino heldTetrominoType={heldTetrominoType}/>
                <div>
                    <LevelBoard level={level} />
                    <ScoreBoard score={score} /> 
                </div>
            </div>
            <GameBoard 
            setTypesArray={setTypesArray} 
            setScore={setScore}
            resetGame={resetGame}
            heldTetrominoType={heldTetrominoType}
            setHeldTetrominoType={setHeldTetrominoType}
            level={level}
            setLevel={setLevel}
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