import { HSKLevel } from './HSKDataService';

export type GameId =
    | 'quiz'
    | 'runner'
    | 'memory'
    | 'restaurant'
    | 'detective'
    | 'train'
    | 'market'
    | 'flashcard';

export interface GameScore {
    score: number;
    metadata?: Record<string, number>;
}

export interface GameScoreResult {
    score: number;
    highScore: number;
    isNewHighScore: boolean;
}

interface StoredGameScores {
    [key: string]: GameScore;
}

export class GameScoreService {

    private static readonly STORAGE_KEY =
        'hsk_panda_game_scores';

    // =========================================================
    // PUBLIC
    // =========================================================

    static getHighScore(
        gameId: GameId,
        level: HSKLevel,
        variant?: string
    ): number {

        const score =
            this.getScore(
                gameId,
                level,
                variant
            );

        return score?.score ?? 0;
    }

    static saveScore(
        gameId: GameId,
        level: HSKLevel,
        score: number,
        variant?: string,
        metadata?: Record<string, number>
    ): GameScoreResult {

        const currentHighScore =
            this.getHighScore(
                gameId,
                level,
                variant
            );

        const isNewHighScore =
            score > currentHighScore;

        if (isNewHighScore) {

            const scores =
                this.getScores();

            scores[
                this.createKey(
                    gameId,
                    level,
                    variant
                )
            ] = {
                score,
                metadata,
            };

            this.saveScores(scores);
        }

        return {
            score,
            highScore:
                isNewHighScore
                    ? score
                    : currentHighScore,
            isNewHighScore,
        };
    }

    // =========================================================
    // PRIVATE
    // =========================================================

    private static getScore(
        gameId: GameId,
        level: HSKLevel,
        variant?: string
    ): GameScore | null {

        const scores =
            this.getScores();

        return scores[
            this.createKey(
                gameId,
                level,
                variant
            )
        ] ?? null;
    }

    private static getScores():
        StoredGameScores {

        try {

            const raw =
                localStorage.getItem(
                    this.STORAGE_KEY
                );

            if (!raw) {
                return {};
            }

            const parsed =
                JSON.parse(raw);

            if (
                !parsed ||
                typeof parsed !== 'object' ||
                Array.isArray(parsed)
            ) {
                return {};
            }

            return parsed as StoredGameScores;

        } catch {

            return {};
        }
    }

    private static saveScores(
        scores: StoredGameScores
    ): void {

        try {

            localStorage.setItem(
                this.STORAGE_KEY,
                JSON.stringify(scores)
            );

        } catch {
            // Ignore storage errors.
        }
    }

    private static createKey(
        gameId: GameId,
        level: HSKLevel,
        variant?: string
    ): string {

        if (variant) {
            return `${gameId}_${level}_${variant}`;
        }

        return `${gameId}_${level}`;
    }
}