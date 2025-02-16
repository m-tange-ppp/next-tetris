import React, { useState, useEffect } from "react";
import { getTopScores, getScoreRank } from "@/actions/scoreActions";

interface GameOverModalProps {
  score: number;
  onSubmit: (playerName: string) => void;
}

interface TopScore {
  id: string;
  playerName: string;
  score: number;
  createdAt: Date;
}

interface RankData {
  rank: number;
  total: number;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onSubmit }) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [topScores, setTopScores] = useState<TopScore[]>([]);
  const [rankData, setRankData] = useState<RankData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const [scores, rankInfo] = await Promise.all([
          getTopScores(5),
          getScoreRank(score),
        ]);
        setTopScores(scores as TopScore[]);
        setRankData(rankInfo as RankData);
      } catch (error) {
        console.error("スコアデータの取得に失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScoreData();
  }, [score]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onSubmit(playerName);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg border-4 border-purple-500 shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          ゲームオーバー
        </h2>
        <p className="mb-4 text-xl text-center text-yellow-400">
          スコア: {score}
        </p>
        {!isLoading && rankData && (
          <p className="mb-6 text-lg text-center text-green-400">
            順位: {rankData.rank}位 / {rankData.total}人中
          </p>
        )}

        <div className="mb-6">
          <h3 className="text-white text-lg font-bold mb-3">トップ5スコア</h3>
          {isLoading ? (
            <p className="text-gray-400 text-center">ロード中...</p>
          ) : (
            <div className="space-y-2">
              {topScores.map((topScore, index) => (
                <div
                  key={topScore.id}
                  className="flex justify-between text-white bg-gray-700 p-2 rounded"
                >
                  <span>
                    {index + 1}. {topScore.playerName}
                  </span>
                  <span>{topScore.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="ユーザー名を入力"
            className="border-2 border-purple-500 bg-gray-700 text-white p-3 mb-6 w-full rounded focus:outline-none focus:border-purple-400 placeholder-gray-400"
            maxLength={20}
            required
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition-colors duration-200 w-full font-bold text-lg"
          >
            スコアを保存
          </button>
        </form>
      </div>
    </div>
  );
};

export default GameOverModal;
