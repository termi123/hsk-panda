import * as Phaser from 'phaser';
import { UIButton } from '../ui/UIButton';
import { UIColors } from '../ui/UIColors';
import { UIModal } from '../ui/UIModal';
import { fadeInScene, goToScene } from '../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
} from '../../services/HSKDataService';

export default class HSKHome extends Phaser.Scene {
    private level!: HSKLevel;
    private modal!: UIModal;

    constructor() {
        super('HSKHome');
    }

    init(data: { level: HSKLevel }): void {
        this.level = data.level;
    }

    create(): void {
        const width = this.scale.width;
        const height = this.scale.height;

        fadeInScene(this);

        this.modal = new UIModal(this);

        const stats = HSKDataService.getStats(this.level);

        this.createBackground();

        // Header
        this.add.text(
            width / 2,
            60,
            this.level,
            {
                fontFamily: 'Arial',
                fontSize: '44px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            105,
            'Choose what you want to learn',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        // Stats
        this.add.text(
            width / 2,
            145,
            `${stats.vocabulary} words  •  ${stats.grammar} grammar  •  ${stats.hanzi} hanzi`,
            {
                fontFamily: 'Arial',
                fontSize: '15px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        // Content buttons
        this.createContentButton(
            width / 2,
            230,
            'VOCABULARY',
            `${stats.vocabulary.toLocaleString()} words`,
            UIColors.primary,
            () => {
                goToScene(this, 'VocabularyScene', {
                        level: this.level,
                });
            }
        );

        this.createContentButton(
            width / 2,
            335,
            'GRAMMAR',
            `${stats.grammar.toLocaleString()} grammar items`,
            UIColors.secondary,
            () => {
                this.modal.showComingSoon('GRAMMAR');
            }
        );

        this.createContentButton(
            width / 2,
            440,
            'HANZI',
            `${stats.hanzi.toLocaleString()} characters`,
            UIColors.yellow,
            () => {
                this.modal.showComingSoon('HANZI');
            }
        );

        this.createContentButton(
            width / 2,
            545,
            'TOPICS',
            `${stats.topics.toLocaleString()} topics`,
            UIColors.orange,
            () => {
                this.modal.showComingSoon('TOPICS');
            }
        );

        this.createContentButton(
            width / 2,
            650,
            'TASKS',
            `${stats.tasks.toLocaleString()} tasks`,
            UIColors.purple,
            () => {
                this.modal.showComingSoon('TASKS');
            }
        );

        // Back
        new UIButton(
            this,
            90,
            height - 48,
            'BACK',
            () => {
                goToScene(this, 'HSKLevelMenu');
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

    private createContentButton(
        x: number,
        y: number,
        title: string,
        subtitle: string,
        color: number,
        onClick: () => void
    ): void {
        new UIButton(
            this,
            x,
            y,
            title,
            onClick,
            {
                width: 500,
                height: 78,
                color,
                darkColor: this.darken(color),
                fontSize: 22,
            }
        );

        this.add.text(
            x,
            y + 28,
            subtitle,
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: title === 'HANZI'
                    ? '#263238'
                    : '#FFFFFF',
            }
        ).setOrigin(0.5);
    }

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
            70,
            100,
            150,
            UIColors.secondary,
            0.06
        );

        this.add.circle(
            width - 70,
            height - 100,
            180,
            UIColors.yellow,
            0.08
        );
    }

    private darken(color: number): number {
        const c = Phaser.Display.Color.IntegerToColor(color);

        return Phaser.Display.Color.GetColor(
            Math.max(0, c.red - 35),
            Math.max(0, c.green - 35),
            Math.max(0, c.blue - 35)
        );
    }
}