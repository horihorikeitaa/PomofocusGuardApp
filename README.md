# ポモフォーカスガードアプリ

ポモドーロテクニックを活用した集中力向上アプリ。特に休憩時間の管理とスマートフォン依存対策に特化。

## 主な機能

- **ポモドーロタイマー**: 25分作業、5分休憩の自動切り替え
- **アプリ・サイト制限**: 休憩時間中の特定アプリ・サイトへのアクセス制限
- **姿勢検知**: センサーを活用した休憩中の姿勢管理

## プロジェクト構成

```
PomofocusGuardApp/
├── docs/                    # プロジェクトドキュメント
│   ├── requirements.md      # 要件定義書
│   ├── architecture.md      # アーキテクチャ設計書
│   └── tdd-approach.md      # TDDアプローチ
├── src/                     # ソースコード（今後実装）
├── .cursor/                 # Cursorルール
└── README.md                # プロジェクト概要
```

## 技術スタック

- React Native
- TypeScript
- Recoil (状態管理)
- React Query (データフェッチング)
- React Native Background Timer
- Jest & React Testing Library (テスト)
- その他必要なライブラリは今後追加

## アーキテクチャ

このプロジェクトは「機能ベースのクリーンアーキテクチャ + Reactiveパターン」を採用しています。詳細は [アーキテクチャ設計書](docs/architecture.md) を参照してください。

主な特徴:
- 機能（Feature）ベースのディレクトリ構造
- クリーンアーキテクチャの原則の適用
- リアクティブな状態管理 (Recoil)
- カスタムフックによるViewModel実装

## 開発アプローチ

このプロジェクトは**テスト駆動開発（TDD）**アプローチを採用しています。詳細は [TDDアプローチ](docs/tdd-approach.md) を参照してください。

主な特徴:
- Red-Green-Refactorサイクルによる開発
- ドメインロジックは90%以上のテストカバレッジ
- インターフェースを介した外部依存のモック化
- テストファーストの開発スタイル

## インストール方法

```bash
# 依存関係のインストール
npm install

# アプリの起動
npm start
```

## 開発ステータス

現在は要件定義とアーキテクチャ設計フェーズです。

## ドキュメント

詳細なドキュメントは `docs/` ディレクトリに格納されています：

- [要件定義書](docs/requirements.md) - 機能要件と実装検討
- [アーキテクチャ設計書](docs/architecture.md) - プロジェクトの設計方針
- [TDDアプローチ](docs/tdd-approach.md) - テスト駆動開発の方針 