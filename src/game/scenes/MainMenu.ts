import * as Phaser from 'phaser';
import { UIButton } from '../ui/UIButton';
import { UIColors } from '../ui/UIColors';
import { UIModal } from '../ui/UIModal';
import { fadeInScene, goToScene } from '../ui/SceneTransition';

export default class MainMenu extends Phaser.Scene {

    private modal!: UIModal;

    constructor() {
        super('MainMenu');
    }

    create(): void {
        const width = this.scale.width;
        const height = this.scale.height;

        fadeInScene(this);

        this.modal = new UIModal(this);

        this.createBackground();

        // --------------------------------------------------
        // Header
        // --------------------------------------------------

        this.add.text(
            width / 2,
            72,
            'HSK PANDA',
            {
                fontFamily: 'Arial',
                fontSize: '52px',
                fontStyle: 'bold',
                color: '#263238',
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            120,
            'Learn Chinese. Play. Grow.',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#667085',
            }
        ).setOrigin(0.5);

        // --------------------------------------------------
        // Panda
        // --------------------------------------------------

        this.createPanda();

        // --------------------------------------------------
        // Main actions
        // --------------------------------------------------

        new UIButton(
            this,
            width / 2,
            385,
            'PLAY',
            () => {
                goToScene(this, 'GamesMenu');
            },
            {
                width: 390,
                height: 78,
                color: UIColors.primary,
                darkColor: UIColors.primaryDark,
                fontSize: 27,
            }
        );

        new UIButton(
            this,
            width / 2,
            485,
            'VOCABULARY',
            () => {
                goToScene(this, 'VocabularyMenu');
            },
            {
                width: 390,
                height: 68,
                color: UIColors.secondary,
                darkColor: UIColors.secondaryDark,
                fontSize: 21,
            }
        );

        new UIButton(
            this,
            width / 2,
            575,
            'ACHIEVEMENTS',
            () => {
                this.modal.showComingSoon();
            },
            {
                width: 390,
                height: 62,
                color: UIColors.yellow,
                darkColor: UIColors.yellowDark,
                textColor: UIColors.text,
                fontSize: 19,
            }
        );

        // --------------------------------------------------
        // Footer
        // --------------------------------------------------

        this.add.text(
            width / 2,
            height - 28,
            'HSK Panda  •  v0.1',
            {
                fontFamily: 'Arial',
                fontSize: '13px',
                color: '#98A2B3',
            }
        ).setOrigin(0.5);
    }

    // ======================================================
    // Background
    // ======================================================

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

        // Decorative shapes

        this.add.circle(
            60,
            100,
            150,
            UIColors.yellow,
            0.10
        );

        this.add.circle(
            width - 80,
            120,
            110,
            UIColors.secondary,
            0.08
        );

        this.add.circle(
            width - 60,
            height - 60,
            190,
            UIColors.primary,
            0.07
        );

        this.add.circle(
            80,
            height - 100,
            100,
            UIColors.orange,
            0.07
        );
    }

    // ======================================================
    // Panda
    // ======================================================

    private createPanda(): void {
        const width = this.scale.width;

        const panda = this.add.container(
            width / 2,
            235
        );

        // Body
        const body = this.add.circle(
            0,
            40,
            48,
            UIColors.text
        );

        // Head
        const head = this.add.circle(
            0,
            -18,
            58,
            UIColors.white
        );

        // Ears
        const leftEar = this.add.circle(
            -42,
            -58,
            20,
            UIColors.text
        );

        const rightEar = this.add.circle(
            42,
            -58,
            20,
            UIColors.text
        );

        // Eye patches
        const leftPatch = this.add.ellipse(
            -21,
            -20,
            18,
            28,
            UIColors.text
        );

        const rightPatch = this.add.ellipse(
            21,
            -20,
            18,
            28,
            UIColors.text
        );

        // Eyes
        const leftEye = this.add.circle(
            -21,
            -20,
            5,
            UIColors.white
        );

        const rightEye = this.add.circle(
            21,
            -20,
            5,
            UIColors.white
        );

        // Nose
        const nose = this.add.circle(
            0,
            0,
            6,
            UIColors.text
        );

        // Mouth
        const mouth = this.add.arc(
            0,
            5,
            12,
            10,
            20,
            160,
            false,
            UIColors.text
        );

        panda.add([
            body,
            head,
            leftEar,
            rightEar,
            leftPatch,
            rightPatch,
            leftEye,
            rightEye,
            nose,
            mouth,
        ]);

        // Idle animation
        this.tweens.add({
            targets: panda,
            y: 228,
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }
}