import * as Phaser from 'phaser';

import { UIButton } from '../../../../../ui/UIButton';
import { UIColors } from '../../../../../ui/UIColors';
import {
    fadeInScene,
    goToScene,
} from '../../../../../ui/SceneTransition';

import {
    HSKDataService,
    HSKLevel,
    HSKTask,
} from '../../../../../../services/HSKDataService';

export default class TaskScene extends Phaser.Scene {

    private level!: HSKLevel;

    private readonly itemsPerPage = 10;
    private currentPage = 0;

    private tasks: HSKTask[] = [];

    private rowsContainer!: Phaser.GameObjects.Container;

    private pageText!: Phaser.GameObjects.Text;
    private previousButton!: UIButton;
    private nextButton!: UIButton;

    constructor() {
        super('TaskScene');
    }

    init(data: { level: HSKLevel }): void {
        this.level = data.level;
    }

    create(): void {
        fadeInScene(this);

        this.tasks = HSKDataService.getTasks(this.level);

        this.createBackground();
        this.createHeader();
        this.createTaskList();
        this.createPagination();
        this.createBackButton();

        this.renderPage();
    }

    private createHeader(): void {
        const width = this.scale.width;

        this.add.text(
            width / 2,
            38,
            'TASKS',
            {
                fontFamily: 'Arial',
                fontSize: '34px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            73,
            this.level,
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                fontStyle: 'bold',
                color: '#8B70D6',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            98,
            `${this.tasks.length.toLocaleString()} tasks`,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#667085',
            }
        ).setOrigin(0.5);
    }

    private createTaskList(): void {
        const width = this.scale.width;

        const listX = width / 2;
        const listY = 135;

        this.createListHeader();

        this.rowsContainer = this.add.container(
            listX,
            listY + 30
        );
    }

    private createListHeader(): void {
        const width = this.scale.width;

        const headerWidth = 800;
        const headerHeight = 36;

        const container = this.add.container(
            width / 2,
            135
        );

        const background = this.add.rectangle(
            0,
            0,
            headerWidth,
            headerHeight,
            UIColors.backgroundAlt
        )
            .setOrigin(0.5)
            .setStrokeStyle(
                1,
                UIColors.cardBorder
            );

        container.add(background);

        const numberHeader = this.add.text(
            -380,
            0,
            '#',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        const taskHeader = this.add.text(
            -330,
            0,
            'TASK',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        const detailHeader = this.add.text(
            40,
            0,
            'DETAIL',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        container.add([
            numberHeader,
            taskHeader,
            detailHeader,
        ]);
    }

    private renderPage(): void {
        this.rowsContainer.removeAll(true);

        const start =
            this.currentPage * this.itemsPerPage;

        const end = Math.min(
            start + this.itemsPerPage,
            this.tasks.length
        );

        const pageItems =
            this.tasks.slice(start, end);

        pageItems.forEach((task, index) => {
            const y = 24 + index * 48;

            this.createTaskRow(
                this.rowsContainer,
                task,
                start + index,
                y
            );
        });

        this.updatePagination();
    }

    private createTaskRow(
        container: Phaser.GameObjects.Container,
        task: HSKTask,
        index: number,
        y: number
    ): void {
        const rowWidth = 800;
        const rowHeight = 48;

        const background = this.add.rectangle(
            0,
            y,
            rowWidth,
            rowHeight,
            UIColors.card
        )
            .setOrigin(0.5)
            .setStrokeStyle(
                1,
                UIColors.cardBorder
            );

        const numberText = this.add.text(
            -380,
            y,
            `${index + 1}`,
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        // TASK
        const taskText = this.add.text(
            -330,
            y,
            this.truncateByWidth(
                this.cleanText(task.level1Content),
                330,
                15
            ),
            {
                fontFamily: 'Arial',
                fontSize: '15px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0, 0.5);

        // DETAIL
        const detailText = this.add.text(
            40,
            y,
            this.truncateByWidth(
                this.cleanText(task.level2Content),
                320,
                14
            ),
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#8B70D6',
            }
        ).setOrigin(0, 0.5);

        container.add([
            background,
            numberText,
            taskText,
            detailText,
        ]);

        background.setInteractive({
            useHandCursor: true,
        });

        background.on('pointerover', () => {
            background.setFillStyle(
                UIColors.backgroundAlt
            );
        });

        background.on('pointerout', () => {
            background.setFillStyle(
                UIColors.card
            );
        });

        background.on('pointerdown', () => {
            goToScene(this, 'TaskDetailScene', {
                level: this.level,
                task,
                number: index + 1,
            });
        });
    }

    /**
     * Truncate text based on actual rendered pixel width.
     * This is safer than truncating by character count,
     * especially for Chinese text.
     */
    private truncateByWidth(
        text: string,
        maxWidth: number,
        fontSize: number
    ): string {
        if (!text) {
            return '-';
        }

        const testText = this.add.text(
            0,
            0,
            text,
            {
                fontFamily: 'Arial',
                fontSize: `${fontSize}px`,
            }
        );

        if (testText.width <= maxWidth) {
            testText.destroy();
            return text;
        }

        let result = text;

        while (result.length > 0) {
            result = result.substring(
                0,
                result.length - 1
            );

            testText.setText(`${result}...`);

            if (testText.width <= maxWidth) {
                break;
            }
        }

        testText.destroy();

        return result
            ? `${result}...`
            : '...';
    }

    private cleanText(text?: string): string {
        if (!text) {
            return '-';
        }

        return text
            .replace(/\s+/g, ' ')
            .trim();
    }

    private createPagination(): void {
        const width = this.scale.width;
        const height = this.scale.height;

        const paginationY = height - 58;

        this.previousButton = new UIButton(
            this,
            width / 2 - 180,
            paginationY,
            '← PREVIOUS',
            () => this.previousPage(),
            {
                width: 150,
                height: 44,
                color: UIColors.card,
                darkColor: UIColors.cardBorder,
                textColor: UIColors.text,
                fontSize: 14,
            }
        );

        this.pageText = this.add.text(
            width / 2,
            paginationY,
            '',
            {
                fontFamily: 'Arial',
                fontSize: '15px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.nextButton = new UIButton(
            this,
            width / 2 + 180,
            paginationY,
            'NEXT →',
            () => this.nextPage(),
            {
                width: 150,
                height: 44,
                color: UIColors.purple,
                darkColor: UIColors.purpleDark,
                fontSize: 14,
            }
        );
    }

    private updatePagination(): void {
        const totalPages = Math.max(
            1,
            Math.ceil(
                this.tasks.length /
                this.itemsPerPage
            )
        );

        this.pageText.setText(
            `${this.currentPage + 1} / ${totalPages}`
        );

        this.previousButton.setEnabled(
            this.currentPage > 0
        );

        this.nextButton.setEnabled(
            this.currentPage < totalPages - 1
        );
    }

    private previousPage(): void {
        if (this.currentPage <= 0) {
            return;
        }

        this.currentPage--;

        this.renderPage();
    }

    private nextPage(): void {
        const totalPages = Math.ceil(
            this.tasks.length /
            this.itemsPerPage
        );

        if (this.currentPage >= totalPages - 1) {
            return;
        }

        this.currentPage++;

        this.renderPage();
    }

    private createBackButton(): void {
        new UIButton(
            this,
            90,
            this.scale.height - 58,
            'BACK',
            () => {
                goToScene(this, 'HSKHome', {
                    level: this.level,
                });
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