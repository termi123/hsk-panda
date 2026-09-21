import * as Phaser from 'phaser';
import { UIButton } from '../../../ui/UIButton';
import { UIColors } from '../../../ui/UIColors';
import { fadeInScene, goToScene } from '../../../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
    HSKVocabulary,
} from '../../../../services/HSKDataService';
import { RunnerQuestion } from './RunnerTypes';

export default class RunnerScene extends Phaser.Scene {

    private level!: HSKLevel;

    // =========================
    // GAME STATE
    // =========================

    private score: number = 0;
    private distance: number = 0;
    private lives: number = 3;

    private speed: number = 260;
    private readonly maxSpeed: number = 620;

    private gameOver: boolean = false;
    private questionActive: boolean = false;
    private jumping: boolean = false;

    private questionTimer: number = 0;
    private obstacleTimer: number = 0;

    private currentQuestion?: RunnerQuestion;

    // =========================
    // GAME OBJECTS
    // =========================

    private panda!: Phaser.GameObjects.Container;

    private pandaBody!: Phaser.GameObjects.Arc;

    private groundY: number = 0;

    private obstacles: Phaser.GameObjects.Container[] = [];

    private backgroundObjects: Phaser.GameObjects.GameObject[] = [];

    // =========================
    // UI
    // =========================

    private scoreText!: Phaser.GameObjects.Text;
    private distanceText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;

    private questionPanel?: Phaser.GameObjects.Container;

    private answerButtons: UIButton[] = [];

    constructor() {
        super('RunnerScene');
    }

    init(data: {
        level: HSKLevel;
    }): void {

        this.level = data.level;
    }

    create(): void {

        fadeInScene(this);

        this.groundY = this.scale.height - 130;

        this.createBackground();
        this.createHeader();
        this.createGround();
        this.createPanda();

        this.registerInput();

        this.scheduleNextObstacle();
        this.scheduleNextQuestion();
    }

    // =========================================================
    // UPDATE
    // =========================================================

    update(
        _time: number,
        delta: number
    ): void {

        if (this.gameOver) {
            return;
        }

        const dt = delta / 1000;

        // Increase distance.
        this.distance += this.speed * dt / 10;

        // Gradually increase speed.
        this.speed = Math.min(
            this.maxSpeed,
            this.speed + dt * 5
        );

        this.updateUI();

        if (!this.questionActive) {

            this.updateObstacles(dt);
            this.updateBackground(dt);

            this.obstacleTimer -= delta;

            if (this.obstacleTimer <= 0) {
                this.createObstacle();
                this.scheduleNextObstacle();
            }

            this.questionTimer -= delta;

            if (this.questionTimer <= 0) {
                this.showQuestion();
                this.scheduleNextQuestion();
            }
        }

        this.updatePandaAnimation(dt);
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

        // Sky decorations.
        this.add.circle(
            width * 0.15,
            height * 0.20,
            70,
            UIColors.yellow,
            0.18
        );

        this.add.circle(
            width * 0.82,
            height * 0.18,
            95,
            UIColors.secondary,
            0.08
        );

        // Mountains.
        for (let i = 0; i < 7; i++) {

            const x = i * 220;
            const y = this.groundY - 90;

            const mountain = this.add.triangle(
                x,
                y,
                0,
                180,
                110,
                0,
                220,
                180,
                UIColors.primary,
                0.12
            );

            this.backgroundObjects.push(mountain);
        }

        // Bamboo decorations.
        for (let i = 0; i < 10; i++) {

            const x = i * 150 + 40;

            const bamboo = this.add.rectangle(
                x,
                this.groundY - 85,
                14,
                170,
                UIColors.primary,
                0.22
            );

            this.backgroundObjects.push(bamboo);
        }
    }

    private updateBackground(dt: number): void {

        const movement =
            this.speed * dt * 0.18;

        this.backgroundObjects.forEach(object => {

            if (!('x' in object)) {
                return;
            }

            const displayObject =
                object as Phaser.GameObjects.GameObject & {
                    x: number;
                };

            displayObject.x -= movement;

            if (displayObject.x < -250) {
                displayObject.x += 1600;
            }
        });
    }

