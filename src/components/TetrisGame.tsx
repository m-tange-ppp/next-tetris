"use client";

import { useState } from "react";
import GameBoard from "./GameBoard";
import ShowNextTetromino from "./ShowNextTetromino";
import ScoreBoard from "./ScoreBoard";
import ShowHeldTetromino from "./ShowHeldTetromino";
import LevelBoard from "./LevelBoard";
import { saveScore } from "@/actions/scoreActions";
import GameOverModal from "./GameOverModal";

const TetrisGame: React.FC = () => {
  // ゲームリセット用のキー
  const [key, setKey] = useState<number>(0);
  const [typesArray, setTypesArray] = useState<string[] | null>(null);
  const [heldTetrominoType, setHeldTetrominoType] = useState<string | null>(
    null
  );
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);

  const resetGame = (): void => {
    setKey((prev) => prev + 1);
    setScore(0);
    setLevel(1);
    setHeldTetrominoType(null);
  };

  const handleGameOver = () => {
    setShowGameOver(true);
  };

  const handleScoreSubmit = async (playerName: string) => {
    try {
      await saveScore(playerName, score);
      setShowGameOver(false);
      resetGame();
    } catch (error) {
      console.error("スコア保存中にエラーが発生:", error);
    }
  };

  return (
    <div>
      <div className="flex gap-4 justify-center">
        <div className="flex flex-col justify-between">
          <ShowHeldTetromino heldTetrominoType={heldTetrominoType} />
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
          key={key}
          onGameOver={handleGameOver}
        />
        <div>
          <ShowNextTetromino typesArray={typesArray} typesArrayIndex={1} />
          <ShowNextTetromino typesArray={typesArray} typesArrayIndex={2} />
        </div>
      </div>
      <p className="flex justify-center">
        ←↓→：移動　↑：落下　zx：回転　c：ホールド
      </p>
      {showGameOver && (
        <GameOverModal score={score} onSubmit={handleScoreSubmit} />
      )}
    </div>
  );
};

export default TetrisGame;
