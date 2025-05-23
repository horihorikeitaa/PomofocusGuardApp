# ポモフォーカスガードアプリ 要件定義書

## 1. プロジェクト概要

「ポモフォーカスガード」は、ポモドーロテクニックを活用した集中力向上アプリで、特に休憩時間の管理とスマートフォン依存対策に特化します。個人利用を目的とした無料アプリとして開発します。

## 2. ターゲットユーザー

- 25歳前後の社会人（開発者自身）
- 資格試験や開発スキルの自己学習に取り組む人
- 集中力の持続に課題を感じている人
- スマートフォン依存傾向がある人

## 3. 解決する課題

- 学習時の集中力維持の困難さ
- スマートフォンへの過度な依存
- 休憩時間の管理不足（特に延長してしまう問題）
- 休憩中の不適切な姿勢（寝転がるなど）による集中モードへの復帰困難

## 4. 機能要件詳細

### 4.1 ポモドーロタイマー機能（MVP）

#### 4.1.1 基本タイマー
- 作業時間（デフォルト25分）のカウントダウン
- 短い休憩（デフォルト5分）のカウントダウン
- 長い休憩（デフォルト15分）のカウントダウン
- 4サイクル後の長い休憩自動切り替え

#### 4.1.2 タイマー制御
- 開始/一時停止/リセット機能
- セッション切り替え時の通知
- シンプルな統計表示（当日の集中時間・セッション数）

### 4.2 アプリ・サイト制限機能（核心機能）

#### 4.2.1 アプリ制限
- 休憩時間中に特定アプリへのアクセスを制限
  - 特に注目：Instagram、YouTube
  - 制限対象アプリのリスト管理
  - アプリの起動試行時のブロック

#### 4.2.2 Webサイト制限
- 特定Webサイトへのアクセスを制限
  - 制限対象サイトのURL管理
  - ブラウザでの対象サイト閲覧時のブロック

### 4.3 姿勢制御機能

#### 4.3.1 センサーベース姿勢検知
- スマートフォンの加速度センサー/ジャイロセンサーを活用
- 横臥姿勢（寝転がった状態）の検知
- 不適切な姿勢を検知した際のアラート
- 休憩終了前の姿勢矯正リマインダー

## 5. 技術的実装検討

### 5.1 アプリ・サイト制限についての実装オプション

#### オプション1: AccessibilityService（Android）
- Androidの場合、AccessibilityServiceを利用して他アプリの起動を検知・制御
- 起動時にブロック画面を表示し、元のアプリに戻す処理

#### オプション2: カスタムランチャー（Android）
- アプリ自体をランチャーとして実装
- 制限時間中は特定アプリのアイコンを非表示/無効化

#### オプション3: VPNサービス（Android/iOS）
- ローカルVPNサービスを実装
- 制限対象サイト/アプリへのネットワーク通信をブロック

#### オプション4: アプリ内ブラウザ
- アプリ内にWebブラウザを実装
- 制限対象サイトへのアクセスをブロック
- メインブラウザの利用を抑制する工夫が必要

### 5.2 姿勢制御機能の実装

- ジャイロセンサー/加速度センサーデータの取得
- 端末の傾きからユーザーの姿勢を推定するアルゴリズム
- バックグラウンド実行時のバッテリー消費最適化
- 定期的なサンプリングによる電力消費の削減

## 6. プラットフォーム特有の制約と対応

### 6.1 Android

- AccessibilityServiceやDevice Admin権限の使用でより強力な制限が可能
- バックグラウンド実行制限を回避するための対策が必要
- 電力最適化ホワイトリスト登録の案内実装

### 6.2 iOS

- アプリ間の制限はスクリーンタイム API で部分的実装の可能性あり
- サイト制限はコンテンツブロッカー経由での実装検討
- サードパーティアプリの完全制御は制限あり

## 7. 開発コスト最小化の方針

- React Nativeによるクロスプラットフォーム開発
- オープンソースライブラリの積極活用
- 無料のバックエンドサービス活用（Firebase等）
- シンプルなUIデザインによる開発工数削減
- MVPアプローチでコア機能から段階的に開発

## 8. 実装上の注意点

1. **アプリ制限機能**
   - OSの制約により完全なブロックは難しい場合がある
   - 特にiOSではアプリ間の制御に強い制約あり
   - フィードバックを含む効果的な抑止UI設計が重要

2. **姿勢検知機能**
   - センサーのキャリブレーション機能が必要
   - バッテリー消費とのバランスが課題
   - 精度向上のための機械学習モデル検討（TensorFlow Lite等）

3. **バックグラウンド実行**
   - 最新のOSではバックグラウンド制限が厳しい
   - フォアグラウンドサービス使用の検討
   - 効果的な通知設計

## 9. MVP開発計画

1. 基本的なポモドーロタイマーの実装
2. アプリ制限機能のプロトタイプ開発（Android優先）
3. Webサイト制限機能の追加
4. 姿勢制御機能の実装
5. UI/UX改善とバグ修正

これらの機能を段階的に実装することで、コアとなるポモドーロタイマーとアプリ制限機能を優先的に利用可能にします。技術的な制約により実装が難しい部分については、代替アプローチを検討しながら進めていきます。 