import * as Phaser from 'phaser';
import { UIButton } from '../../../../../ui/UIButton';
import { UIColors } from '../../../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../../../ui/SceneTransition';
import { HSKLevel } from '../../../../../../services/HSKDataService';
import { HSKGrammar } from '../../../../../../types/HSKTypes';
import {
    mapGrammarType,
    mapGrammarCategory,
} from '../../../../../utils/GrammarUtils';

export default class GrammarDetailScene extends Phaser.Scene {

    private level!: HSKLevel;
    private grammar!: HSKGrammar;
    private grammarNumber!: number;

    constructor() {
        super('GrammarDetailScene');
    }

    init(data: {
        level: HSKLevel;
        grammar: HSKGrammar;
        number?: number;
    }): void {

        this.level = data.level;
        this.grammar = data.grammar;
        this.grammarNumber = data.number ?? 0;
    }

    create(): void {

        fadeInScene(this);

        this.createBackground();
        this.createHeader();
        this.createGrammarCard();
        this.createBackButton();
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
    }

    // ============================================================
    // GRAMMAR CARD
    // ============================================================

    private createGrammarCard(): void {

        const width = this.scale.width;

        const cardWidth = 820;
        const cardHeight = 500;

        const cardX = width / 2;
        const cardY = 385;

        // --------------------------------------------------------
        // Shadow
        // --------------------------------------------------------

        this.add.rectangle(
            cardX,
            cardY + 8,
            cardWidth,
            cardHeight,
            0xD8CCB8
        ).setOrigin(0.5);

        // --------------------------------------------------------
        // Card
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // Number
        // --------------------------------------------------------

        if (this.grammarNumber > 0) {

            this.add.text(
                cardX - 365,
                cardY - 215,
                `#${this.grammarNumber}`,
                {
                    fontFamily: 'Arial',
                    fontSize: '13px',
                    color: '#98A2B3',
                }
            ).setOrigin(0, 0.5);
        }

        // --------------------------------------------------------
        // Grammar content
        // --------------------------------------------------------

        this.add.text(
            cardX,
            cardY - 170,
            this.cleanText(
                this.grammar.content
            ),
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                fontStyle: 'bold',
                color: '#263238',
                align: 'center',
                wordWrap: {
                    width: 680,
                },
            }
        ).setOrigin(0.5);

        // --------------------------------------------------------
        // Metadata
        // --------------------------------------------------------

        this.createMetadata(
            cardX,
            cardY - 105
        );

        // --------------------------------------------------------
        // Divider
        // --------------------------------------------------------

        this.add.rectangle(
            cardX,
            cardY - 58,
            700,
            1,
            UIColors.cardBorder
        );

        // --------------------------------------------------------
        // Grammar detail
        // --------------------------------------------------------

        this.add.text(
            cardX - 330,
            cardY - 25,
            'DETAIL',
            {
                fontFamily: 'Arial',
                fontSize: '14px',
                fontStyle: 'bold',
                color: '#5B8DEF',
            }
        ).setOrigin(0, 0.5);

        const detail =
            this.cleanText(
                this.grammar.grammarDetail
            );

        this.add.text(
            cardX - 330,
            cardY + 15,
            detail,
            {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#263238',
                lineSpacing: 7,
                wordWrap: {
                    width: 660,
                },
                maxLines: 5,
            }
        ).setOrigin(0, 0);

        // --------------------------------------------------------
        // Cases
        // --------------------------------------------------------

        const cases =
            this.cleanText(
                this.grammar.cases
            );

        if (
            cases &&
            cases !== '-'
        ) {

            this.add.text(
                cardX - 330,
                cardY + 145,
                'EXAMPLES',
                {
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    fontStyle: 'bold',
                    color: '#5B8DEF',
                }
            ).setOrigin(0, 0.5);

            this.add.text(
                cardX - 330,
                cardY + 180,
                cases,
                {
                    fontFamily: 'Arial',
                    fontSize: '15px',
                    color: '#667085',
                    lineSpacing: 6,
                    wordWrap: {
                        width: 660,
                    },
                    maxLines: 4,
                }
            ).setOrigin(0, 0);
        }
    }

    // ============================================================
    // METADATA
    // ============================================================

    private createMetadata(
        x: number,
        y: number
    ): void {

        const type =
            mapGrammarType(
                this.grammar.grammarType
            );

        const category =
            mapGrammarCategory(
                this.grammar.categoryType
            );

        // Type background

        const typeWidth = 210;

        this.add.rectangle(
            x - 125,
            y,
            typeWidth,
            38,
            0xEEF4FF
        )
            .setOrigin(0.5)
            .setStrokeStyle(
                1,
                0xD6E2FF
            );

        this.add.text(
            x - 125,
            y,
            type,
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                fontStyle: 'bold',
                color: '#5B8DEF',
            }
        ).setOrigin(0.5);

        // Category background

        const categoryWidth = 280;

        this.add.rectangle(
            x + 135,
            y,
            categoryWidth,
            38,
            UIColors.backgroundAlt
        )
            .setOrigin(0.5)
            .setStrokeStyle(
                1,
                UIColors.cardBorder
            );

        this.add.text(
            x + 135,
            y,
            this.truncate(
                category,
                32
            ),
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#667085',
            }
        ).setOrigin(0.5);
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
                    'GrammarScene',
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
    // TEXT HELPERS
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

    private truncate(
        value: string,
        maxLength: number
    ): string {

        if (value.length <= maxLength) {
            return value;
        }

        return (
            value.substring(
                0,
                maxLength - 3
            ) + '...'
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