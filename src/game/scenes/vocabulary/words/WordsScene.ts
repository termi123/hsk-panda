import * as Phaser from 'phaser';

import { UIButton } from '../../../ui/UIButton';
import { UIColors } from '../../../ui/UIColors';
import {
    fadeInScene,
    goToScene,
} from '../../../ui/SceneTransition';

import {
    HSKDataService,
    HSKLevel,
    HSKVocabulary,
} from '../../../../services/HSKDataService';

import { mapPartOfSpeech } from '../../../utils/VocabularyUtils';

interface WordItem extends HSKVocabulary {
    sourceLevel: HSKLevel;
}

export default class WordsScene extends Phaser.Scene {
    private searchInput!: HTMLInputElement;
    private levelSelect!: HTMLSelectElement;
    private typeSelect!: HTMLSelectElement;
    private filterOverlay?: HTMLDivElement;

    private backButton!: UIButton;
    private previousButton!: UIButton;
    private nextButton!: UIButton;
    private pageText!: Phaser.GameObjects.Text;

    private rowObjects: Phaser.GameObjects.GameObject[] = [];

    private allWords: WordItem[] = [];
    private filteredWords: WordItem[] = [];

    private currentPage = 1;

    private readonly itemsPerPage = 10;

    private selectedLevel: HSKLevel | 'ALL' = 'ALL';
    private selectedType = 'ALL';
    private searchText = '';

    constructor() {
        super('WordsScene');
    }

    create(): void {
        this.createBackground();
        this.createHeader();
        this.createFilters();
        this.createTable();
        this.createPagination();

        this.loadWords();

        fadeInScene(this);
    }

