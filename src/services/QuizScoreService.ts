import { HSKLevel } from './HSKDataService';

export interface QuizScore {
    score: number;
    correctCount: number;
    totalQuestions: number;
}

export interface QuizScoreResult {
    score: number;
    highScore: number;
    isNewHighScore: boolean;
}

interface StoredQuizScores {
    [key: string]: QuizScore;
}

export class QuizScoreService {

    private static readonly STORAGE_KEY =
        'hsk_panda_quiz_scores';

    // =========================================================
    // PUBLIC
    // =========================================================

    static getHighScore(
        level: HSKLevel,
        questionCount: number
    ): number {

        const score = this.getScore(
            level,
            questionCount
        );

        return score?.score ?? 0;
    }

    static saveScore(
        level: HSKLevel,
        questionCount: number,
        score: number,
        correctCount: number,
        totalQuestions: number
    ): QuizScoreResult {

        const currentHighScore = this.getHighScore(
            level,
            questionCount
        );

        const isNewHighScore =
            score > currentHighScore;

        if (isNewHighScore) {

            const scores = this.getScores();

            scores[this.createKey(
                level,
                questionCount
            )] = {
                score,
                correctCount,
                totalQuestions,
            };

            this.saveScores(scores);
        }

        return {
            score,
            highScore: isNewHighScore
                ? score
                : currentHighScore,
            isNewHighScore,
        };
    }

    // =========================================================
    // PRIVATE
    // =========================================================

    private static getScore(
        level: HSKLevel,
        questionCount: number
    ): QuizScore | null {

        const scores = this.getScores();

        return scores[
            this.createKey(
                level,
                questionCount
            )
        ] ?? null;
    }

    private static getScores(): StoredQuizScores {

        try {

            const raw = localStorage.getItem(
                this.STORAGE_KEY
            );

            if (!raw) {
                return {};
            }

            const parsed = JSON.parse(raw);

            if (
                !parsed ||
                typeof parsed !== 'object' ||
                Array.isArray(parsed)
            ) {
                return {};
            }

            return parsed as StoredQuizScores;

        } catch {

            return {};
        }
    }

    private static saveScores(
        scores: StoredQuizScores
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
        level: HSKLevel,
        questionCount: number
    ): string {

        return `${level}_${questionCount}`;
    }
}