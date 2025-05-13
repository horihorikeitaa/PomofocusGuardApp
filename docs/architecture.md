# ポモフォーカスガードアプリ 改訂アーキテクチャ設計書

## 1. アーキテクチャ概要

「ポモフォーカスガード」アプリは、「**機能ベースのクリーンアーキテクチャ + Reactiveパターン**」を採用します。このアーキテクチャは以下の特徴を持ちます：

- **機能（Feature）ベースのディレクトリ構造**: 技術的な関心事よりも機能で分割
- **クリーンアーキテクチャの原則**: 依存性の方向を内側に向け、ドメインロジックを独立させる
- **リアクティブな状態管理**: Reactive Programming パターンの採用
- **プレゼンテーションとビジネスロジックの分離**: カスタムフックによるViewModelパターン実装

## 2. 技術スタック

### 2.1 基盤技術
- **React Native**: クロスプラットフォーム開発
- **TypeScript**: 型安全性の確保

### 2.2 状態管理
- **Recoil**: アトミックで柔軟な状態管理（React公式チームのプロジェクト）
- **AsyncStorage**: 永続化データ保存

### 2.3 依存性注入
- **React Context API**: サービスやリポジトリの注入

### 2.4 エフェクトと非同期処理
- **React Query**: データフェッチングとキャッシュ
- **React Native Background Timer**: バックグラウンド処理

### 2.5 テスト
- **Jest**: ユニットテスト
- **React Native Testing Library**: コンポーネントテスト
- **Detox**: E2Eテスト

## 3. ディレクトリ構造

```
src/
├── core/                  # コアドメインロジック
│   ├── entities/          # ドメインエンティティ
│   └── interfaces/        # リポジトリやサービスのインターフェース
│
├── features/              # 機能モジュール
│   ├── timer/             # タイマー機能
│   │   ├── domain/        # タイマードメインロジック
│   │   ├── data/          # データ層（リポジトリ実装）
│   │   ├── hooks/         # ビジネスロジック（ViewModel的役割）
│   │   ├── components/    # UIコンポーネント
│   │   └── screens/       # 画面
│   │
│   ├── restrictions/      # アプリ・サイト制限機能
│   │   ├── domain/        # 制限機能ドメインロジック
│   │   ├── data/          # データ層
│   │   ├── hooks/         # ビジネスロジック
│   │   ├── components/    # UIコンポーネント
│   │   └── native/        # ネイティブモジュール連携
│   │
│   └── posture/           # 姿勢検知機能
│       ├── domain/        # 姿勢検知ドメインロジック
│       ├── data/          # データ層
│       ├── hooks/         # ビジネスロジック
│       ├── components/    # UIコンポーネント
│       └── sensors/       # センサー連携
│
├── shared/                # 共有コンポーネントとユーティリティ
│   ├── components/        # 共通UIコンポーネント
│   ├── hooks/             # 共通カスタムフック
│   ├── utils/             # ユーティリティ関数
│   ├── constants/         # 定数定義
│   └── theme/             # テーマ定義
│
├── services/              # アプリ全体のサービス
│   ├── navigation/        # ナビゲーション
│   ├── storage/           # ストレージサービス
│   └── notification/      # 通知サービス
│
├── di/                    # 依存性注入設定
│   └── container.tsx      # サービスプロバイダー
│
├── App.tsx                # アプリのルートコンポーネント
└── index.js               # エントリーポイント
```

## 4. レイヤー設計

各機能は以下の4つのレイヤーで構成されます：

### 4.1 ドメインレイヤー (Domain)
- エンティティとビジネスルール
- ユースケース（インタラクター）
- リポジトリとサービスのインターフェース
- 外部依存のない純粋なビジネスロジック

### 4.2 データレイヤー (Data)
- リポジトリ実装
- 外部APIとの連携
- データマッピング
- 永続化

### 4.3 プレゼンテーションレイヤー (Presentation)
- カスタムフック（ViewModel的役割）
- UIへのデータ提供と状態管理
- ユーザーアクションのハンドリング

### 4.4 UIレイヤー (UI)
- Reactコンポーネント
- 画面レイアウト
- スタイリング
- ユーザー入力

## 5. 状態管理設計

### 5.1 Recoilによる状態管理
- **Atom**: 最小単位の状態
- **Selector**: 派生状態と計算
- **状態の永続化**: Recoilのエフェクトを使用してAsyncStorageと連携

### 5.2 状態設計の例
```typescript
// タイマー状態のアトム
export const timerStateAtom = atom<TimerState>({
  key: 'timerState',
  default: {
    status: 'idle',
    currentSession: 'work',
    remainingTime: DEFAULT_WORK_TIME,
    completedCycles: 0
  }
});

// 現在のセッションタイプに基づくタイマー表示セレクタ
export const timerDisplaySelector = selector<TimerDisplay>({
  key: 'timerDisplay',
  get: ({get}) => {
    const timerState = get(timerStateAtom);
    // ビジネスロジックに基づく表示データの計算
    return {
      formattedTime: formatTime(timerState.remainingTime),
      sessionLabel: getSessionLabel(timerState.currentSession),
      progress: calculateProgress(timerState)
    };
  }
});
```

## 6. 機能モジュール詳細設計

### 6.1 タイマーモジュール

#### 6.1.1 ドメインモデル
- **Session**: 作業/休憩セッションを表すエンティティ
- **Timer**: タイマーの状態と動作を表すエンティティ
- **SessionHistory**: 完了したセッションの履歴

#### 6.1.2 ユースケース
- タイマーの開始/一時停止/リセット
- セッションの自動切り替え
- 統計データの記録

