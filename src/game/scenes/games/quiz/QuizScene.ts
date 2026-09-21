import * as Phaser from 'phaser';
import { UIButton } from '../../../ui/UIButton';
import { UIColors } from '../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
    HSKVocabulary,
} from '../../../../services/HSKDataService';
import { QuizScoreService } from '../../../../services/QuizScoreService';

interface QuizQuestion {
    word: HSKVocabulary;
    options: string[];
    correctIndex: number;
}

export default class QuizScene extends Phaser.Scene {

    private level!: HSKLevel;
    private questionCount: number = 10;

    private questions: QuizQuestion[] = [];
    private currentQuestionIndex: number = 0;

    private score: number = 0;
    private correctCount: number = 0;
    private highScore: number = 0;

    private answered: boolean = false;

    private questionNumberText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;
    private wordText!: Phaser.GameObjects.Text;
    private instructionText!: Phaser.GameObjects.Text;
    private feedbackText!: Phaser.GameObjects.Text;

    private optionButtons: UIButton[] = [];
    private nextButton?: UIButton;

    constructor() {
        super('QuizScene');
    }

    init(data: {
        level: HSKLevel;
        questionCount: number;
    }): void {

        this.level = data.level;
        this.questionCount = data.questionCount;
    }

    create(): void {

        const height = this.scale.height;

        fadeInScene(this);

        this.createBackground();
        this.createHeader();
        this.createQuiz();

        // =====================================================
        // BACK
        // =====================================================

        new UIButton(
            this,
            90,
            height - 48,
            'BACK',
            () => {
                goToScene(this, 'HSKQuizMenu', {
                    level: this.level,
                    questionCount: this.questionCount,
                });
            },
            {
                width: 130,
                height: 44,
                color: UIColors.card,
                darkColor: UIColors.cardBorder,
                textColor: UIColors.text,
                fontSize: 15,
            }
        );
    }

    // =========================================================
    // BACKGROUND
    // =========================================================

    private createBackground(): void {

        const width = this.scale.width;
        const height = this.scale.height;

        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            UIColors.background
        );

        this.add.circle(
            80,
            120,
            150,
            UIColors.secondary,
            0.06
        );

