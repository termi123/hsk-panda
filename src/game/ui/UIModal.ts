import * as Phaser from 'phaser';
import { UIColors } from './UIColors';

export class UIModal {
    private scene: Phaser.Scene;

    private overlay?: Phaser.GameObjects.Rectangle;
    private container?: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public showComingSoon(): void {
        if (this.container) {
            return;
        }

        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        // --------------------------------------------------
        // Full screen blocker
        // --------------------------------------------------

        this.overlay = this.scene.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            UIColors.overlay,
            0.62
        );

        this.overlay
            .setDepth(1000)
            .setInteractive();

        // --------------------------------------------------
        // Modal
        // --------------------------------------------------

        this.container = this.scene.add.container(
            width / 2,
            height / 2
        );

        this.container.setDepth(1001);

        const shadow = this.scene.add.rectangle(
            0,
            8,
            430,
            270,
            0xC5B8A2
        );

        const card = this.scene.add.rectangle(
            0,
            0,
            430,
            270,
            UIColors.card
        );

        card.setStrokeStyle(
            3,
            UIColors.cardBorder
        );

        const title = this.scene.add.text(
            0,
            -72,
            'COMING SOON',
            {
                fontFamily: 'Arial',
                fontSize: '30px',
                fontStyle: 'bold',
                color: '#263238',
            }
        );

        title.setOrigin(0.5);

        const message = this.scene.add.text(
            0,
            -18,
            'This feature is still being prepared.\nCheck back soon!',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                color: '#667085',
                align: 'center',
                lineSpacing: 8,
            }
        );

        message.setOrigin(0.5);

        // --------------------------------------------------
        // OK button
        // --------------------------------------------------

        const buttonShadow = this.scene.add.rectangle(
            0,
            79,
            150,
            50,
            UIColors.primaryDark
        );

        buttonShadow.setOrigin(0.5);

        const button = this.scene.add.rectangle(
            0,
            74,
            150,
            50,
            UIColors.primary
        );

        button
            .setOrigin(0.5)
            .setStrokeStyle(2, UIColors.primaryDark)
            .setInteractive({ useHandCursor: true });

        const buttonText = this.scene.add.text(
            0,
            74,
            'OK',
            {
                fontFamily: 'Arial',
                fontSize: '17px',
                fontStyle: 'bold',
                color: '#FFFFFF',
            }
        );

        buttonText.setOrigin(0.5);

        // Hover
        button.on('pointerover', () => {
            button.setFillStyle(0x5CAF49);
        });

        button.on('pointerout', () => {
            button.setFillStyle(UIColors.primary);
        });

        // Click
        button.on('pointerdown', () => {
            this.hide();
        });

        this.container.add([
            shadow,
            card,
            title,
            message,
            buttonShadow,
            button,
            buttonText,
        ]);

        // Animation
        this.container.setScale(0.92);
        this.container.setAlpha(0);

        this.scene.tweens.add({
            targets: this.container,
            scale: 1,
            alpha: 1,
            duration: 180,
            ease: 'Back.Out',
        });
    }

    public hide(): void {
        if (!this.container) {
            return;
        }

        const container = this.container;
        const overlay = this.overlay;

        this.container = undefined;
        this.overlay = undefined;

        this.scene.tweens.add({
            targets: container,
            scale: 0.96,
            alpha: 0,
            duration: 120,
            ease: 'Quad.easeIn',
            onComplete: () => {
                container.destroy();
            },
        });

        this.scene.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: 120,
            onComplete: () => {
                overlay?.destroy();
            },
        });
    }

    public isVisible(): boolean {
        return !!this.container;
    }
}