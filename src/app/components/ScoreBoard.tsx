"use client";

interface ScoreBoardProps {
    score: number;
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
    return (
        <div className=" w-24">
            <p>SCORE</p>
            <p className=" text-4xl">{score}</p>
        </div>
    );
};

export default ScoreBoard;