        this.add.circle(
            width - 80,
            height - 80,
            180,
            UIColors.yellow,
            0.08
        );
    }

    // =========================================================
    // HEADER
    // =========================================================

    private createHeader(): void {

        const width = this.scale.width;

        this.questionNumberText = this.add.text(
            60,
            40,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#667085',
            }
        );

        this.scoreText = this.add.text(
            width - 60,
            40,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(1, 0);
    }

    // =========================================================
    // QUIZ
    // =========================================================

    private createQuiz(): void {

        const words = HSKDataService.getRandomWords(
            this.level,
            this.questionCount
        );

        this.questions = words.map(word =>
            this.createQuestion(word)
        );

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctCount = 0;

        this.highScore = QuizScoreService.getHighScore(
            this.level,
            this.questionCount
        );

        this.showQuestion();
    }

    // =========================================================
    // CREATE QUESTION
    // =========================================================

    private createQuestion(
        word: HSKVocabulary
    ): QuizQuestion {

        const allWords = HSKDataService.getVocabulary(
            this.level
        );

        const candidates = allWords
            .filter(item => item.word !== word.word)
            .map(item => item.pinyin)
            .filter(Boolean);

        const uniqueCandidates = [
            ...new Set(candidates),
        ];

        Phaser.Utils.Array.Shuffle(uniqueCandidates);

        const wrongOptions = uniqueCandidates.slice(0, 3);

        const options = [
            word.pinyin,
            ...wrongOptions,
        ];

        Phaser.Utils.Array.Shuffle(options);

        return {
            word,
            options,
            correctIndex: options.indexOf(
                word.pinyin
            ),
        };
    }

    // =========================================================
    // SHOW QUESTION
    // =========================================================

    private showQuestion(): void {

        this.answered = false;

        this.clearQuestionUI();

        const question = this.questions[
            this.currentQuestionIndex
        ];

        this.questionNumberText.setText(
            `Question ${this.currentQuestionIndex + 1} / ${this.questions.length}`
        );

        this.scoreText.setText(
            `Score: ${this.score}`
        );

        this.add.text(
            this.scale.width / 2,
            125,
            'What is the correct pronunciation?',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        this.wordText = this.add.text(
            this.scale.width / 2,
            220,
            question.word.word,
            {
                fontFamily: 'Arial',
                fontSize: '72px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.instructionText = this.add.text(
            this.scale.width / 2,
            285,
            'Choose the correct pinyin',
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        this.createOptions(question);
    }

    // =========================================================
    // OPTIONS
    // =========================================================

    private createOptions(
        question: QuizQuestion
    ): void {

        const width = this.scale.width;

        const positions: [number, number][] = [
            [width / 2 - 210, 375],
            [width / 2 + 210, 375],

            [width / 2 - 210, 485],
            [width / 2 + 210, 485],
        ];

        question.options.forEach((option, index) => {

            const [x, y] = positions[index];

            const button = new UIButton(
                this,
                x,
                y,
                option,
                () => {
                    this.selectAnswer(index);
                },
                {
                    width: 360,
                    height: 80,
                    color: UIColors.card,
                    darkColor: UIColors.cardBorder,
                    textColor: UIColors.text,
                    fontSize: 22,
                }
            );

            this.optionButtons.push(button);
        });
    }

    // =========================================================
    // ANSWER
    // =========================================================

    private selectAnswer(index: number): void {

        if (this.answered) {
            return;
        }

        this.answered = true;

        const question = this.questions[
            this.currentQuestionIndex
        ];

        const isCorrect =
            index === question.correctIndex;

        if (isCorrect) {

            this.score += 100;
            this.correctCount++;

            this.showFeedback(
                true,
                'Correct! +100'
            );

        } else {

            this.showFeedback(
                false,
                `Incorrect — ${question.word.pinyin}`
            );
        }

        this.scoreText.setText(
            `Score: ${this.score}`
        );

        // NEXT / FINISH only appears
        // after the user has selected an answer.
        this.createNextButton();
    }

    // =========================================================
    // FEEDBACK
    // =========================================================

    private showFeedback(
        correct: boolean,
        message: string
    ): void {

        if (this.feedbackText) {
            this.feedbackText.destroy();
        }

        this.feedbackText = this.add.text(
            this.scale.width / 2,
            575,
            message,
            {
                fontFamily: 'Arial',
                fontSize: '22px',
                fontStyle: 'bold',
                color: correct
                    ? '#4E9F3D'
                    : '#E85D5D',
            }
        ).setOrigin(0.5);
    }

    // =========================================================
    // NEXT / FINISH
    // =========================================================

    private createNextButton(): void {

        if (this.nextButton) {
            this.nextButton.destroy();
            this.nextButton = undefined;
        }

        const isLastQuestion =
            this.currentQuestionIndex
            === this.questions.length - 1;

        this.nextButton = new UIButton(
            this,
            this.scale.width / 2,
            665,
            isLastQuestion
                ? 'FINISH'
                : 'NEXT',
            () => {
                this.nextQuestion();
            },
            {
                width: 180,
                height: 50,
                color: UIColors.primary,
                darkColor: UIColors.primaryDark,
                textColor: UIColors.white,
                fontSize: 18,
            }
        );
    }

    private nextQuestion(): void {

        this.currentQuestionIndex++;

        if (
            this.currentQuestionIndex >=
            this.questions.length
        ) {
            this.finishQuiz();
            return;
        }

        this.showQuestion();
    }

    // =========================================================
    // FINISH
    // =========================================================

    private finishQuiz(): void {

        const result = QuizScoreService.saveScore(
            this.level,
            this.questionCount,
            this.score,
            this.correctCount,
            this.questions.length
        );

        this.highScore = result.highScore;

        this.clearQuestionUI();

        // =====================================================
        // TITLE
        // =====================================================

        this.add.text(
            this.scale.width / 2,
            170,
            result.isNewHighScore
                ? 'NEW HIGH SCORE!'
                : 'QUIZ COMPLETE!',
            {
                fontFamily: 'Arial',
                fontSize: '42px',
                fontStyle: 'bold',
                color: result.isNewHighScore
                    ? '#F28C28'
                    : '#263238',
            }
        ).setOrigin(0.5);

        // =====================================================
        // CONGRATULATIONS
        // =====================================================

        if (result.isNewHighScore) {

            this.add.text(
                this.scale.width / 2,
                225,
                'Congratulations! You beat your best score.',
                {
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    color: '#667085',
                }
            ).setOrigin(0.5);
        }

        // =====================================================
        // CORRECT ANSWERS
        // =====================================================

        this.add.text(
            this.scale.width / 2,
            result.isNewHighScore
                ? 290
                : 245,
            `${this.correctCount} / ${this.questions.length} correct`,
            {
                fontFamily: 'Arial',
                fontSize: '26px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        // =====================================================
        // YOUR SCORE
        // =====================================================

        this.add.text(
            this.scale.width / 2,
            result.isNewHighScore
                ? 345
                : 300,
            `Your Score: ${this.score}`,
            {
                fontFamily: 'Arial',
                fontSize: '30px',
                fontStyle: 'bold',
                color: '#4E9F3D',
            }
        ).setOrigin(0.5);

        // =====================================================
        // HIGH SCORE
        // =====================================================

        this.add.text(
            this.scale.width / 2,
            result.isNewHighScore
                ? 395
                : 350,
            `High Score: ${this.highScore}`,
            {
                fontFamily: 'Arial',
                fontSize: '22px',
                fontStyle: 'bold',
                color: '#F28C28',
            }
        ).setOrigin(0.5);

        // =====================================================
        // PLAY AGAIN
        // =====================================================

        new UIButton(
            this,
            this.scale.width / 2,
            480,
            'PLAY AGAIN',
            () => {
                this.scene.restart({
                    level: this.level,
                    questionCount: this.questionCount,
                });
            },
            {
                width: 220,
                height: 55,
                color: UIColors.primary,
                darkColor: UIColors.primaryDark,
                textColor: UIColors.white,
                fontSize: 18,
            }
        );
    }

    // =========================================================
    // CLEAR QUESTION UI
    // =========================================================

    private clearQuestionUI(): void {

        // Remove NEXT / FINISH
        if (this.nextButton) {
            this.nextButton.destroy();
            this.nextButton = undefined;
        }

        // Remove answer buttons
        this.optionButtons.forEach(button => {
            button.destroy();
        });

        this.optionButtons = [];

        // Remove question text
        if (this.wordText) {
            this.wordText.destroy();
        }

        if (this.instructionText) {
            this.instructionText.destroy();
        }

        if (this.feedbackText) {
            this.feedbackText.destroy();
        }

        // Remove temporary texts created in showQuestion()
        // while preserving the permanent header texts.
        const texts = this.children.list.filter(
            child =>
                child instanceof Phaser.GameObjects.Text &&
                child !== this.questionNumberText &&
                child !== this.scoreText
        );

        texts.forEach(child => {
            child.destroy();
        });
    }
}
