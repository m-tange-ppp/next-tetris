"use client";

interface LevelBoardProps {
  level: number;
}

const LevelBoard: React.FC<LevelBoardProps> = ({ level }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border-2 border-purple-500 shadow-lg mb-4">
      <h2 className="text-white text-lg font-bold mb-2 text-center">レベル</h2>
      <p className="text-green-400 text-2xl font-bold text-center">{level}</p>
    </div>
  );
};

export default LevelBoard;
