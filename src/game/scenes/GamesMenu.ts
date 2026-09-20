import * as Phaser from 'phaser';

interface GameItem {
    id: string;
    title: string;
    description: string;
    available: boolean;
}

export default class GamesMenu extends Phaser.Scene {

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

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0xf5f1e8
        );

        // Header
        this.add.text(
            width / 2,
            50,
            'GAMES',
            {
                fontFamily: 'Arial',
                fontSize: '40px',
                color: '#2d2d2d',
                fontStyle: 'bold',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            90,
            'Choose a game',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#777777',
            }
        ).setOrigin(0.5);

        // Grid
        const cardWidth = 430;
        const cardHeight = 105;

        const startX = width / 2 - cardWidth / 2 - 15;
        const startY = 165;

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

        // Back
        this.createBackButton(60, height - 30);
    }

    private createGameCard(
        x: number,
        y: number,
        width: number,
        height: number,
        game: GameItem
    ) {

        const background = this.add.rectangle(
            x,
            y,
            width,
            height,
            game.available
                ? 0xffffff
                : 0xe8e5df
        );

        background.setStrokeStyle(
            2,
            game.available
                ? 0xdddddd
                : 0xd5d2cc
        );

        if (game.available) {

            background.setInteractive({
                useHandCursor: true
            });

            background.on('pointerover', () => {
                background.setFillStyle(0xe8f5e9);
            });

            background.on('pointerout', () => {
                background.setFillStyle(0xffffff);
            });

            background.on('pointerdown', () => {
                this.startGame(game);
            });
        }

        // Title
        this.add.text(
            x - width / 2 + 25,
            y - 20,
            game.title,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: game.available
                    ? '#222222'
                    : '#888888',
                fontStyle: 'bold',
            }
        );

        // Description
        this.add.text(
            x - width / 2 + 25,
            y + 15,
            game.description,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#888888',
            }
        );

        // Status
        this.add.text(
            x + width / 2 - 55,
            y,
            game.available
                ? 'PLAY'
                : 'SOON',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: game.available
                    ? '#2e7d32'
                    : '#999999',
                fontStyle: 'bold',
            }
        ).setOrigin(0.5);
    }

    private startGame(game: GameItem) {

        if (game.id === 'quiz') {
            this.showComingSoon('HSK Quiz Battle');
        }
    }

    private createBackButton(
        x: number,
        y: number
    ) {

        const button = this.add.text(
            x,
            y,
            '< BACK',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#555555',
                fontStyle: 'bold',
            }
        ).setOrigin(0.5);

        button.setInteractive({
            useHandCursor: true
        });

        button.on('pointerover', () => {
            button.setColor('#2e7d32');
        });

        button.on('pointerout', () => {
            button.setColor('#555555');
        });

        button.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }

    private showComingSoon(name: string) {

        const { width, height } = this.scale;

        const overlay = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000,
            0.6
        );

        const message = this.add.text(
            width / 2,
            height / 2,
            `${name}\n\nWe'll build this next!`,
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff',
                align: 'center',
            }
        ).setOrigin(0.5);

        overlay.setInteractive();

        overlay.once('pointerdown', () => {
            overlay.destroy();
            message.destroy();
        });
    }
}