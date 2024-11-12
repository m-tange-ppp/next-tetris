"use client";

interface LevelBoardProps {
    level: number;
};

const LevelBoard: React.FC<LevelBoardProps> = ({ level }) => {
    return (
        <div className=" w-24">
            <p>LEVEL</p>
            <p className=" text-4xl">{level}</p>
        </div>
    );
};

export default LevelBoard;