import * as Phaser from 'phaser';
import { UIButton } from '../../../../../ui/UIButton';
import { UIColors } from '../../../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../../../ui/SceneTransition';
import { HSKLevel } from '../../../../../../services/HSKDataService';
import { HSKVocabulary } from '../../../../../../types/HSKTypes';
import { mapPartOfSpeech } from '../../../../../utils/VocabularyUtils';

export default class WordDetailScene extends Phaser.Scene {

    private level!: HSKLevel;
    private word!: HSKVocabulary;

    constructor() {
        super('WordDetailScene');
    }

    init(data: {
        level: HSKLevel;
        word: HSKVocabulary;
    }): void {
        this.level = data.level;
        this.word = data.word;
    }

    create(): void {
        const width = this.scale.width;
        const height = this.scale.height;

        fadeInScene(this);

        this.createBackground();
        this.createHeader();
        this.createWordCard();
        this.createBackButton();

        this.input.keyboard?.on('keydown-ESC', () => {
            this.goBack();
        });
    }

    private createHeader(): void {
        const width = this.scale.width;

        this.add.text(width / 2, 48, 'WORD', {
            fontFamily: 'Arial',
            fontSize: '34px',
            fontStyle: 'bold',
            color: '#263238',
        }).setOrigin(0.5);

        this.add.text(width / 2, 84, this.level, {
            fontFamily: 'Arial',
            fontSize: '17px',
            fontStyle: 'bold',
            color: '#4E9F3D',
        }).setOrigin(0.5);
    }

    private createWordCard(): void {
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
            .setStrokeStyle(2, UIColors.cardBorder);

        this.createWordHeader(cardX, cardY);
        this.createInformation(cardX, cardY);
    }

    private createWordHeader(
        cardX: number,
        cardY: number
    ): void {

        // Chinese word
        this.add.text(
            cardX,
            cardY - 135,
            this.word.word,
            {
                fontFamily: 'Arial',
                fontSize: '64px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        // Pinyin
        this.add.text(
            cardX,
            cardY - 72,
            this.word.pinyin,
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#4E9F3D',
            }
        ).setOrigin(0.5);
    }

    private createInformation(
        cardX: number,
        cardY: number
    ): void {

        const leftX = cardX - 245;
        const rightX = cardX + 245;

        const infoTop = cardY - 20;

        // TYPE
        this.add.text(
            leftX,
            infoTop,
            '词性',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            leftX,
            infoTop + 30,
            this.word.cixing,
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            leftX,
            infoTop + 57,
            mapPartOfSpeech(this.word.cixing),
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#667085',
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
            infoTop + 30,
            this.level,
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#4E9F3D',
            }
        ).setOrigin(1, 0.5);

        // SORT NUMBER
        this.add.text(
            leftX,
            infoTop + 105,
            'WORD NUMBER',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            leftX,
            infoTop + 135,
            `#${this.word.sort}`,
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0, 0.5);

        // SOURCE LEVEL NAME
        this.add.text(
            rightX,
            infoTop + 105,
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
            infoTop + 135,
            this.word.levelName || this.level,
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(1, 0.5);
    }

    private createBackButton(): void {
        new UIButton(
            this,
            90,
            this.scale.height - 58,
            'BACK',
            () => this.goBack(),
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
        goToScene(this, 'VocabularyScene', {
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
            UIColors.primary,
            0.04
        );
    }
}