#### 6.1.3 カスタムフック
```typescript
export function useTimer() {
  // Recoilの状態を使用
  const [timerState, setTimerState] = useRecoilState(timerStateAtom);
  
  // タイマー操作メソッド
  const startTimer = useCallback(() => {
    // タイマー開始ロジック
  }, []);
  
  const pauseTimer = useCallback(() => {
    // タイマー一時停止ロジック
  }, []);
  
  // 他のメソッドとデータ
  
  return {
    timerState,
    startTimer,
    pauseTimer,
    // 他の公開APIと状態
  };
}
```

### 6.2 アプリ・サイト制限モジュール

#### 6.2.1 ドメインモデル
- **RestrictedApp**: 制限対象アプリ情報
- **RestrictedSite**: 制限対象Webサイト情報
- **RestrictionRule**: 制限ルール（時間帯など）

#### 6.2.2 プラットフォーム間の抽象化
```typescript
// インターフェース定義
export interface AppRestrictionService {
  isRestricted(appPackage: string): boolean;
  blockApp(appPackage: string): Promise<boolean>;
  getInstalledApps(): Promise<AppInfo[]>;
}

// プラットフォーム固有の実装
export class AndroidAppRestrictionService implements AppRestrictionService {
  // Androidでの実装（AccessibilityService使用）
}

export class IOSAppRestrictionService implements AppRestrictionService {
  // iOSでの実装（ScreenTime API使用）
}

// ファクトリー関数
export function createAppRestrictionService(): AppRestrictionService {
  if (Platform.OS === 'android') {
    return new AndroidAppRestrictionService();
  } else {
    return new IOSAppRestrictionService();
  }
}
```

### 6.3 姿勢検知モジュール

#### 6.3.1 センサーデータ処理
- 加速度センサーとジャイロセンサーのデータ収集
- 姿勢判定アルゴリズム
- バッテリー最適化戦略

#### 6.3.2 リアクティブな実装
```typescript
export function usePostureDetection() {
  // 姿勢状態
  const [postureState, setPostureState] = useRecoilState(postureStateAtom);
  
  // センサー監視開始
  const startMonitoring = useCallback(() => {
    // バックグラウンドでのセンサー監視
    return SensorService.startMonitoring({
      onPostureChange: (newPosture) => {
        setPostureState(prev => ({
          ...prev,
          currentPosture: newPosture
        }));
        
        // 横臥姿勢検知時の処理
        if (newPosture === 'lying') {
          NotificationService.showAlert('姿勢が不適切です');
        }
      }
    });
  }, []);
  
  // 他のメソッドとデータ
  
  return {
    postureState,
    startMonitoring,
    stopMonitoring,
    calibrateSensors,
    // 他の公開API
  };
}
```

## 7. データフロー

### 7.1 単方向データフロー
1. ユーザーがUIで操作を行う
2. UIコンポーネントはカスタムフックのメソッドを呼び出す
3. カスタムフックはドメインロジックに基づいて状態更新を実行
4. 更新された状態がRecoilを通じてUIに反映される

### 7.2 クロスモジュール通信
```typescript
// タイマーセッション変更時にアプリ制限を更新
export function useTimerWithRestrictions() {
  const { timerState, ...timerActions } = useTimer();
  const { updateRestrictions } = useAppRestrictions();
  
  // タイマー状態変更監視
  useEffect(() => {
    // セッションタイプが変わった場合
    if (timerState.currentSession === 'break') {
      // 休憩モードのアプリ制限を適用
      updateRestrictions('break');
    } else {
      // 作業モードのアプリ制限を適用
      updateRestrictions('work');
    }
  }, [timerState.currentSession]);
  
  return {
    timerState,
    ...timerActions
  };
}
```

## 8. テスト戦略

### 8.1 ユニットテスト
- ドメインエンティティとユースケースのテスト
- リポジトリとサービスのテスト
- カスタムフックのテスト

### 8.2 UI/コンポーネントテスト
- 主要コンポーネントの表示と動作のテスト
- ユーザーインタラクションのテスト

### 8.3 統合/E2Eテスト
- 主要ユースケースのフロー検証
- プラットフォーム固有機能のテスト

## 9. 拡張性と保守性

### 9.1 新機能追加手順
1. 新しい機能ディレクトリを作成
2. ドメインモデルとユースケースを定義
3. データ層の実装
4. カスタムフックの作成
5. UIコンポーネントの実装

### 9.2 依存性逆転の原則の適用
外部依存（センサー、ストレージなど）はインターフェースを通じて抽象化し、具体的な実装は外側のレイヤーで提供します。

## 10. パフォーマンス最適化

### 10.1 メモ化戦略
- `useMemo`と`useCallback`の適切な使用
- Recoilセレクタによる派生状態の最適化
- 重いコンポーネントのメモ化（`React.memo`）

### 10.2 バックグラウンド処理
- バックグラウンドタスクのスロットリングとバッチ処理
- ネイティブモジュールの効率的な使用

## 11. 将来の拡張性

このアーキテクチャは以下の拡張に対応できるよう設計されています：

- 新しい機能モジュールの追加（他の生産性機能など）
- 複数デバイス間の同期（後日実装）
- 詳細な統計と分析機能
- アクセシビリティ機能の拡張

## 12. まとめ

この改訂アーキテクチャは、React Nativeのモダンなベストプラクティスに基づいており、以下の利点があります：

- **関心の分離**: 機能ごとの明確な分離
- **テスト容易性**: 各レイヤーの独立したテスト
- **拡張性**: 新機能の容易な追加
- **保守性**: クリーンなコード構造による長期的な保守性
- **プラットフォーム抽象化**: ネイティブ機能の効果的な抽象化

このアーキテクチャを採用することで、MVPから始め、段階的に機能を追加しながらも、将来的な拡張に対応できる柔軟な設計を実現します。 