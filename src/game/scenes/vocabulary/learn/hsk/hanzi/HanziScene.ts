import * as Phaser from 'phaser';
import { UIButton } from '../../../../../ui/UIButton';
import { UIColors } from '../../../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../../../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
} from '../../../../../../services/HSKDataService';
import { HSKHanzi } from '../../../../../../types/HSKTypes';

export default class HanziScene extends Phaser.Scene {

    private level!: HSKLevel;

    private readonly itemsPerPage = 10;
    private currentPage = 0;

    private hanzi: HSKHanzi[] = [];

    private rowsContainer!: Phaser.GameObjects.Container;

    private pageText!: Phaser.GameObjects.Text;
    private previousButton!: UIButton;
    private nextButton!: UIButton;

    constructor() {
        super('HanziScene');
    }

    init(data: { level: HSKLevel }): void {
        this.level = data.level;
    }

    create(): void {
        const width = this.scale.width;

        fadeInScene(this);

        this.hanzi = HSKDataService.getHanzi(this.level);

        this.createBackground();
        this.createHeader();
        this.createHanziList();
        this.createPagination();
        this.createBackButton();

        this.renderPage();
    }

    private createHeader(): void {
        const width = this.scale.width;

        this.add.text(width / 2, 38, 'HANZI', {
            fontFamily: 'Arial',
            fontSize: '34px',
            fontStyle: 'bold',
            color: '#263238',
        }).setOrigin(0.5);

        this.add.text(width / 2, 73, this.level, {
            fontFamily: 'Arial',
            fontSize: '17px',
            fontStyle: 'bold',
            color: '#F28C28',
        }).setOrigin(0.5);

        this.add.text(
            width / 2,
            98,
            `${this.hanzi.length.toLocaleString()} characters`,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#667085',
            }
        ).setOrigin(0.5);
    }

    private createHanziList(): void {
        const width = this.scale.width;

        const listX = width / 2;
        const listY = 135;

        this.createListHeader();

        this.rowsContainer = this.add.container(listX, listY + 30);
    }

    private createListHeader(): void {
        const width = this.scale.width;

        const headerWidth = 700;
        const headerHeight = 32;

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
            .setStrokeStyle(1, UIColors.cardBorder);

        container.add(background);

        const numberHeader = this.add.text(
            -330,
            0,
            '#',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        const hanziHeader = this.add.text(
            -180,
            0,
            'HANZI',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        const typeHeader = this.add.text(
            120,
            0,
            'TYPE',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        container.add([
            numberHeader,
            hanziHeader,
            typeHeader,
        ]);
    }

    private renderPage(): void {
        this.rowsContainer.removeAll(true);

        const start = this.currentPage * this.itemsPerPage;
        const end = Math.min(
            start + this.itemsPerPage,
            this.hanzi.length
        );

        const pageItems = this.hanzi.slice(start, end);

        pageItems.forEach((hanzi, index) => {
            const y = 22 + index * 42;

            this.createHanziRow(
                this.rowsContainer,
                hanzi,
                y
            );
        });

        this.updatePagination();
    }

    private createHanziRow(
        container: Phaser.GameObjects.Container,
        hanzi: HSKHanzi,
        y: number
    ): void {
        const rowWidth = 700;
        const rowHeight = 42;

        const background = this.add.rectangle(
            0,
            y,
            rowWidth,
            rowHeight,
            UIColors.card
        )
            .setOrigin(0.5)
            .setStrokeStyle(1, UIColors.cardBorder);

        const numberText = this.add.text(
            -330,
            y,
            `${this.getHanziNumber(hanzi)}`,
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        const wordText = this.add.text(
            -180,
            y,
            hanzi.word,
            {
                fontFamily: 'Arial',
                fontSize: '22px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0, 0.5);

        const typeText = this.add.text(
            120,
            y,
            this.formatType(hanzi.type),
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#F28C28',
            }
        ).setOrigin(0, 0.5);

        container.add([
            background,
            numberText,
            wordText,
            typeText,
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
            goToScene(this, 'HanziDetailScene', {
                level: this.level,
                hanzi,
                number: this.getHanziNumber(hanzi),
            });
        });
    }

    private getHanziNumber(hanzi: HSKHanzi): number {
        const index = this.hanzi.indexOf(hanzi);

        return index >= 0
            ? index + 1
            : 0;
    }

    private formatType(type?: string): string {
        if (!type) {
            return '-';
        }

        // The current HSK Hanzi dataset uses numeric type values.
        return `HSK${type}`;
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
                color: UIColors.orange,
                darkColor: UIColors.orangeDark,
                fontSize: 14,
            }
        );
    }

    private updatePagination(): void {
        const totalPages = Math.max(
            1,
            Math.ceil(
                this.hanzi.length / this.itemsPerPage
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
            this.hanzi.length / this.itemsPerPage
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
            UIColors.orange,
            0.04
        );
    }
}