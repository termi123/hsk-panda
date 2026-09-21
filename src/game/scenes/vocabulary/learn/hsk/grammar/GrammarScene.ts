import * as Phaser from 'phaser';
import { UIButton } from '../../../../../ui/UIButton';
import { UIColors } from '../../../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../../../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
} from '../../../../../../services/HSKDataService';
import { HSKGrammar } from '../../../../../../types/HSKTypes';
import {
    mapGrammarType,
    mapGrammarCategory,
} from '../../../../../utils/GrammarUtils';

export default class GrammarScene extends Phaser.Scene {

    private level!: HSKLevel;

    // 10 rows fit comfortably above pagination
    private readonly itemsPerPage = 10;

    private currentPage = 0;

    private grammar: HSKGrammar[] = [];

    private listContainer!: Phaser.GameObjects.Container;

    private pageText!: Phaser.GameObjects.Text;

    private previousButton!: UIButton;

    private nextButton!: UIButton;

    constructor() {
        super('GrammarScene');
    }

    init(data: { level: HSKLevel }): void {
        this.level = data.level;
    }

    create(): void {

        this.grammar =
            HSKDataService.getGrammar(this.level);

        fadeInScene(this);

        this.createBackground();
        this.createHeader();
        this.createList();
        this.createPagination();
        this.createBackButton();

        this.renderPage();
    }

    // ============================================================
    // HEADER
    // ============================================================

