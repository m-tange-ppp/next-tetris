"use client";

interface ScoreBoardProps {
  score: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border-2 border-purple-500 shadow-lg mb-4">
      <h2 className="text-white text-lg font-bold mb-2 text-center">スコア</h2>
      <p className="text-yellow-400 text-2xl font-bold text-center">{score}</p>
    </div>
  );
};

export default ScoreBoard;
