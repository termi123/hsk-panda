import * as Phaser from 'phaser';

import { UIButton } from '../../../../../ui/UIButton';
import { UIColors } from '../../../../../ui/UIColors';
import {
    fadeInScene,
    goToScene,
} from '../../../../../ui/SceneTransition';

import { HSKLevel } from '../../../../../../services/HSKDataService';
import { HSKTask } from '../../../../../../types/HSKTypes';

export default class TaskDetailScene extends Phaser.Scene {

    private level!: HSKLevel;
    private task!: HSKTask;
    private number = 0;

    constructor() {
        super('TaskDetailScene');
    }

    init(data: {
        level: HSKLevel;
        task: HSKTask;
        number?: number;
    }): void {
        this.level = data.level;
        this.task = data.task;
        this.number = data.number ?? 0;
    }

    create(): void {
        fadeInScene(this);

        this.createBackground();
        this.createHeader();
        this.createTaskCard();
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
            'TASK',
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
                color: '#8B70D6',
            }
        ).setOrigin(0.5);
    }

    private createTaskCard(): void {
        const width = this.scale.width;

        const cardWidth = 720;
        const cardHeight = 520;

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

        this.createTaskTitle(
            cardX,
            cardY
        );

        this.createInformation(
            cardX,
            cardY
        );
    }

    private createTaskTitle(
        cardX: number,
        cardY: number
    ): void {
        this.add.text(
            cardX,
            cardY - 220,
            this.number > 0
                ? `#${this.number}`
                : '',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0.5);

        this.add.text(
            cardX,
            cardY - 175,
            this.cleanText(
                this.task.level1Content
            ),
            {
                fontFamily: 'Arial',
                fontSize: '30px',
                fontStyle: 'bold',
                color: '#263238',
                align: 'center',
                wordWrap: {
                    width: 600,
                },
                lineSpacing: 5,
            }
        ).setOrigin(0.5);
    }

    private createInformation(
        cardX: number,
        cardY: number
    ): void {
        const contentX = cardX - 300;

        this.add.text(
            contentX,
            cardY - 80,
            'DETAIL',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        const detailText = this.add.text(
            contentX,
            cardY - 45,
            this.cleanText(this.task.level2Content),
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#8B70D6',
                wordWrap: {
                    width: 600,
                    useAdvancedWrap: true,
                },
                lineSpacing: 7,
            }
        ).setOrigin(0, 0);

        // Metadata luôn nằm dưới phần DETAIL
        const metadataY = cardY - 45 + detailText.height + 45;

        this.add.text(
            contentX,
            metadataY,
            'LEVEL',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            contentX,
            metadataY + 33,
            this.level,
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                fontStyle: 'bold',
                color: '#4E9F3D',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            cardX - 20,
            metadataY,
            'TASK NUMBER',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            cardX - 20,
            metadataY + 33,
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

        this.add.text(
            cardX + 180,
            metadataY,
            'SOURCE LEVEL',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            cardX + 180,
            metadataY + 33,
            this.task.examLevelId || this.level,
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                fontStyle: 'bold',
                color: '#263238',
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
        goToScene(this, 'TaskScene', {
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
            UIColors.purple,
            0.04
        );
    }
}