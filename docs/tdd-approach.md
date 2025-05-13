# テスト駆動開発（TDD）アプローチ

## TDDの概要

ポモフォーカスガードアプリは、テスト駆動開発（TDD）の手法を採用しています。TDDは以下のサイクルで開発を進めます：

1. **Red**: 失敗するテストを最初に書く
2. **Green**: テストが通るように必要最小限の実装をする
3. **Refactor**: コードをクリーンにリファクタリングする

このサイクルを繰り返すことで、品質の高いコードを段階的に構築していきます。

## TDDの対象範囲

TDDアプローチの適用範囲は以下のとおりです：

### 必須（90%以上のカバレッジ）
- ドメインエンティティ（`core/entities/*`, `features/*/domain/*`）
- ユースケース（ビジネスロジック）
- リポジトリインターフェース実装

### 推奨（70%以上のカバレッジ）
- カスタムフック（`features/*/hooks/*`）
- サービス実装（`services/*`）
- 重要なUIコンポーネント

### 任意
- 画面コンポーネント（`features/*/screens/*`）
- ユーティリティ関数

## テスト構造とツール

### ディレクトリ構造
```
__tests__/
├── core/
│   └── entities/
├── features/
│   ├── timer/
│   │   ├── domain/
│   │   ├── data/
│   │   └── hooks/
│   ├── restrictions/
│   └── posture/
└── services/
```

### 使用ツール
- **Jest**: テストランナーとアサーション
- **React Testing Library**: コンポーネントのテスト
- **@testing-library/react-hooks**: カスタムフックのテスト
- **jest-mock-extended**: モックの作成

## TDDプロセスの例

### 1. タイマードメインモデルのTDD

```typescript
// __tests__/features/timer/domain/timerSession.test.ts
describe('TimerSession', () => {
  it('初期化時に正しい状態になること', () => {
    const session = new TimerSession();
    expect(session.currentType).toBe(SessionType.WORK);
    expect(session.remainingTime).toBe(25 * 60);
    expect(session.isRunning).toBe(false);
  });
  
  // 他のテストケース...
});
```

### 2. カスタムフックのTDD

```typescript
// __tests__/features/timer/hooks/useTimer.test.ts
describe('useTimer', () => {
  it('初期状態が正しいこと', () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.status).toBe('idle');
    expect(result.current.currentSession).toBe('work');
  });
  
  it('startTimerを呼ぶとステータスがrunningになること', () => {
    const { result } = renderHook(() => useTimer());
    act(() => {
      result.current.startTimer();
    });
    expect(result.current.status).toBe('running');
  });
  
  // 他のテストケース...
});
```

### 3. ネイティブ機能のモック例

```typescript
// __tests__/features/posture/hooks/usePostureDetection.test.ts
jest.mock('../../../../src/features/posture/sensors/sensorService', () => ({
  startMonitoring: jest.fn((callbacks) => {
    // モックの実装
    return { stop: jest.fn() };
  }),
}));

describe('usePostureDetection', () => {
  // テストケース...
});
```

## 外部依存のテスト戦略

外部依存（センサー、ストレージ、ネイティブAPI）の取り扱い：

1. **インターフェースを定義**: `core/interfaces/*`にインターフェースを定義
2. **モックの作成**: テスト時には依存をモックに置き換え
3. **統合テスト**: 実際の実装とのE2Eテストは限定的に実施

## TDDのベストプラクティス

1. **小さなテストから始める**: シンプルなケースから始め、複雑なケースへ移行
2. **テストケースを網羅する**: 境界値、エラーケースも含め、様々なシナリオをテスト
3. **テストを読みやすく保つ**: テストがドキュメントとして機能するよう心がける
4. **テスト自体を過度に複雑にしない**: テストが複雑になるなら、実装自体の設計を見直す

## テスト自動化

CI/CDパイプラインでは以下のテスト自動化を実施：

1. プルリクエスト時にすべてのテストを実行
2. カバレッジレポートの生成
3. テスト結果に基づいたマージ可否の判断

## テストデータ管理

テストデータは以下の戦略で管理：

1. **テストフィクスチャー**: `__tests__/__fixtures__/`に共通のテストデータを配置
2. **ファクトリー関数**: 必要に応じてテストデータを生成するファクトリーを用意
3. **実際のAPIレスポンス**: 外部APIと連携する場合は実際のレスポンスを保存して利用 