import * as Phaser from 'phaser';
import { UIButton } from '../ui/UIButton';
import { UIColors } from '../ui/UIColors';
import { UIModal } from '../ui/UIModal';
import { fadeInScene, goToScene } from '../ui/SceneTransition';

interface GameItem {
    id: string;
    title: string;
    description: string;
    available: boolean;
}

export default class GamesMenu extends Phaser.Scene {

    private modal!: UIModal;

    private games: GameItem[] = [
        {
            id: 'quiz',
            title: 'HSK Quiz Battle',
            description: 'Listen and choose',
            available: true,
        },
        {
            id: 'memory',
            title: 'Memory Cards',
            description: 'Match words',
            available: false,
        },
        {
            id: 'runner',
            title: 'HSK Runner',
            description: 'Run and learn',
            available: false,
        },
        {
            id: 'restaurant',
            title: 'Panda Restaurant',
            description: 'Serve customers',
            available: false,
        },
        {
            id: 'detective',
            title: 'Chinese Detective',
            description: 'Find objects',
            available: false,
        },
        {
            id: 'train',
            title: 'HSK Train Adventure',
            description: 'Travel and learn',
            available: false,
        },
        {
            id: 'market',
            title: 'Chinese Market',
            description: 'Shop in Chinese',
            available: false,
        },
        {
            id: 'flashcard',
            title: 'Flashcard RPG',
            description: 'Level up words',
            available: false,
        },
    ];

    constructor() {
        super('GamesMenu');
    }

    create(): void {
        const width = this.scale.width;
        const height = this.scale.height;

        fadeInScene(this);

        this.modal = new UIModal(this);

        this.createBackground();

        this.add.text(
            width / 2,
            60,
            'GAMES',
            {
                fontFamily: 'Arial',
                fontSize: '38px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            102,
            'Choose a game',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        const cardWidth = 430;
        const cardHeight = 105;

        const startX = width / 2 - cardWidth / 2 - 15;
        const startY = 175;

        const columnGap = 30;
        const rowGap = 20;

        this.games.forEach((game, index) => {

            const column = index % 2;
            const row = Math.floor(index / 2);

            const x =
                startX +
                column * (cardWidth + columnGap);

            const y =
                startY +
                row * (cardHeight + rowGap);

            this.createGameCard(
                x,
                y,
                cardWidth,
                cardHeight,
                game
            );
        });

        new UIButton(
            this,
            90,
            height - 48,
            'BACK',
            () => {
                goToScene(this, 'MainMenu');
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

    private createGameCard(
        x: number,
        y: number,
        width: number,
        height: number,
        game: GameItem
    ): void {

        const card = this.add.container(x, y);

        const shadow = this.add.rectangle(
            0,
            5,
            width,
            height,
            0xD8CCB8
        );

        shadow.setAlpha(game.available ? 0.9 : 0.5);

        const background = this.add.rectangle(
            0,
            0,
            width,
            height,
            game.available
                ? UIColors.card
                : UIColors.backgroundAlt
        );

        background.setStrokeStyle(
            2,
            game.available
                ? UIColors.cardBorder
                : 0xE0D8C4
        );

        const title = this.add.text(
            -width / 2 + 25,
            -20,
            game.title,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: game.available
                    ? '#263238'
                    : '#98A2B3',
            }
        );

        const description = this.add.text(
            -width / 2 + 25,
            15,
            game.description,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#98A2B3',
            }
        );

        const badge = this.add.text(
            width / 2 - 55,
            0,
            game.available
                ? 'PLAY'
                : 'SOON',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: game.available
                    ? '#4E9F3D'
                    : '#98A2B3',
            }
        ).setOrigin(0.5);

        card.add([
            shadow,
            background,
            title,
            description,
            badge,
        ]);

        card.setSize(width, height);

        if (!game.available) {
            return;
        }

        card.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        card.on('pointerdown', () => {
            this.startGame(game);

            this.tweens.killTweensOf(card);

            this.tweens.add({
                targets: card,
                scaleX: 0.97,
                scaleY: 0.97,
                duration: 60,
                yoyo: true,
                ease: 'Quad.easeOut',
            });
        });
    }

    private startGame(game: GameItem): void {
        if (game.id === 'quiz') {
            this.modal.showComingSoon(
                game.title.toUpperCase(),
                "We'll build this next!"
            );
        }
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
            90,
            140,
            UIColors.secondary,
            0.06
        );

        this.add.circle(
            width - 70,
            height - 90,
            170,
            UIColors.primary,
            0.07
        );
    }
}
