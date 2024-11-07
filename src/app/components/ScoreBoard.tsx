"use client";

import { useState } from "react";

interface GameBoardProps {
    score: number;
};

const ScoreBoard: React.FC<GameBoardProps> = ({ score }) => {
    return (
        <div>
            <p>SCORE</p>
            <p>{score}</p>
        </div>
    );
};

export default ScoreBoard;