import * as Phaser from 'phaser';
import { UIButton } from '../ui/UIButton';
import { UIColors } from '../ui/UIColors';
import { fadeInScene, goToScene } from '../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
    HSKVocabulary,
} from '../../services/HSKDataService';

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
    }

    // ============================================================
    // HEADER
    // ============================================================

    private createHeader(): void {

        const width = this.scale.width;

        this.add.text(
            width / 2,
            48,
            'WORD',
            {
                fontFamily: 'Arial',
                fontSize: '34px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            86,
            this.level,
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                fontStyle: 'bold',
                color: '#4E9F3D',
            }
        ).setOrigin(0.5);
    }

    // ============================================================
    // WORD CARD
    // ============================================================

    private createWordCard(): void {

        const width = this.scale.width;

        const cardWidth = 620;
        const cardHeight = 430;

        const cardX = width / 2;
        const cardY = 365;

        // --------------------------------------------------------
        // Shadow
        // --------------------------------------------------------

        const shadow = this.add.rectangle(
            cardX,
            cardY + 8,
            cardWidth,
            cardHeight,
            0xD8CCB8
        );

        shadow.setOrigin(0.5);

        // --------------------------------------------------------
        // Card
        // --------------------------------------------------------

        const card = this.add.rectangle(
            cardX,
            cardY,
            cardWidth,
            cardHeight,
            UIColors.card
        );

        card
            .setOrigin(0.5)
            .setStrokeStyle(
                2,
                UIColors.cardBorder
            );

        // --------------------------------------------------------
        // Word number
        // --------------------------------------------------------

        this.add.text(
            cardX - 270,
            cardY - 175,
            `#${this.word.sort}`,
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#98A2B3',
            }
        ).setOrigin(0, 0.5);

        // --------------------------------------------------------
        // Hanzi
        // --------------------------------------------------------

        this.add.text(
            cardX,
            cardY - 105,
            this.word.word,
            {
                fontFamily: 'Arial',
                fontSize: '76px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        // --------------------------------------------------------
        // Pinyin
        // --------------------------------------------------------

        this.add.text(
            cardX,
            cardY - 20,
            this.word.pinyin,
            {
                fontFamily: 'Arial',
                fontSize: '27px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        // --------------------------------------------------------
        // Type
        // --------------------------------------------------------

        const type = this.getPartOfSpeech(
            this.word.cixing
        );

        const typeBackground = this.add.rectangle(
            cardX,
            cardY + 42,
            230,
            42,
            UIColors.backgroundAlt
        )
            .setOrigin(0.5)
            .setStrokeStyle(
                1,
                UIColors.cardBorder
            );

        this.add.text(
            cardX,
            cardY + 42,
            type,
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                fontStyle: 'bold',
                color: '#4E9F3D',
            }
        ).setOrigin(0.5);

        // --------------------------------------------------------
        // Divider
        // --------------------------------------------------------

        this.add.rectangle(
            cardX,
            cardY + 85,
            500,
            1,
            UIColors.cardBorder
        );

        // --------------------------------------------------------
        // Meaning placeholder
        // --------------------------------------------------------

        this.add.text(
            cardX,
            cardY + 125,
            'Meaning',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#98A2B3',
            }
        ).setOrigin(0.5);

        this.add.text(
            cardX,
            cardY + 155,
            'Meaning data will be added later',
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#667085',
            }
        ).setOrigin(0.5);
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

                const key = item.trim();

                return map[key] ?? key;
            })
            .join(' / ');
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
                    'VocabularyScene',
                    {
                        level: this.level,
                    }
                );

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