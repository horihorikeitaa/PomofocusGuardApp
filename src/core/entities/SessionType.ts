/**
 * ポモドーロセッションのタイプを表す列挙型
 */
export enum SessionType {
    /** 作業セッション */
    WORK = 'work',
    /** 短い休憩セッション */
    SHORT_BREAK = 'shortBreak',
    /** 長い休憩セッション */
    LONG_BREAK = 'longBreak',
}

/**
 * 各セッションタイプのデフォルト時間（秒）
 */
export const DEFAULT_SESSION_TIMES = {
    [SessionType.WORK]: 25 * 60, // 25分
    [SessionType.SHORT_BREAK]: 5 * 60, // 5分
    [SessionType.LONG_BREAK]: 15 * 60, // 15分
};

/**
 * セッションの実行状態を表す型
 */
export enum SessionStatus {
    /** 開始前/リセット状態 */
    IDLE = 'idle',
    /** 実行中 */
    RUNNING = 'running',
    /** 一時停止中 */
    PAUSED = 'paused',
    /** 完了 */
    COMPLETED = 'completed',
} 