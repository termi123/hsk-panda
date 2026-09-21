import * as Phaser from 'phaser';
import { UIButton } from '../../../ui/UIButton';
import { UIColors } from '../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
} from '../../../../services/HSKDataService';

export default class HSKRunnerMenu extends Phaser.Scene {

    private readonly levels: HSKLevel[] = [
        'HSK1',
        'HSK2',
        'HSK3',
        'HSK4',
        'HSK5',
        'HSK6',
        'HSK7-9',
    ];

    constructor() {
        super('HSKRunnerMenu');
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
            70,
            'HSK RUNNER',
            {
                fontFamily: 'Arial',
                fontSize: '42px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            115,
            'Run, learn and beat your high score',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        // =========================
        // INSTRUCTION
        // =========================

        this.add.text(
            width / 2,
            155,
            'CHOOSE YOUR HSK LEVEL',
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        // =========================
        // LEVEL CARDS
        // =========================

        const columnOffset = 222;

        const positions: [number, number][] = [
            [width / 2 - columnOffset, 245],
            [width / 2 + columnOffset, 245],

            [width / 2 - columnOffset, 365],
            [width / 2 + columnOffset, 365],

            [width / 2 - columnOffset, 485],
            [width / 2 + columnOffset, 485],

            [width / 2, 605],
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
                goToScene(
                    this,
                    'RunnerScene',
                    {
                        level,
                    }
                );
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