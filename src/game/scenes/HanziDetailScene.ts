import * as Phaser from 'phaser';
import { UIButton } from '../ui/UIButton';
import { UIColors } from '../ui/UIColors';
import { fadeInScene, goToScene } from '../ui/SceneTransition';
import {
    HSKHanzi,
    HSKLevel,
} from '../../services/HSKDataService';

export default class HanziDetailScene extends Phaser.Scene {

    private level!: HSKLevel;
    private hanzi!: HSKHanzi;
    private number = 0;

    constructor() {
        super('HanziDetailScene');
    }

    init(data: {
        level: HSKLevel;
        hanzi: HSKHanzi;
        number?: number;
    }): void {
        this.level = data.level;
        this.hanzi = data.hanzi;
        this.number = data.number ?? 0;
    }

    create(): void {
        fadeInScene(this);

        this.createBackground();
        this.createHeader();
        this.createHanziCard();
        this.createBackButton();

        this.input.keyboard?.on(
            'keydown-ESC',
            () => {
                this.goBack();
            }
        );
    }

    private createHeader(): void {
        const width = this.scale.width;

        this.add.text(
            width / 2,
            48,
            'HANZI',
            {
                fontFamily: 'Arial',
                fontSize: '34px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            84,
            this.level,
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                fontStyle: 'bold',
                color: '#F28C28',
            }
        ).setOrigin(0.5);
    }

    private createHanziCard(): void {
        const width = this.scale.width;

        const cardWidth = 620;
        const cardHeight = 430;

        const cardX = width / 2;
        const cardY = 365;

        // Shadow
        this.add.rectangle(
            cardX,
            cardY + 7,
            cardWidth,
            cardHeight,
            0xD8CCB8
        ).setOrigin(0.5);

        // Card
        this.add.rectangle(
            cardX,
            cardY,
            cardWidth,
            cardHeight,
            UIColors.card
        )
            .setOrigin(0.5)
            .setStrokeStyle(
                2,
                UIColors.cardBorder
            );

        this.createCharacter(
            cardX,
            cardY
        );

        this.createInformation(
            cardX,
            cardY
        );
    }

    private createCharacter(
        cardX: number,
        cardY: number
    ): void {
        this.add.text(
            cardX,
            cardY - 110,
            this.hanzi.word,
            {
                fontFamily: 'Arial',
                fontSize: '110px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            cardX,
            cardY - 25,
            'Chinese Character',
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#667085',
            }
        ).setOrigin(0.5);
    }

    private createInformation(
        cardX: number,
        cardY: number
    ): void {
        const leftX = cardX - 245;
        const rightX = cardX + 245;

        const infoTop = cardY + 45;

        // TYPE
        this.add.text(
            leftX,
            infoTop,
            'TYPE',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            leftX,
            infoTop + 32,
            this.formatType(this.hanzi.type),
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#F28C28',
            }
        ).setOrigin(0, 0.5);

        // HSK LEVEL
        this.add.text(
            rightX,
            infoTop,
            'LEVEL',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(1, 0.5);

        this.add.text(
            rightX,
            infoTop + 32,
            this.level,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#4E9F3D',
            }
        ).setOrigin(1, 0.5);

        // CHARACTER NUMBER
        this.add.text(
            leftX,
            infoTop + 90,
            'CHARACTER NUMBER',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            leftX,
            infoTop + 122,
            this.number > 0
                ? `#${this.number}`
                : '-',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0, 0.5);

        // SOURCE LEVEL
        this.add.text(
            rightX,
            infoTop + 90,
            'SOURCE LEVEL',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(1, 0.5);

        this.add.text(
            rightX,
            infoTop + 122,
            this.hanzi.examLevelId || this.level,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(1, 0.5);
    }

    private formatType(type?: string): string {
        if (!type) {
            return '-';
        }

        return `HSK${type}`;
    }

    private createBackButton(): void {
        new UIButton(
            this,
            90,
            this.scale.height - 58,
            'BACK',
            () => {
                this.goBack();
            },
            {
                width: 120,
                height: 44,
                color: UIColors.card,
                darkColor: UIColors.cardBorder,
                textColor: UIColors.text,
                fontSize: 14,
            }
        );
    }

    private goBack(): void {
        goToScene(this, 'HanziScene', {
            level: this.level,
        });
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
            0.05
        );

        this.add.circle(
            width - 70,
            height - 100,
            180,
            UIColors.yellow,
            0.06
        );

        this.add.circle(
            width - 120,
            100,
            80,
            UIColors.orange,
            0.04
        );
    }
}