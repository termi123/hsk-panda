import * as Phaser from 'phaser';
import { UIColors } from './UIColors';

export interface UIButtonOptions {
    width?: number;
    height?: number;
    color?: number;
    darkColor?: number;
    textColor?: number;
    fontSize?: number;
}

export class UIButton extends Phaser.GameObjects.Container {

    private shadow: Phaser.GameObjects.Rectangle;
    private body: Phaser.GameObjects.Rectangle;
    private label: Phaser.GameObjects.Text;

    private enabled = true;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        onClick: () => void,
        options: UIButtonOptions = {}
    ) {
        super(scene, x, y);

        const width = options.width ?? 300;
        const height = options.height ?? 64;

        const color = options.color ?? UIColors.primary;
        const darkColor = options.darkColor ?? UIColors.primaryDark;
        const textColor = options.textColor ?? UIColors.white;

        this.shadow = scene.add.rectangle(
            0,
            5,
            width,
            height,
            darkColor
        );

        this.shadow.setOrigin(0.5);
        this.shadow.setAlpha(0.9);

        this.body = scene.add.rectangle(
            0,
            0,
            width,
            height,
            color
        );

        this.body.setOrigin(0.5);
        this.body.setStrokeStyle(2, darkColor);

        this.label = scene.add.text(
            0,
            0,
            text,
            {
                fontFamily: 'Arial',
                fontSize: `${options.fontSize ?? 20}px`,
                fontStyle: 'bold',
                color: Phaser.Display.Color.IntegerToColor(textColor)
                    .rgba
            }
        );

        this.label.setOrigin(0.5);

        this.add([
            this.shadow,
            this.body,
            this.label,
        ]);

        this.setSize(width, height);

        // Container.displayOrigin is always centered (width/2, height/2),
        // and Phaser shifts every hit-test point by that amount before
        // checking the hit area — so the hit area itself must be defined
        // top-left-based (0, 0, width, height), not centered on (0, 0).
        this.setInteractive(
            new Phaser.Geom.Rectangle(
                0,
                0,
                width,
                height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        this.on('pointerdown', () => {
            if (!this.enabled) return;

            onClick();

            scene.tweens.killTweensOf(this);

            // Quick squash, then spring back with a slight overshoot —
            // reads as a satisfying "press" instead of a flat bounce.
            scene.tweens.add({
                targets: this,
                scaleX: 0.92,
                scaleY: 0.92,
                duration: 70,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    scene.tweens.add({
                        targets: this,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 220,
                        ease: 'Back.easeOut',
                    });
                },
            });
        });

        scene.add.existing(this);
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;

        if (enabled) {
            this.setInteractive();
            this.setAlpha(1);
        } else {
            this.disableInteractive();
            this.setAlpha(0.55);
        }
    }
}