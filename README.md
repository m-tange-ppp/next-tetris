# Next Tetris

Next.js 14 と Firebase で作成したテトリスゲームです。

## 機能

### ゲームプレイ

- 標準的なテトリスのルールに従ったゲームプレイ
- レベルシステム（ライン消去でレベルアップ）
- ホールド機能
- 次のテトロミノ表示（2 つ先まで）
- ハードドロップ機能
- ゴーストピース表示

### スコアシステム

- 基本スコア
  - 1 ライン消去: 100 点
  - 2 ライン消去: 300 点
  - 3 ライン消去: 500 点
  - 4 ライン消去: 800 点
- ボーナススコア
  - パーフェクトクリア時: 追加ボーナス
  - コンボボーナス: 最大 20 コンボ（1000 点）まで

### オンライン機能

- スコアの保存と共有
- グローバルランキング
- プレイヤーの総数表示
- 現在のスコアの順位表示

## 操作方法

- ←→: 左右移動
- ↓: ソフトドロップ
- ↑: ハードドロップ
- Z: 左回転
- X: 右回転
- C: ホールド

## 技術スタック

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase (Firestore)
- Server Actions

## セキュリティ

- アプリケーションキーによる認証
- Server Actions を使用したセキュアなデータ処理

## 環境変数

必要な環境変数（.env.local）:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_SECRET_APP_KEY=
```

## インストールと実行

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番サーバーの起動
npm start
```

## 関連記事

詳細な実装解説は以下の記事をご覧ください：
https://qiita.com/m-tange-ppp/items/bd5f8c4723fe2013cbc8