    // =========================================================
    // BACKGROUND
    // =========================================================

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
            -30,
            80,
            120,
            UIColors.backgroundAlt,
            0.45
        );

        this.add.circle(
            width + 40,
            height - 40,
            150,
            UIColors.backgroundAlt,
            0.4
        );
    }

    // =========================================================
    // HEADER
    // =========================================================

    private createHeader(): void {
        this.add.text(
            this.scale.width / 2,
            40,
            'WORDS',
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);
    }

    // =========================================================
    // FILTERS
    // =========================================================

    private createFilters(): void {
        this.removeFilters();

        const parent = this.game.canvas.parentElement;

        if (!parent) {
            return;
        }

        parent.style.position = 'relative';

        const overlay = document.createElement('div');

        overlay.id = 'words-scene-filters';

        Object.assign(overlay.style, {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            zIndex: '1000',
            pointerEvents: 'none',
        });

        parent.appendChild(overlay);

        this.filterOverlay = overlay;

        // -----------------------------------------------------
        // SEARCH
        // -----------------------------------------------------

        this.searchInput = document.createElement('input');

        this.searchInput.type = 'text';
        this.searchInput.placeholder =
            'Search Hanzi or Pinyin...';

        Object.assign(this.searchInput.style, {
            position: 'absolute',
            width: '420px',
            height: '42px',
            boxSizing: 'border-box',
            border: '1px solid #E6DCC8',
            borderRadius: '10px',
            background: '#FFFFFF',
            color: '#263238',
            fontFamily: 'Arial',
            fontSize: '15px',
            padding: '0 14px',
            outline: 'none',
            pointerEvents: 'auto',
            zIndex: '1001',
        });

        overlay.appendChild(this.searchInput);

        // -----------------------------------------------------
        // HSK
        // -----------------------------------------------------

        this.levelSelect = document.createElement('select');

        Object.assign(this.levelSelect.style, {
            position: 'absolute',
            width: '190px',
            height: '40px',
            boxSizing: 'border-box',
            border: '1px solid #E6DCC8',
            borderRadius: '10px',
            background: '#FFFFFF',
            color: '#263238',
            fontFamily: 'Arial',
            fontSize: '14px',
            padding: '0 12px',
            outline: 'none',
            pointerEvents: 'auto',
            zIndex: '1001',
            cursor: 'pointer',
        });

        const levels: Array<HSKLevel | 'ALL'> = [
            'ALL',
            'HSK1',
            'HSK2',
            'HSK3',
            'HSK4',
            'HSK5',
            'HSK6',
            'HSK7-9',
        ];

        for (const level of levels) {
            const option =
                document.createElement('option');

            option.value = level;

            option.textContent =
                level === 'ALL'
                    ? 'All HSK Levels'
                    : level;

            this.levelSelect.appendChild(option);
        }

        overlay.appendChild(this.levelSelect);

        // -----------------------------------------------------
        // TYPE
        // -----------------------------------------------------

        this.typeSelect = document.createElement('select');

        Object.assign(this.typeSelect.style, {
            position: 'absolute',
            width: '190px',
            height: '40px',
            boxSizing: 'border-box',
            border: '1px solid #E6DCC8',
            borderRadius: '10px',
            background: '#FFFFFF',
            color: '#263238',
            fontFamily: 'Arial',
            fontSize: '14px',
            padding: '0 12px',
            outline: 'none',
            pointerEvents: 'auto',
            zIndex: '1001',
            cursor: 'pointer',
        });

        const allTypeOption =
            document.createElement('option');

        allTypeOption.value = 'ALL';
        allTypeOption.textContent = 'All Types';

        this.typeSelect.appendChild(
            allTypeOption
        );

        const types = [
            '名',
            '动',
            '形',
            '副',
            '代',
            '数',
            '量',
            '数量',
            '介',
            '连',
            '助',
            '叹',
            '拟声',
            '前缀',
            '后缀',
        ];

        for (const type of types) {
            const option =
                document.createElement('option');

            option.value = type;
            option.textContent =
                mapPartOfSpeech(type);

            this.typeSelect.appendChild(option);
        }

        overlay.appendChild(this.typeSelect);

        // -----------------------------------------------------
        // EVENTS
        // -----------------------------------------------------

        this.searchInput.addEventListener(
            'input',
            () => {
                this.searchText =
                    this.searchInput.value
                        .trim()
                        .toLowerCase();

                this.currentPage = 1;

                this.applyFilters();
            }
        );

        this.levelSelect.addEventListener(
            'change',
            () => {
                this.selectedLevel =
                    this.levelSelect.value as HSKLevel | 'ALL';

                this.currentPage = 1;

                this.applyFilters();
            }
        );

        this.typeSelect.addEventListener(
            'change',
            () => {
                this.selectedType =
                    this.typeSelect.value;

                this.currentPage = 1;

                this.applyFilters();
            }
        );

        this.positionFilters();

        this.scale.on(
            Phaser.Scale.Events.RESIZE,
            this.positionFilters,
            this
        );

        this.events.once(
            Phaser.Scenes.Events.SHUTDOWN,
            this.removeFilters,
            this
        );

        this.events.once(
            Phaser.Scenes.Events.DESTROY,
            this.removeFilters,
            this
        );
    }

    private positionFilters(): void {
        if (
            !this.searchInput ||
            !this.levelSelect ||
            !this.typeSelect
        ) {
            return;
        }

        const canvas = this.game.canvas;
        const parent = canvas.parentElement;

        if (!parent) {
            return;
        }

        const canvasRect =
            canvas.getBoundingClientRect();

        const parentRect =
            parent.getBoundingClientRect();

        const scaleX =
            canvasRect.width /
            this.scale.width;

        const scaleY =
            canvasRect.height /
            this.scale.height;

        const offsetX =
            canvasRect.left -
            parentRect.left;

        const offsetY =
            canvasRect.top -
            parentRect.top;

        // -----------------------------------------------------
        // SEARCH
        // -----------------------------------------------------

        const searchWidth = 420;

        this.searchInput.style.left =
            `${offsetX +
            ((this.scale.width -
                searchWidth) /
                2) *
                scaleX}px`;

        this.searchInput.style.top =
            `${offsetY +
            75 *
                scaleY}px`;

        this.searchInput.style.width =
            `${searchWidth *
                scaleX}px`;

        this.searchInput.style.height =
            `${42 *
                scaleY}px`;

        // -----------------------------------------------------
        // HSK
        // -----------------------------------------------------

        const selectWidth = 190;

        this.levelSelect.style.left =
            `${offsetX +
            (this.scale.width / 2 -
                200) *
                scaleX}px`;

        this.levelSelect.style.top =
            `${offsetY +
            130 *
                scaleY}px`;

        this.levelSelect.style.width =
            `${selectWidth *
                scaleX}px`;

        this.levelSelect.style.height =
            `${40 *
                scaleY}px`;

        // -----------------------------------------------------
        // TYPE
        // -----------------------------------------------------

        this.typeSelect.style.left =
            `${offsetX +
            (this.scale.width / 2 +
                10) *
                scaleX}px`;

        this.typeSelect.style.top =
            `${offsetY +
            130 *
                scaleY}px`;

        this.typeSelect.style.width =
            `${selectWidth *
                scaleX}px`;

        this.typeSelect.style.height =
            `${40 *
                scaleY}px`;
    }

    private removeFilters(): void {
        this.scale.off(
            Phaser.Scale.Events.RESIZE,
            this.positionFilters,
            this
        );

        if (this.filterOverlay) {
            this.filterOverlay.remove();
            this.filterOverlay = undefined;
        }

        const oldOverlay =
            document.getElementById(
                'words-scene-filters'
            );

        oldOverlay?.remove();
    }

    // =========================================================
    // LOAD DATA
    // =========================================================

    private loadWords(): void {
        const levels: HSKLevel[] = [
            'HSK1',
            'HSK2',
            'HSK3',
            'HSK4',
            'HSK5',
            'HSK6',
            'HSK7-9',
        ];

        this.allWords = [];

        for (const level of levels) {
            const words =
                HSKDataService.getVocabulary(level);

            for (const word of words) {
                this.allWords.push({
                    ...word,

                    // IMPORTANT:
                    // HSK is determined by the dataset
                    // we loaded it from.
                    sourceLevel: level,
                });
            }
        }

        this.applyFilters();
    }

    // =========================================================
    // FILTER
    // =========================================================

    private applyFilters(): void {
        const search =
            this.searchText;

        this.filteredWords =
            this.allWords.filter(
                (word) => {

                    // -------------------------------------------------
                    // HSK FILTER
                    // -------------------------------------------------

                    if (
                        this.selectedLevel !==
                            'ALL' &&
                        word.sourceLevel !==
                            this.selectedLevel
                    ) {
                        return false;
                    }

                    // -------------------------------------------------
                    // TYPE FILTER
                    // -------------------------------------------------

                    if (
                        this.selectedType !==
                            'ALL'
                    ) {
                        const types =
                            this.getWordTypes(
                                word
                            );

                        if (
                            !types.includes(
                                this.selectedType
                            )
                        ) {
                            return false;
                        }
                    }

                    // -------------------------------------------------
                    // SEARCH FILTER
                    // -------------------------------------------------

                    if (search.length > 0) {
                        const wordText =
                            (word.word ?? '')
                                .toLowerCase();

                        const pinyinText =
                            (word.pinyin ?? '')
                                .toLowerCase();

                        const matchesWord =
                            wordText.includes(
                                search
                            );

                        const matchesPinyin =
                            pinyinText.includes(
                                search
                            );

                        if (
                            !matchesWord &&
                            !matchesPinyin
                        ) {
                            return false;
                        }
                    }

                    return true;
                }
            );

        // ---------------------------------------------------------
        // PAGINATION MUST BE BASED ON FILTERED RESULT
        // ---------------------------------------------------------

        const totalPages =
            this.getTotalPages();

        if (
            this.currentPage >
            totalPages
        ) {
            this.currentPage =
                totalPages;
        }

        if (this.currentPage < 1) {
            this.currentPage = 1;
        }

        this.refreshList();
    }

    private getWordTypes(
        word: HSKVocabulary
    ): string[] {
        if (!word.cixing) {
            return [];
        }

        return word.cixing
            .split(/[,，、]/)
            .map(
                (item) =>
                    item
                        .trim()
                        .replace(/^（|）$/g, '')
            )
            .filter(Boolean);
    }

    // =========================================================
    // TABLE
    // =========================================================

    private createTable(): void {
        const width =
            this.scale.width;

        const tableWidth = 900;

        const left =
            (width -
                tableWidth) /
            2;

        const headerY = 205;

        this.add.rectangle(
            width / 2,
            headerY,
            tableWidth,
            38,
            UIColors.primary
        );

        this.add.text(
            left + 25,
            headerY,
            '#',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#FFFFFF',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            left + 80,
            headerY,
            'HANZI',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#FFFFFF',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            left + 250,
            headerY,
            'PINYIN',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#FFFFFF',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            left + 480,
            headerY,
            'TYPE',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#FFFFFF',
            }
        ).setOrigin(0, 0.5);

        this.add.text(
            left + 670,
            headerY,
            'HSK',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#FFFFFF',
            }
        ).setOrigin(0, 0.5);
    }

    // =========================================================
    // LIST
    // =========================================================

    private refreshList(): void {
        // Remove old rows
        for (const object of this.rowObjects) {
            object.destroy();
        }

        this.rowObjects = [];

        const pageItems =
            this.getCurrentPageItems();

        const width =
            this.scale.width;

        const tableWidth = 900;

        const left =
            (width -
                tableWidth) /
            2;

        const startY = 247;
        const rowHeight = 44;

        pageItems.forEach(
            (word, index) => {

                const y =
                    startY +
                    index *
                        rowHeight;

                // -------------------------------------------------
                // ROW
                // -------------------------------------------------

                const row =
                    this.add.rectangle(
                        width / 2,
                        y,
                        tableWidth,
                        rowHeight - 2,
                        index % 2 === 0
                            ? UIColors.card
                            : UIColors.backgroundAlt
                    );

                row.setInteractive({
                    useHandCursor: true,
                });

                row.on(
                    'pointerover',
                    () => {
                        row.setFillStyle(
                            UIColors.secondary,
                            0.12
                        );
                    }
                );

                row.on(
                    'pointerout',
                    () => {
                        row.setFillStyle(
                            index % 2 === 0
                                ? UIColors.card
                                : UIColors.backgroundAlt
                        );
                    }
                );

                row.on(
                    'pointerdown',
                    () => {
                        goToScene(
                            this,
                            'WordDetailScene',
                            {
                                level:
                                    word.sourceLevel,

                                word:
                                    word.word,
                                from: 'WordsScene'
                            }
                        );
                    }
                );

                this.rowObjects.push(row);

                // -------------------------------------------------
                // NUMBER
                // -------------------------------------------------

                const number =
                    (
                        (
                            this.currentPage -
                            1
                        ) *
                        this.itemsPerPage
                    ) +
                    index +
                    1;

                const numberText =
                    this.add.text(
                        left + 25,
                        y,
                        `${number}`,
                        {
                            fontFamily: 'Arial',
                            fontSize: '14px',
                            color: '#667085',
                        }
                    ).setOrigin(
                        0,
                        0.5
                    );

                this.rowObjects.push(
                    numberText
                );

                // -------------------------------------------------
                // HANZI
                // -------------------------------------------------

                const wordText =
                    this.add.text(
                        left + 80,
                        y,
                        word.word,
                        {
                            fontFamily: 'Arial',
                            fontSize: '20px',
                            color: '#263238',
                        }
                    ).setOrigin(
                        0,
                        0.5
                    );

                this.rowObjects.push(
                    wordText
                );

                // -------------------------------------------------
                // PINYIN
                // -------------------------------------------------

                const pinyinText =
                    this.add.text(
                        left + 250,
                        y,
                        word.pinyin,
                        {
                            fontFamily: 'Arial',
                            fontSize: '14px',
                            color: '#263238',
                        }
                    ).setOrigin(
                        0,
                        0.5
                    );

                this.rowObjects.push(
                    pinyinText
                );

                // -------------------------------------------------
                // TYPE
                // -------------------------------------------------

                const typeText =
                    this.add.text(
                        left + 480,
                        y,
                        mapPartOfSpeech(
                            word.cixing
                        ),
                        {
                            fontFamily: 'Arial',
                            fontSize: '13px',
                            color: '#667085',
                            wordWrap: {
                                width: 160,
                            },
                        }
                    ).setOrigin(
                        0,
                        0.5
                    );

                this.rowObjects.push(
                    typeText
                );

                // -------------------------------------------------
                // HSK
                // -------------------------------------------------

                const hskText =
                    this.add.text(
                        left + 670,
                        y,
                        word.sourceLevel,
                        {
                            fontFamily: 'Arial',
                            fontSize: '13px',
                            color: '#263238',
                            fontStyle: 'bold',
                        }
                    ).setOrigin(
                        0,
                        0.5
                    );

                this.rowObjects.push(
                    hskText
                );
            }
        );

        this.updatePagination();
    }

    // =========================================================
    // PAGINATION
    // =========================================================

    private createPagination(): void {
        const paginationY =
            this.scale.height -
            58;

        // ---------------------------------------------------------
        // BACK
        // ---------------------------------------------------------

        this.backButton =
            new UIButton(
                this,
                90,
                paginationY,
                'BACK',
                () => {
                    goToScene(
                        this,
                        'VocabularyMenu'
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

        // ---------------------------------------------------------
        // PREVIOUS
        // ---------------------------------------------------------

        this.previousButton =
            new UIButton(
                this,
                this.scale.width / 2 -
                    180,
                paginationY,
                '← PREVIOUS',
                () => {
                    if (
                        this.currentPage <=
                        1
                    ) {
                        return;
                    }

                    this.currentPage--;

                    this.refreshList();
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

        // ---------------------------------------------------------
        // PAGE
        // ---------------------------------------------------------

        this.pageText =
            this.add.text(
                this.scale.width / 2,
                paginationY,
                '',
                {
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    color: '#263238',
                    fontStyle: 'bold',
                }
            ).setOrigin(0.5);

        // ---------------------------------------------------------
        // NEXT
        // ---------------------------------------------------------

        this.nextButton =
            new UIButton(
                this,
                this.scale.width / 2 +
                    180,
                paginationY,
                'NEXT →',
                () => {
                    const totalPages =
                        this.getTotalPages();

                    if (
                        this.currentPage >=
                        totalPages
                    ) {
                        return;
                    }

                    this.currentPage++;

                    this.refreshList();
                },
                {
                    width: 150,
                    height: 44,
                    color:
                        UIColors.primary,
                    darkColor:
                        UIColors.primaryDark,
                    textColor:
                        UIColors.white,
                    fontSize: 14,
                }
            );
    }

    private updatePagination(): void {
        const totalPages =
            this.getTotalPages();

        this.pageText.setText(
            `Page ${this.currentPage} / ${totalPages}`
        );

        this.previousButton.setAlpha(
            this.currentPage <= 1
                ? 0.45
                : 1
        );

        this.nextButton.setAlpha(
            this.currentPage >=
                totalPages
                ? 0.45
                : 1
        );
    }

    private getTotalPages(): number {
        return Math.max(
            1,
            Math.ceil(
                this.filteredWords.length /
                    this.itemsPerPage
            )
        );
    }

    private getCurrentPageItems(): WordItem[] {
        const start =
            (
                this.currentPage -
                1
            ) *
            this.itemsPerPage;

        return this.filteredWords.slice(
            start,
            start +
                this.itemsPerPage
        );
    }
}