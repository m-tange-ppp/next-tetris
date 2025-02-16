"use server";

import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";

const validateAppKey = () => {
  const expectedKey = process.env.NEXT_PUBLIC_FIREBASE_SECRET_APP_KEY;

  if (expectedKey !== "ejf3erhg8se9rjgirsg") {
    throw new Error("無効なアプリケーションキーです");
  }
  return true;
};

// スコアデータの型定義を追加
interface ScoreData {
  id: string;
  playerName: string;
  score: number;
  createdAt: Date;
}

// トップスコアを取得する関数を修正
export async function getTopScores(
  limitCount: number = 5
): Promise<ScoreData[]> {
  try {
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, orderBy("score", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Timestamp型をDate型に変換
      const createdAt = (data.createdAt as Timestamp).toDate();

      return {
        id: doc.id,
        playerName: data.playerName,
        score: data.score,
        createdAt: createdAt,
      };
    });
  } catch (error) {
    console.error("Error fetching scores:", error);
    throw new Error("スコアの取得に失敗しました");
  }
}

// 総プレイヤー数を取得する関数を追加
export async function getTotalPlayers() {
  try {
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting total players:", error);
    throw new Error("プレイヤー数の取得に失敗しました");
  }
}

// 現在のスコアの順位を取得する関数
export async function getScoreRank(currentScore: number) {
  try {
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, orderBy("score", "desc"));
    const querySnapshot = await getDocs(q);

    const higherScores = querySnapshot.docs.filter(
      (doc) => doc.data().score > currentScore
    );

    return {
      rank: higherScores.length + 1,
      total: querySnapshot.size,
    };
  } catch (error) {
    console.error("Error getting rank:", error);
    throw new Error("順位の取得に失敗しました");
  }
}

// スコアを保存する関数
export async function saveScore(playerName: string, score: number) {
  try {
    validateAppKey();

    const scoresRef = collection(db, "scores");
    const scoreData = {
      playerName,
      score,
      createdAt: new Date(), // すでにDate型で保存
    };

    const docRef = await addDoc(scoresRef, scoreData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving score:", error);
    throw new Error("スコアの保存に失敗しました");
  }
}
