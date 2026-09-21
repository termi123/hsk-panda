import * as Phaser from 'phaser';
import { UIButton } from '../ui/UIButton';
import { UIColors } from '../ui/UIColors';
import { UIModal } from '../ui/UIModal';

export default class VocabularyMenu extends Phaser.Scene {

    private modal!: UIModal;

    constructor() {
        super('VocabularyMenu');
    }

    create(): void {

        const width = this.scale.width;
        const height = this.scale.height;

        this.modal = new UIModal(this);

        this.createBackground();

        // Header
        this.add.text(
            width / 2,
            72,
            'VOCABULARY',
            {
                fontFamily: 'Arial',
                fontSize: '42px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            116,
            'Build your Chinese vocabulary',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        this.createPanda();

        // Primary action
        new UIButton(
            this,
            width / 2,
            300,
            'LEARN',
            () => {
                this.scene.start('HSKLevelMenu');
            },
            {
                width: 380,
                height: 76,
                color: UIColors.primary,
                darkColor: UIColors.primaryDark,
                fontSize: 25,
            }
        );

        // Secondary actions
        this.createSmallButton(
            width / 2 - 195,
            400,
            'WORDS',
            UIColors.secondary,
            () => this.modal.showComingSoon()
        );

        this.createSmallButton(
            width / 2 + 195,
            400,
            'REVIEW',
            UIColors.orange,
            () => this.modal.showComingSoon()
        );

        this.createSmallButton(
            width / 2 - 195,
            490,
            'MY WORDS',
            UIColors.purple,
            () => this.modal.showComingSoon()
        );

        this.createSmallButton(
            width / 2 + 195,
            490,
            'PROGRESS',
            UIColors.red,
            () => this.modal.showComingSoon()
        );

        // Back
        new UIButton(
            this,
            90,
            height - 48,
            'BACK',
            () => this.goBack(),
            {
                width: 130,
                height: 44,
                color: UIColors.card,
                darkColor: UIColors.cardBorder,
                textColor: UIColors.text,
                fontSize: 15,
            }
        );
    }

    private createSmallButton(
        x: number,
        y: number,
        title: string,
        color: number,
        onClick: () => void
    ): void {

        new UIButton(
            this,
            x,
            y,
            title,
            onClick,
            {
                width: 350,
                height: 72,
                color,
                darkColor: this.darken(color),
                fontSize: 19,
            }
        );
    }

    private createPanda(): void {

        const width = this.scale.width;

        const panda = this.add.container(
            width / 2,
            205
        );

        // body
        const body = this.add.circle(
            0,
            24,
            34,
            UIColors.text
        );

        // head
        const head = this.add.circle(
            0,
            -15,
            38,
            UIColors.white
        );

        // ears
        const leftEar = this.add.circle(
            -28,
            -43,
            13,
            UIColors.text
        );

        const rightEar = this.add.circle(
            28,
            -43,
            13,
            UIColors.text
        );

        // eyes
        const leftEye = this.add.circle(
            -14,
            -18,
            5,
            UIColors.text
        );

        const rightEye = this.add.circle(
            14,
            -18,
            5,
            UIColors.text
        );

        const nose = this.add.circle(
            0,
            -5,
            4,
            UIColors.text
        );

        panda.add([
            body,
            head,
            leftEar,
            rightEar,
            leftEye,
            rightEye,
            nose,
        ]);

        this.tweens.add({
            targets: panda,
            y: 200,
            duration: 1300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
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

        // Decorative circles
        this.add.circle(
            70,
            100,
            130,
            UIColors.yellow,
            0.12
        );

        this.add.circle(
            width - 70,
            height - 100,
            180,
            UIColors.primary,
            0.08
        );

        this.add.circle(
            width - 100,
            120,
            90,
            UIColors.secondary,
            0.08
        );
    }

    private darken(color: number): number {

        const c = Phaser.Display.Color.IntegerToColor(color);

        return Phaser.Display.Color.GetColor(
            Math.max(0, c.red - 35),
            Math.max(0, c.green - 35),
            Math.max(0, c.blue - 35)
        );
    }

    private goBack(): void {
        this.scene.stop('VocabularyMenu');
        this.scene.start('MainMenu');
    }
}