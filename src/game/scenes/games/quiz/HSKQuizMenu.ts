import * as Phaser from 'phaser';
import { UIButton } from '../../../ui/UIButton';
import { UIColors } from '../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
} from '../../../../services/HSKDataService';

export default class HSKQuizMenu extends Phaser.Scene {

    private readonly levels: HSKLevel[] = [
        'HSK1',
        'HSK2',
        'HSK3',
        'HSK4',
        'HSK5',
        'HSK6',
        'HSK7-9',
    ];

    private readonly questionCounts: number[] = [5, 10, 20];

    private selectedQuestionCount: number = 10;

    constructor() {
        super('HSKQuizMenu');
    }

    init(data?: {
        selectedQuestionCount?: number;
    }): void {

        if (data?.selectedQuestionCount) {
            this.selectedQuestionCount = data.selectedQuestionCount;
        }
    }

    create(): void {

        const width = this.scale.width;
        const height = this.scale.height;

        fadeInScene(this);

        this.createBackground();

        // =========================
        // TITLE
        // =========================

        this.add.text(
            width / 2,
            55,
            'HSK QUIZ BATTLE',
            {
                fontFamily: 'Arial',
                fontSize: '38px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            97,
            'Choose your challenge',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        // =========================
        // QUESTION COUNT
        // =========================

        this.add.text(
            width / 2,
            135,
            'NUMBER OF QUESTIONS',
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.createQuestionCountButtons();

        // =========================
        // HSK LEVELS
        // =========================

        const columnOffset = 222;

        const positions: [number, number][] = [
            [width / 2 - columnOffset, 290],
            [width / 2 + columnOffset, 290],

            [width / 2 - columnOffset, 405],
            [width / 2 + columnOffset, 405],

            [width / 2 - columnOffset, 520],
            [width / 2 + columnOffset, 520],

            [width / 2, 635],
        ];

        this.levels.forEach((level, index) => {

            const stats = HSKDataService.getStats(level);
            const [x, y] = positions[index];

            this.createLevelCard(
                x,
                y,
                level,
                stats.vocabulary
            );
        });

        // =========================
        // BACK
        // =========================

        new UIButton(
            this,
            90,
            height - 48,
            'BACK',
            () => {
                goToScene(this, 'GamesMenu');
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
    // QUESTION COUNT BUTTONS
    // =========================================================

    private createQuestionCountButtons(): void {

        const width = this.scale.width;

        const buttonWidth = 100;
        const buttonHeight = 44;
        const gap = 18;

        const positions = [
            width / 2 - buttonWidth - gap,
            width / 2,
            width / 2 + buttonWidth + gap,
        ];

        this.questionCounts.forEach((count, index) => {

            const x = positions[index];

            const selected = count === this.selectedQuestionCount;

            new UIButton(
                this,
                x,
                175,
                selected
                    ? `${count} ✓`
                    : `${count}`,
                () => {
                    this.selectedQuestionCount = count;

                    this.scene.restart({
                        selectedQuestionCount: this.selectedQuestionCount,
                    });
                },
                {
                    width: buttonWidth,
                    height: buttonHeight,

                    color: selected
                        ? UIColors.primary
                        : UIColors.card,

                    darkColor: selected
                        ? UIColors.primaryDark
                        : UIColors.cardBorder,

                    textColor: selected
                        ? UIColors.white
                        : UIColors.text,

                    fontSize: 18,
                }
            );
        });
    }

    // =========================================================
    // LEVEL CARD
    // =========================================================

    private createLevelCard(
        x: number,
        y: number,
        level: HSKLevel,
        vocabularyCount: number
    ): void {

        const colorMap: Record<HSKLevel, number> = {
            'HSK1': UIColors.primary,
            'HSK2': UIColors.secondary,
            'HSK3': UIColors.yellow,
            'HSK4': UIColors.orange,
            'HSK5': UIColors.red,
            'HSK6': UIColors.purple,
            'HSK7-9': UIColors.text,
        };

        const color = colorMap[level];

        new UIButton(
            this,
            x,
            y,
            level,
            () => {
                this.startQuiz(level);
            },
            {
                width: 390,
                height: 100,
                color,
                darkColor: this.darken(color),
                fontSize: 26,
            }
        );

        this.add.text(
            x,
            y + 33,
            `${vocabularyCount.toLocaleString()} words`,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: level === 'HSK3'
                    ? '#263238'
                    : '#FFFFFF',
            }
        ).setOrigin(0.5);
    }

    // =========================================================
    // START QUIZ
    // =========================================================

    private startQuiz(level: HSKLevel): void {

        goToScene(
            this,
            'QuizScene',
            {
                level,
                questionCount: this.selectedQuestionCount,
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
    // DARKEN COLOR
    // =========================================================

    private darken(color: number): number {

        const c = Phaser.Display.Color.IntegerToColor(color);

        return Phaser.Display.Color.GetColor(
            Math.max(0, c.red - 35),
            Math.max(0, c.green - 35),
            Math.max(0, c.blue - 35)
        );
    }
}