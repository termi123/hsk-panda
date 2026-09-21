import * as Phaser from 'phaser';
import { UIButton } from '../ui/UIButton';
import { UIColors } from '../ui/UIColors';
import { fadeInScene, goToScene } from '../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
    HSKVocabulary,
} from '../../services/HSKDataService';

export default class VocabularyScene extends Phaser.Scene {

    private level!: HSKLevel;

    private readonly itemsPerPage = 20;
    private currentPage = 0;

    private vocabulary: HSKVocabulary[] = [];

    private listContainer!: Phaser.GameObjects.Container;

    private pageText!: Phaser.GameObjects.Text;
    private previousButton!: UIButton;
    private nextButton!: UIButton;

    constructor() {
        super('VocabularyScene');
    }

    init(data: { level: HSKLevel }): void {
        this.level = data.level;
    }

    create(): void {
        const width = this.scale.width;
        const height = this.scale.height;

        fadeInScene(this);

        this.vocabulary = HSKDataService.getVocabulary(this.level);

        this.createBackground();
        this.createHeader();
        this.createVocabularyList();
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
            'VOCABULARY',
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
                color: '#4E9F3D',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            98,
            `${this.vocabulary.length.toLocaleString()} words`,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#667085',
            }
        ).setOrigin(0.5);
    }

    // ============================================================
    // VOCABULARY LIST
    // ============================================================

    private createVocabularyList(): void {
        const width = this.scale.width;

        /*
         * List area:
         *
         * Header: 135
         * Rows:   160 -> 20 x 24 = 480
         *
         * So the list ends around 615.
         *
         * Pagination is at ~710.
         */

        this.listContainer = this.add.container(
            width / 2,
            135
        );

        this.createListHeader();
    }

    // ============================================================
    // LIST HEADER
    // ============================================================

    private createListHeader(): void {

        const headerWidth = 700;
        const headerHeight = 30;

        const background = this.add.rectangle(
            0,
            0,
            headerWidth,
            headerHeight,
            UIColors.backgroundAlt
        )
            .setOrigin(0.5)
            .setStrokeStyle(1, UIColors.cardBorder);

        this.listContainer.add(background);

        // # -------------------------------------------------------

        const numberHeader = this.add.text(
            -340,
            0,
            '#',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        // HANZI ---------------------------------------------------

        const hanziHeader = this.add.text(
            -290,
            0,
            'HANZI',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        // PINYIN --------------------------------------------------

        const pinyinHeader = this.add.text(
            -140,
            0,
            'PINYIN',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        // TYPE ----------------------------------------------------

        const typeHeader = this.add.text(
            90,
            0,
            'TYPE',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        this.listContainer.add([
            numberHeader,
            hanziHeader,
            pinyinHeader,
            typeHeader,
        ]);
    }

    // ============================================================
    // RENDER PAGE
    // ============================================================

    private renderPage(): void {

        /*
         * Remove previous rows only.
         *
         * Header is index 0..4:
         *   0 = background
         *   1 = #
         *   2 = HANZI
         *   3 = PINYIN
         *   4 = TYPE
         */

        while (this.listContainer.length > 5) {
            const child = this.listContainer.getAt(5);

            if (child) {
                child.destroy();
            } else {
                break;
            }
        }

        const start =
            this.currentPage *
            this.itemsPerPage;

        const end = Math.min(
            start + this.itemsPerPage,
            this.vocabulary.length
        );

        const pageItems =
            this.vocabulary.slice(start, end);

        pageItems.forEach((word, index) => {

            /*
             * Header = 0
             *
             * Row 1  = 39
             * Row 2  = 63
             * ...
             *
             * 20th row = 495
             */

            const y =
                39 +
                index * 24;

            this.createWordRow(
                this.listContainer,
                word,
                y
            );
        });

        this.updatePagination();
    }

    // ============================================================
    // WORD ROW
    // ============================================================

    private createWordRow(
        container: Phaser.GameObjects.Container,
        word: HSKVocabulary,
        y: number
    ): void {

        const rowWidth = 700;
        const rowHeight = 24;

        // Row background
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

        // ========================================================
        // #
        // ========================================================

        const numberText = this.add.text(
            -340,
            y,
            `${word.sort}`,
            {
                fontFamily: 'Arial',
                fontSize: '12px',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        // ========================================================
        // HANZI
        // ========================================================

        const wordText = this.add.text(
            -290,
            y,
            word.word,
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0, 0.5);

        // ========================================================
        // PINYIN
        // ========================================================

        const pinyinText = this.add.text(
            -140,
            y,
            word.pinyin,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#667085',
            }
        ).setOrigin(0, 0.5);

        // ========================================================
        // TYPE
        // ========================================================

        const typeText = this.add.text(
            90,
            y,
            this.getPartOfSpeech(
                word.cixing
            ),
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#4E9F3D',
            }
        ).setOrigin(0, 0.5);

        container.add([
            background,
            numberText,
            wordText,
            pinyinText,
            typeText,
        ]);

        // ========================================================
        // HOVER
        // ========================================================

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

        // ========================================================
        // CLICK
        // ========================================================

        background.on(
            'pointerdown',
            () => {
                console.log(
                    'Selected vocabulary:',
                    word
                );
            }
        );
    }

    // ============================================================
    // PART OF SPEECH
    // ============================================================

    private getPartOfSpeech(
        type: string
    ): string {

        const map: Record<string, string> = {

            '名': '名 (Danh từ)',
            '动': '动 (Động từ)',
            '形': '形 (Tính từ)',
            '副': '副 (Phó từ)',
            '代': '代 (Đại từ)',
            '数': '数 (Số từ)',
            '量': '量 (Lượng từ)',
            '介': '介 (Giới từ)',
            '连': '连 (Liên từ)',
            '助': '助 (Trợ từ)',
            '叹': '叹 (Thán từ)',

            '方': '方 (Từ phương vị)',
            '时': '时 (Từ chỉ thời gian)',
            '区别': '区别 (Từ phân biệt)',
        };

        return type
            .split(',')
            .map(item => {

                const key =
                    item.trim();

                return (
                    map[key] ??
                    key
                );
            })
            .join(' / ');
    }

    // ============================================================
    // PAGINATION
    // ============================================================

    private createPagination(): void {

        const width = this.scale.width;
        const height = this.scale.height;

        const paginationY =
            height - 58;

        // Previous
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

        // Page
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

        // Next
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
                    color:
                        UIColors.primary,
                    darkColor:
                        UIColors.primaryDark,
                    fontSize: 14,
                }
            );
    }

    private updatePagination(): void {

        const totalPages =
            Math.ceil(
                this.vocabulary.length /
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
    // PREVIOUS PAGE
    // ============================================================

    private previousPage(): void {

        if (this.currentPage <= 0) {
            return;
        }

        this.currentPage--;

        this.renderPage();
    }

    // ============================================================
    // NEXT PAGE
    // ============================================================

    private nextPage(): void {

        const totalPages =
            Math.ceil(
                this.vocabulary.length /
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

        // Main background
        this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            UIColors.background
        );

        // Decorative circles
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