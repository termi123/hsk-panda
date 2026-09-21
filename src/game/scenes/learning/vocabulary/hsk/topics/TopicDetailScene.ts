import * as Phaser from 'phaser';
import { UIButton } from '../../../../../ui/UIButton';
import { UIColors } from '../../../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../../../ui/SceneTransition';
import {
    HSKLevel,
    HSKTopic,
} from '../../../../../../services/HSKDataService';

export default class TopicDetailScene extends Phaser.Scene {

    private level!: HSKLevel;
    private topic!: HSKTopic;
    private number = 0;

    constructor() {
        super('TopicDetailScene');
    }

    init(data: {
        level: HSKLevel;
        topic: HSKTopic;
        number?: number;
    }): void {
        this.level = data.level;
        this.topic = data.topic;
        this.number = data.number ?? 0;
    }

    create(): void {
        fadeInScene(this);

        this.createBackground();
        this.createHeader();
        this.createTopicCard();
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
            'TOPIC',
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

    private createTopicCard(): void {
        const width = this.scale.width;

        const cardWidth = 700;
        const cardHeight = 500;

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

        this.createTitle(cardX, cardY);
        this.createHierarchy(cardX, cardY);
    }

    private createTitle(
        cardX: number,
        cardY: number
    ): void {
        this.add.text(
            cardX,
            cardY - 195,
            `#${this.number}`,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0.5);

        this.add.text(
            cardX,
            cardY - 155,
            this.cleanText(
                this.topic.level1Content
            ),
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                fontStyle: 'bold',
                color: '#263238',
                align: 'center',
                wordWrap: {
                    width: 580,
                },
            }
        ).setOrigin(0.5);
    }

    private createHierarchy(
        cardX: number,
        cardY: number
    ): void {
        const leftX = cardX - 270;
        const rightX = cardX + 270;

        // LEVEL 1
        this.createSection(
            leftX,
            cardY - 65,
            'TOPIC',
            this.topic.level1Content,
            '#263238'
        );

        // LEVEL 2
        this.createSection(
            leftX,
            cardY + 65,
            'SUB TOPIC',
            this.topic.level2Content,
            '#4E9F3D'
        );

        // LEVEL 3
        this.createSection(
            leftX,
            cardY + 195,
            'DETAIL',
            this.topic.level3Content,
            '#F28C28'
        );

        // LEVEL
        this.add.text(
            rightX,
            cardY - 65,
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
            cardY - 33,
            this.level,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#4E9F3D',
            }
        ).setOrigin(1, 0.5);

        // NUMBER
        this.add.text(
            rightX,
            cardY + 65,
            'TOPIC NUMBER',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(1, 0.5);

        this.add.text(
            rightX,
            cardY + 97,
            this.number > 0
                ? `#${this.number}`
                : '-',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(1, 0.5);

        // SOURCE LEVEL
        this.add.text(
            rightX,
            cardY + 165,
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
            cardY + 197,
            this.topic.examLevelId || this.level,
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(1, 0.5);
    }

    private createSection(
        x: number,
        y: number,
        label: string,
        value: string | undefined,
        valueColor: string
    ): void {
        this.add.text(
            x,
            y,
            label,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            x,
            y + 30,
            this.cleanText(value),
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                fontStyle: 'bold',
                color: valueColor,
                wordWrap: {
                    width: 360,
                },
            }
        ).setOrigin(0, 0.5);
    }

    private cleanText(text?: string): string {
        if (!text) {
            return '-';
        }

        return text
            .replace(/\s+/g, ' ')
            .trim();
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
        goToScene(this, 'TopicScene', {
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