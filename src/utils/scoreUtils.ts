import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface GameScore {
  username: string;
  score: number;
  timestamp: Date;
}

export const saveScore = async (playerName: string, score: number) => {
  // APIルートを使用してスコアを保存
  try {
    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score, playerName }),
    });

    if (!response.ok) {
      throw new Error("Failed to save score");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving score: ", error);
    throw error;
  }
};
