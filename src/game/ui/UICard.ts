import * as Phaser from 'phaser';
import { UIColors } from './UIColors';

export class UICard extends Phaser.GameObjects.Container {

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        title: string,
        subtitle?: string
    ) {
        super(scene, x, y);

        const shadow = scene.add.rectangle(
            0,
            6,
            width,
            height,
            0xD8CCB8
        );

        shadow.setOrigin(0.5);

        const body = scene.add.rectangle(
            0,
            0,
            width,
            height,
            UIColors.card
        );

        body.setOrigin(0.5);
        body.setStrokeStyle(2, UIColors.cardBorder);

        const titleText = scene.add.text(
            0,
            subtitle ? -10 : 0,
            title,
            {
                fontFamily: 'Arial',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#263238',
            }
        );

        titleText.setOrigin(0.5);

        this.add([
            shadow,
            body,
            titleText,
        ]);

        if (subtitle) {
            const subtitleText = scene.add.text(
                0,
                22,
                subtitle,
                {
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    color: '#667085',
                }
            );

            subtitleText.setOrigin(0.5);

            this.add(subtitleText);
        }

        scene.add.existing(this);
    }
}