"use client";

import { useState } from "react";

interface GameBoardProps {
    score: number;
};

const ScoreBoard: React.FC<GameBoardProps> = ({ score }) => {
    return (
        <div className="w-24">
            <p>SCORE</p>
            <p>{score}</p>
        </div>
    );
};

export default ScoreBoard;