    private createHeader(): void {

        const width = this.scale.width;

        this.add.text(
            width / 2,
            38,
            'GRAMMAR',
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
                color: '#5B8DEF',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            98,
            `${this.grammar.length.toLocaleString()} grammar items`,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#667085',
            }
        ).setOrigin(0.5);
    }

    // ============================================================
    // LIST
    // ============================================================

    private createList(): void {

        const width = this.scale.width;

        /*
         * Screen: 1024 x 768
         *
         * Header ends around y = 110
         *
         * Table:
         * y = 135
         *
         * Header = 36
         * 10 rows x 44 = 440
         *
         * Bottom = around 611
         *
         * Pagination = around 710
         *
         * So there is enough space.
         */

        this.listContainer =
            this.add.container(
                width / 2,
                135
            );

        this.createListHeader();
    }

    // ============================================================
    // TABLE HEADER
    // ============================================================

    private createListHeader(): void {

        const tableWidth = 900;
        const headerHeight = 36;

        const background =
            this.add.rectangle(
                0,
                0,
                tableWidth,
                headerHeight,
                UIColors.backgroundAlt
            )
                .setOrigin(0.5)
                .setStrokeStyle(
                    1,
                    UIColors.cardBorder
                );

        this.listContainer.add(
            background
        );

        // --------------------------------------------------------
        // #
        // --------------------------------------------------------

        this.listContainer.add(
            this.add.text(
                -430,
                0,
                '#',
                {
                    fontFamily: 'Arial',
                    fontSize: '13px',
                    fontStyle: 'bold',
                    color: '#667085',
                }
            ).setOrigin(0, 0.5)
        );

        // --------------------------------------------------------
        // GRAMMAR
        // --------------------------------------------------------

        this.listContainer.add(
            this.add.text(
                -380,
                0,
                'GRAMMAR',
                {
                    fontFamily: 'Arial',
                    fontSize: '13px',
                    fontStyle: 'bold',
                    color: '#667085',
                }
            ).setOrigin(0, 0.5)
        );

        // --------------------------------------------------------
        // TYPE
        // --------------------------------------------------------

        this.listContainer.add(
            this.add.text(
                170,
                0,
                'TYPE',
                {
                    fontFamily: 'Arial',
                    fontSize: '13px',
                    fontStyle: 'bold',
                    color: '#667085',
                }
            ).setOrigin(0, 0.5)
        );

        // --------------------------------------------------------
        // CATEGORY
        // --------------------------------------------------------

        this.listContainer.add(
            this.add.text(
                300,
                0,
                'CATEGORY',
                {
                    fontFamily: 'Arial',
                    fontSize: '13px',
                    fontStyle: 'bold',
                    color: '#667085',
                }
            ).setOrigin(0, 0.5)
        );
    }

    // ============================================================
    // RENDER PAGE
    // ============================================================

    private renderPage(): void {

        /*
         * Remove old rows.
         *
         * Keep first 5 children:
         *
         * 0 = header background
         * 1 = #
         * 2 = GRAMMAR
         * 3 = TYPE
         * 4 = CATEGORY
         */

        while (this.listContainer.length > 5) {

            const child =
                this.listContainer.getAt(
                    this.listContainer.length - 1
                );

            if (!child) {
                break;
            }

            this.listContainer.remove(
                child,
                true
            );
        }

        const start =
            this.currentPage *
            this.itemsPerPage;

        const end = Math.min(
            start + this.itemsPerPage,
            this.grammar.length
        );

        const pageItems =
            this.grammar.slice(
                start,
                end
            );

        pageItems.forEach(
            (grammar, index) => {

                const y =
                    42 +
                    index * 44;

                this.createGrammarRow(
                    grammar,
                    start + index + 1,
                    y
                );
            }
        );

        this.updatePagination();
    }

    // ============================================================
    // GRAMMAR ROW
    // ============================================================

    private createGrammarRow(
        grammar: HSKGrammar,
        number: number,
        y: number
    ): void {

        const tableWidth = 900;
        const rowHeight = 44;

        // --------------------------------------------------------
        // Row background
        // --------------------------------------------------------

        const background =
            this.add.rectangle(
                0,
                y,
                tableWidth,
                rowHeight,
                UIColors.card
            )
                .setOrigin(0.5)
                .setStrokeStyle(
                    1,
                    UIColors.cardBorder
                );

        this.listContainer.add(
            background
        );

        // --------------------------------------------------------
        // #
        // --------------------------------------------------------

        const numberText =
            this.add.text(
                -430,
                y,
                `${number}`,
                {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    color: '#98A2B3',
                }
            ).setOrigin(0, 0.5);

        // --------------------------------------------------------
        // GRAMMAR
        // --------------------------------------------------------

        const grammarText =
            this.add.text(
                -380,
                y,
                this.truncate(
                    this.cleanText(
                        grammar.content
                    ),
                    55
                ),
                {
                    fontFamily: 'Arial',
                    fontSize: '15px',
                    fontStyle: 'bold',
                    color: '#263238',
                }
            ).setOrigin(0, 0.5);

        // --------------------------------------------------------
        // TYPE
        // --------------------------------------------------------

        const typeText =
            this.add.text(
                170,
                y,
                this.truncate(
                    mapGrammarType(grammar.grammarType),
                        24
                ),
                {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    color: '#5B8DEF',
                }
            ).setOrigin(0, 0.5);

        // --------------------------------------------------------
        // CATEGORY
        // --------------------------------------------------------

        const categoryText =
            this.add.text(
                300,
                y,
                this.truncate(
                    mapGrammarCategory(grammar.categoryType),
                        30
                ),
                {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    color: '#667085',
                }
            ).setOrigin(0, 0.5);

        this.listContainer.add([
            numberText,
            grammarText,
            typeText,
            categoryText,
        ]);

        // --------------------------------------------------------
        // Interaction
        // --------------------------------------------------------

        background.setInteractive({
            useHandCursor: true,
        });

        background.on(
            'pointerover',
            () => {

                background.setFillStyle(
                    UIColors.backgroundAlt
                );

            }
        );

        background.on(
            'pointerout',
            () => {

                background.setFillStyle(
                    UIColors.card
                );

            }
        );

        background.on(
            'pointerdown',
            () => {
                goToScene(
                    this,
                    'GrammarDetailScene',
                    {
                        level: this.level,
                        grammar,
                        number,
                    }
                );
            }
        );
    }

    // ============================================================
    // CLEAN TEXT
    // ============================================================

    private cleanText(
        value?: string
    ): string {

        if (!value) {
            return '-';
        }

        return value
            .replace(/\s+/g, ' ')
            .trim();
    }

    // ============================================================
    // TRUNCATE
    // ============================================================

    private truncate(
        value: string,
        maxLength: number
    ): string {

        if (value.length <= maxLength) {
            return value;
        }

        return value.substring(
            0,
            maxLength - 3
        ) + '...';
    }

    // ============================================================
    // PAGINATION
    // ============================================================

    private createPagination(): void {

        const width = this.scale.width;
        const height = this.scale.height;

        const paginationY =
            height - 58;

        // --------------------------------------------------------
        // Previous
        // --------------------------------------------------------

        this.previousButton =
            new UIButton(
                this,
                width / 2 - 180,
                paginationY,
                '← PREVIOUS',
                () => {
                    this.previousPage();
                },
                {
                    width: 150,
                    height: 44,
                    color: UIColors.card,
                    darkColor:
                        UIColors.cardBorder,
                    textColor:
                        UIColors.text,
                    fontSize: 14,
                }
            );

        // --------------------------------------------------------
        // Page
        // --------------------------------------------------------

        this.pageText =
            this.add.text(
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

        // --------------------------------------------------------
        // Next
        // --------------------------------------------------------

        this.nextButton =
            new UIButton(
                this,
                width / 2 + 180,
                paginationY,
                'NEXT →',
                () => {
                    this.nextPage();
                },
                {
                    width: 150,
                    height: 44,
                    color: UIColors.secondary,
                    darkColor:
                        UIColors.secondaryDark,
                    fontSize: 14,
                }
            );
    }

    private updatePagination(): void {

        const totalPages =
            Math.ceil(
                this.grammar.length /
                this.itemsPerPage
            );

        this.pageText.setText(
            `${this.currentPage + 1} / ${totalPages}`
        );

        this.previousButton.setEnabled(
            this.currentPage > 0
        );

        this.nextButton.setEnabled(
            this.currentPage <
            totalPages - 1
        );
    }

    // ============================================================
    // PREVIOUS
    // ============================================================

    private previousPage(): void {

        if (this.currentPage <= 0) {
            return;
        }

        this.currentPage--;

        this.renderPage();
    }

    // ============================================================
    // NEXT
    // ============================================================

    private nextPage(): void {

        const totalPages =
            Math.ceil(
                this.grammar.length /
                this.itemsPerPage
            );

        if (
            this.currentPage >=
            totalPages - 1
        ) {
            return;
        }

        this.currentPage++;

        this.renderPage();
    }

    // ============================================================
    // BACK
    // ============================================================

    private createBackButton(): void {

        new UIButton(
            this,
            90,
            this.scale.height - 58,
            'BACK',
            () => {

                goToScene(
                    this,
                    'HSKHome',
                    {
                        level: this.level,
                    }
                );

            },
            {
                width: 120,
                height: 44,
                color: UIColors.card,
                darkColor:
                    UIColors.cardBorder,
                textColor:
                    UIColors.text,
                fontSize: 14,
            }
        );
    }

    // ============================================================
    // BACKGROUND
    // ============================================================

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
    }
}