    // =========================================================
    // GROUND
    // =========================================================

    private createGround(): void {

        const width = this.scale.width;

        this.add.rectangle(
            width / 2,
            this.groundY + 45,
            width,
            90,
            UIColors.primary,
            0.15
        );

        this.add.rectangle(
            width / 2,
            this.groundY + 2,
            width,
            5,
            UIColors.primaryDark
        );
    }

    // =========================================================
    // PANDA
    // =========================================================

    private createPanda(): void {

        const x = Math.min(
            180,
            this.scale.width * 0.18
        );

        const y = this.groundY - 55;

        this.panda =
            this.add.container(
                x,
                y
            );

        // Body.
        this.pandaBody =
            this.add.circle(
                0,
                0,
                34,
                0xFFFFFF
            );

        this.panda.add(
            this.pandaBody
        );

        // Ears.
        const leftEar =
            this.add.circle(
                -24,
                -28,
                13,
                0x263238
            );

        const rightEar =
            this.add.circle(
                24,
                -28,
                13,
                0x263238
            );

        this.panda.add([
            leftEar,
            rightEar,
        ]);

        // Eye patches.
        const leftPatch =
            this.add.ellipse(
                -13,
                -5,
                15,
                22,
                0x263238,
                1
            );

        const rightPatch =
            this.add.ellipse(
                13,
                -5,
                15,
                22,
                0x263238,
                1
            );

        this.panda.add([
            leftPatch,
            rightPatch,
        ]);

        // Eyes.
        const leftEye =
            this.add.circle(
                -12,
                -7,
                4,
                0xFFFFFF
            );

        const rightEye =
            this.add.circle(
                12,
                -7,
                4,
                0xFFFFFF
            );

        this.panda.add([
            leftEye,
            rightEye,
        ]);

        // Nose.
        const nose =
            this.add.circle(
                0,
                7,
                4,
                0x263238
            );

        this.panda.add(nose);

        // Feet.
        const leftFoot =
            this.add.ellipse(
                -17,
                35,
                22,
                12,
                0x263238
            );

        const rightFoot =
            this.add.ellipse(
                17,
                35,
                22,
                12,
                0x263238
            );

        this.panda.add([
            leftFoot,
            rightFoot,
        ]);

        // Small running animation.
        this.tweens.add({
            targets: this.panda,
            y: y - 5,
            duration: 220,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    private updatePandaAnimation(
        _dt: number
    ): void {

        if (this.jumping) {
            return;
        }

        this.pandaBody.rotation += 0.001;
    }

    // =========================================================
    // INPUT
    // =========================================================

    private registerInput(): void {

        this.input.keyboard?.on(
            'keydown-SPACE',
            this.handleSpace,
            this
        );

        this.input.on(
            'pointerdown',
            this.handlePointerDown,
            this
        );
    }

    private handleSpace(): void {

        this.jump();
    }

    private handlePointerDown(): void {

        if (
            !this.questionActive &&
            !this.gameOver
        ) {
            this.jump();
        }
    }

    // =========================================================
    // JUMP
    // =========================================================

    private jump(): void {

        if (
            this.jumping ||
            this.questionActive ||
            this.gameOver
        ) {
            return;
        }

        this.jumping = true;

        const startY =
            this.panda.y;

        this.tweens.add({
            targets: this.panda,
            y: startY - 150,
            duration: 300,
            ease: 'Quad.easeOut',
            yoyo: true,
            hold: 30,

            onComplete: () => {
                this.jumping = false;
            },
        });
    }

    // =========================================================
    // OBSTACLES
    // =========================================================

    private scheduleNextObstacle(): void {

        const min = 900;
        const max = 1700;

        this.obstacleTimer =
            Phaser.Math.Between(
                min,
                max
            );
    }

    private createObstacle(): void {

        if (
            this.gameOver ||
            this.questionActive
        ) {
            return;
        }

        const x =
            this.scale.width + 80;

        const obstacle =
            this.add.container(
                x,
                this.groundY
            );

        const rock =
            this.add.rectangle(
                0,
                -28,
                55,
                55,
                UIColors.textSecondary
            );

        rock.setStrokeStyle(
            3,
            UIColors.text
        );

        obstacle.add(rock);

        this.obstacles.push(
            obstacle
        );
    }

    private updateObstacles(
        dt: number
    ): void {

        for (
            let i = this.obstacles.length - 1;
            i >= 0;
            i--
        ) {

            const obstacle =
                this.obstacles[i];

            obstacle.x -=
                this.speed * dt;

            if (
                obstacle.x < -100
            ) {

                obstacle.destroy();

                this.obstacles.splice(
                    i,
                    1
                );

                continue;
            }

            if (
                !this.jumping &&
                this.checkObstacleCollision(
                    obstacle
                )
            ) {

                this.hitObstacle(
                    obstacle
                );

                obstacle.destroy();

                this.obstacles.splice(
                    i,
                    1
                );
            }
        }
    }

    private checkObstacleCollision(
        obstacle: Phaser.GameObjects.Container
    ): boolean {

        const pandaLeft =
            this.panda.x - 25;

        const pandaRight =
            this.panda.x + 25;

        const obstacleLeft =
            obstacle.x - 28;

        const obstacleRight =
            obstacle.x + 28;

        return (
            pandaRight > obstacleLeft &&
            pandaLeft < obstacleRight
        );
    }

    private hitObstacle(
        _obstacle: Phaser.GameObjects.Container
    ): void {

        if (this.gameOver) {
            return;
        }

        this.lives--;

        this.cameras.main.shake(
            180,
            0.008
        );

        this.tweens.add({
            targets: this.panda,
            alpha: 0.25,
            duration: 90,
            yoyo: true,
            repeat: 3,
        });

        if (this.lives <= 0) {
            this.endGame();
        }
    }

    // =========================================================
    // QUESTIONS
    // =========================================================

    private scheduleNextQuestion(): void {

        this.questionTimer =
            Phaser.Math.Between(
                6500,
                9500
            );
    }

    private showQuestion(): void {

        if (
            this.gameOver ||
            this.questionActive
        ) {
            return;
        }

        this.questionActive = true;

        this.clearQuestion();

        this.currentQuestion =
            this.createQuestion();

        const width =
            this.scale.width;

        const height =
            this.scale.height;

        this.questionPanel =
            this.add.container(
                width / 2,
                height / 2
            );

        const panelWidth =
            Math.min(
                760,
                width - 80
            );

        const panelHeight = 410;

        const panel =
            this.add.rectangle(
                0,
                0,
                panelWidth,
                panelHeight,
                UIColors.card
            );

        panel.setStrokeStyle(
            3,
            UIColors.cardBorder
        );

        this.questionPanel.add(
            panel
        );

        // =====================================================
        // TITLE
        // =====================================================

        const title =
            this.add.text(
                0,
                -160,
                'QUICK! CHOOSE THE PINYIN',
                {
                    fontFamily: 'Arial',
                    fontSize: '22px',
                    fontStyle: 'bold',
                    color: '#263238',
                }
            ).setOrigin(0.5);

        this.questionPanel.add(
            title
        );

        // =====================================================
        // WORD
        // =====================================================

        const wordText =
            this.add.text(
                0,
                -75,
                this.currentQuestion.word.word,
                {
                    fontFamily: 'Arial',
                    fontSize: '64px',
                    fontStyle: 'bold',
                    color: '#263238',
                }
            ).setOrigin(0.5);

        this.questionPanel.add(
            wordText
        );

        // =====================================================
        // INSTRUCTION
        // =====================================================

        const instruction =
            this.add.text(
                0,
                -20,
                'Select the correct pronunciation',
                {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: '#667085',
                }
            ).setOrigin(0.5);

        this.questionPanel.add(
            instruction
        );

        // =====================================================
        // ANSWER BUTTONS
        // =====================================================

        /*
         * Keep the buttons inside the panel.
         *
         * Layout:
         *
         *     [       ] [       ]
         *
         *     [       ] [       ]
         *
         * The column positions are calculated from panelWidth,
         * so the layout stays centered when RESIZE changes.
         */

        const horizontalGap = 20;

        const buttonWidth = Math.min(
            280,
            (panelWidth - 60) / 2
        );

        const leftX =
            -(buttonWidth / 2) -
            (horizontalGap / 2);

        const rightX =
            (buttonWidth / 2) +
            (horizontalGap / 2);

        const positions: [number, number][] = [
            [leftX, 65],
            [rightX, 65],
            [leftX, 145],
            [rightX, 145],
        ];

        this.currentQuestion.options.forEach(
            (option, index) => {

                const [x, y] =
                    positions[index];

                const button =
                    new UIButton(
                        this,
                        x,
                        y,
                        option,
                        () => {
                            this.selectAnswer(
                                index
                            );
                        },
                        {
                            width: buttonWidth,
                            height: 58,
                            color: UIColors.card,
                            darkColor:
                                UIColors.cardBorder,
                            textColor:
                                UIColors.text,
                            fontSize: 18,
                        }
                    );

                this.answerButtons.push(
                    button
                );
            }
        );
    }

    private createQuestion(): RunnerQuestion {

        const word =
            HSKDataService.getRandomWord(
                this.level
            );

        const vocabulary =
            HSKDataService.getVocabulary(
                this.level
            );

        const wrongWords =
            vocabulary
                .filter(
                    (item: HSKVocabulary) =>
                        item.word !== word.word &&
                        item.pinyin !== word.pinyin
                )
                .sort(
                    () => Math.random() - 0.5
                )
                .slice(0, 3);

        const options: string[] = [
            word.pinyin,
            ...wrongWords.map(
                item => item.pinyin
            ),
        ];

        while (
            options.length < 4
        ) {
            options.push(
                word.pinyin
            );
        }

        const shuffled =
            Phaser.Utils.Array.Shuffle(
                options
            );

        return {
            word,
            options: shuffled,
            correctIndex:
                shuffled.indexOf(
                    word.pinyin
                ),
        };
    }

    private selectAnswer(
        index: number
    ): void {

        if (
            !this.questionActive ||
            !this.currentQuestion
        ) {
            return;
        }

        const correct =
            index ===
            this.currentQuestion.correctIndex;

        if (correct) {

            this.score += 100;

            this.showAnswerFeedback(
                true
            );

        } else {

            this.lives--;

            this.showAnswerFeedback(
                false
            );

            if (this.lives <= 0) {

                this.time.delayedCall(
                    700,
                    () => {

                        if (!this.gameOver) {
                            this.endGame();
                        }

                    }
                );

                return;
            }
        }

        this.time.delayedCall(
            650,
            () => {

                if (!this.gameOver) {

                    this.clearQuestion();

                    this.questionActive =
                        false;
                }

            }
        );
    }

    private showAnswerFeedback(
        correct: boolean
    ): void {

        if (!this.questionPanel) {
            return;
        }

        const feedback =
            this.add.text(
                0,
                -125,
                correct
                    ? '+100  GREAT!'
                    : 'WRONG!',
                {
                    fontFamily: 'Arial',
                    fontSize: 25,
                    fontStyle: 'bold',
                    color: correct
                        ? '#36752B'
                        : '#B94343',
                }
            ).setOrigin(0.5);

        this.questionPanel.add(
            feedback
        );

        if (correct) {

            this.tweens.add({
                targets: feedback,
                y: -145,
                alpha: 0,
                duration: 650,
            });
        }
    }

    private clearQuestion(): void {

        this.answerButtons.forEach(
            button => {

                try {
                    button.destroy();
                } catch {
                    // Ignore already-destroyed buttons.
                }

            }
        );

        this.answerButtons = [];

        this.questionPanel?.destroy();

        this.questionPanel =
            undefined;

        this.currentQuestion =
            undefined;
    }

    // =========================================================
    // UI
    // =========================================================

    private createHeader(): void {

        const width =
            this.scale.width;

        this.scoreText =
            this.add.text(
                40,
                30,
                'SCORE 0',
                {
                    fontFamily: 'Arial',
                    fontSize: 20,
                    fontStyle: 'bold',
                    color: '#263238',
                }
            );

        this.distanceText =
            this.add.text(
                width / 2,
                30,
                '0 m',
                {
                    fontFamily: 'Arial',
                    fontSize: 20,
                    fontStyle: 'bold',
                    color: '#263238',
                }
            ).setOrigin(0.5);

        this.livesText =
            this.add.text(
                width - 40,
                30,
                '♥ ♥ ♥',
                {
                    fontFamily: 'Arial',
                    fontSize: 20,
                    fontStyle: 'bold',
                    color: '#B94343',
                }
            ).setOrigin(1, 0);
    }

    private updateUI(): void {

        if (!this.scoreText) {
            return;
        }

        this.scoreText.setText(
            `SCORE ${this.score}`
        );

        this.distanceText.setText(
            `${Math.floor(
                this.distance
            )} m`
        );

        const hearts =
            '♥ '.repeat(
                Math.max(
                    0,
                    this.lives
                )
            ).trim();

        this.livesText.setText(
            hearts || '—'
        );
    }

    // =========================================================
    // GAME OVER
    // =========================================================

    private endGame(): void {

        if (this.gameOver) {
            return;
        }

        this.gameOver = true;
        this.questionActive = false;
        this.jumping = false;

        this.clearQuestion();

        // Stop all running gameplay tweens.
        this.tweens.killTweensOf(
            this.panda
        );

        // Remove all obstacles.
        this.obstacles.forEach(
            obstacle =>
                obstacle.destroy()
        );

        this.obstacles = [];

        const width =
            this.scale.width;

        const height =
            this.scale.height;

        // =====================================================
        // OVERLAY
        // =====================================================

        const overlay =
            this.add.rectangle(
                width / 2,
                height / 2,
                width,
                height,
                UIColors.overlay,
                0.78
            );

        overlay.setDepth(100);

        // =====================================================
        // GAME OVER TEXT
        // =====================================================

        this.add.text(
            width / 2,
            height / 2 - 120,
            'GAME OVER',
            {
                fontFamily: 'Arial',
                fontSize: 48,
                fontStyle: 'bold',
                color: '#FFFFFF',
            }
        )
            .setOrigin(0.5)
            .setDepth(101);

        this.add.text(
            width / 2,
            height / 2 - 55,
            `${this.level}  •  ${Math.floor(
                this.distance
            )} m`,
            {
                fontFamily: 'Arial',
                fontSize: 20,
                color: '#FFFFFF',
            }
        )
            .setOrigin(0.5)
            .setDepth(101);

        this.add.text(
            width / 2,
            height / 2 - 15,
            `SCORE  ${this.score}`,
            {
                fontFamily: 'Arial',
                fontSize: 26,
                fontStyle: 'bold',
                color: '#FFFFFF',
            }
        )
            .setOrigin(0.5)
            .setDepth(101);

        // =====================================================
        // PLAY AGAIN
        // =====================================================

        const playAgain =
            new UIButton(
                this,
                width / 2 - 130,
                height / 2 + 80,
                'PLAY AGAIN',
                () => {

                    /*
                     * IMPORTANT:
                     * Restart the actual Phaser scene instead
                     * of routing through goToScene().
                     *
                     * This completely resets:
                     * - gameOver
                     * - score
                     * - distance
                     * - lives
                     * - speed
                     * - obstacles
                     * - timers
                     * - jumping
                     * - question state
                     * - input listeners
                     * - tweens
                     */
                    this.scene.restart({
                        level: this.level,
                    });

                },
                {
                    width: 210,
                    height: 55,
                    color: UIColors.primary,
                    darkColor:
                        UIColors.primaryDark,
                    fontSize: 17,
                }
            );

        /*
         * UIButton is already a self-contained UI object.
         * Do not cast it to Container.
         *
         * Phaser renders it after the overlay because it is
         * created after the overlay, so it stays clickable.
         */
        void playAgain;

        // =====================================================
        // BACK
        // =====================================================

        const back =
            new UIButton(
                this,
                width / 2 + 130,
                height / 2 + 80,
                'BACK',
                () => {

                    goToScene(
                        this,
                        'HSKRunnerMenu'
                    );

                },
                {
                    width: 160,
                    height: 55,
                    color: UIColors.card,
                    darkColor:
                        UIColors.cardBorder,
                    textColor:
                        UIColors.text,
                    fontSize: 17,
                }
            );

        void back;
    }
}