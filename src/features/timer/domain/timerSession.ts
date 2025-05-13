import { SessionStatus, SessionType, DEFAULT_SESSION_TIMES } from '../../../core/entities/SessionType';

/**
 * タイマーセッションのドメインモデル
 */
export class TimerSession {
    /** 現在のセッションタイプ（作業/短い休憩/長い休憩） */
    private _currentType: SessionType = SessionType.WORK;
    /** 残り時間（秒） */
    private _remainingTime: number = DEFAULT_SESSION_TIMES[SessionType.WORK];
    /** 実行状態 */
    private _status: SessionStatus = SessionStatus.IDLE;
    /** 完了した作業セッション数 */
    private _completedWorkSessions: number = 0;
    /** 長い休憩までに必要な作業セッション数 */
    private _sessionsUntilLongBreak: number = 4;

    /**
     * タイマーを開始する
     */
    start(): void {
        this._status = SessionStatus.RUNNING;
    }

    /**
     * タイマーを一時停止する
     */
    pause(): void {
        if (this._status === SessionStatus.RUNNING) {
            this._status = SessionStatus.PAUSED;
        }
    }

    /**
     * タイマーをリセットする
     */
    reset(): void {
        this._status = SessionStatus.IDLE;
        this._remainingTime = DEFAULT_SESSION_TIMES[this._currentType];
    }

    /**
     * 時間を進める
     * @param seconds 進める秒数
     */
    tick(seconds: number): void {
        if (this._status !== SessionStatus.RUNNING) {
            return;
        }

        this._remainingTime -= seconds;

        if (this._remainingTime <= 0) {
            this._completeCurrentSession();
        }
    }

    /**
     * 現在のセッションを完了し、次のセッションに移行する
     */
    private _completeCurrentSession(): void {
        if (this._currentType === SessionType.WORK) {
            this._completedWorkSessions++;

            if (this._completedWorkSessions % this._sessionsUntilLongBreak === 0) {
                this._switchToSession(SessionType.LONG_BREAK);
            } else {
                this._switchToSession(SessionType.SHORT_BREAK);
            }
        } else {
            this._switchToSession(SessionType.WORK);
        }

        this._status = SessionStatus.COMPLETED;
    }

    /**
     * 指定したタイプのセッションに切り替える
     * @param type セッションタイプ
     */
    private _switchToSession(type: SessionType): void {
        this._currentType = type;
        this._remainingTime = DEFAULT_SESSION_TIMES[type];
    }

    /**
     * 現在のセッションタイプを取得
     */
    get currentType(): SessionType {
        return this._currentType;
    }

    /**
     * 残り時間を取得
     */
    get remainingTime(): number {
        return this._remainingTime;
    }

    /**
     * 実行状態を取得
     */
    get status(): SessionStatus {
        return this._status;
    }

    /**
     * 完了した作業セッション数を取得
     */
    get completedWorkSessions(): number {
        return this._completedWorkSessions;
    }

    /**
     * 長い休憩までに必要な作業セッション数を設定
     */
    set sessionsUntilLongBreak(value: number) {
        if (value > 0) {
            this._sessionsUntilLongBreak = value;
        }
    }
} 