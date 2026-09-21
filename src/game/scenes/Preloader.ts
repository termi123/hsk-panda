import { Scene } from 'phaser';
import { UIColors } from '../ui/UIColors';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.rectangle(width / 2, height / 2, width, height, UIColors.background);

        this.add.text(width / 2, height / 2 - 60, 'HSK PANDA', {
            fontFamily: 'Arial',
            fontSize: '38px',
            fontStyle: 'bold',
            color: '#263238',
        }).setOrigin(0.5);

        //  Progress bar outline.
        this.add.rectangle(width / 2, height / 2 + 20, 300, 14, 0, 0)
            .setStrokeStyle(2, UIColors.cardBorder);

        //  Progress bar fill. Grows from the left based on load progress.
        const bar = this.add.rectangle(
            width / 2 - 148,
            height / 2 + 20,
            4,
            10,
            UIColors.primary
        );

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (292 * progress);
        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.scene.start('MainMenu');
    }
}
