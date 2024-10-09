"use client";

import { useState } from "react";
import GameBoard from "./GameBoard";

const TetrisGame: React.FC = () => {
    const [nextTetrominoType, setNextTetrominoType] = useState<string|null>(null);
    const [score, setScore] = useState<number>(0);


    return (
        <div>
            <GameBoard setNextTetrominoType={setNextTetrominoType} />
        </div>
    );
};

export default TetrisGame;