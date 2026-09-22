import * as Phaser from 'phaser';
import { UIButton } from '../../../ui/UIButton';
import { UIColors } from '../../../ui/UIColors';
import { fadeInScene } from '../../../ui/SceneTransition';
import {
    HSKDataService,
    HSKLevel,
    HSKVocabulary,
} from '../../../../services/HSKDataService';
import { GameScoreService } from '../../../../services/GameScoreService';
import { RunnerQuestion } from './RunnerTypes';

export default class RunnerScene extends Phaser.Scene {

    private level!: HSKLevel;

    // =========================
    // GAME STATE
    // =========================

    private score: number = 0;
    private highScore: number = 0;
    private isNewHighScore: boolean = false;

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

    private pandaBaseY: number = 0;

    private pandaRunTween?: Phaser.Tweens.Tween;

    private groundY: number = 0;

    private obstacles:
        Phaser.GameObjects.Container[] = [];

    private backgroundObjects:
        Phaser.GameObjects.GameObject[] = [];

    // =========================
    // UI
    // =========================

    private scoreText!: Phaser.GameObjects.Text;
    private highScoreText!: Phaser.GameObjects.Text;
    private distanceText!: Phaser.GameObjects.Text;
    private livesText!: Phaser.GameObjects.Text;

    private questionPanel?:
        Phaser.GameObjects.Container;

    private answerButtons: UIButton[] = [];

    constructor() {
        super('RunnerScene');
    }

    // =========================================================
    // INIT
    // =========================================================

    init(data: {
        level: HSKLevel;
    }): void {

        this.level =
            data.level;

        this.score = 0;

        this.highScore =
            GameScoreService.getHighScore(
                'runner',
                this.level
            );

        this.isNewHighScore = false;

        this.distance = 0;
        this.lives = 3;

        this.speed = 260;

        this.gameOver = false;
        this.questionActive = false;
        this.jumping = false;

        this.questionTimer = 0;
        this.obstacleTimer = 0;

        this.currentQuestion =
            undefined;

        this.answerButtons = [];
        this.obstacles = [];
        this.backgroundObjects = [];

        this.questionPanel =
            undefined;

        this.pandaRunTween =
            undefined;
    }

    // =========================================================
    // CREATE
    // =========================================================

    create(): void {

        fadeInScene(this);

        this.groundY =
            this.scale.height - 130;

        this.createBackground();
        this.createHeader();
        this.createGround();
        this.createPanda();

        this.registerInput();

        this.scheduleNextObstacle();
        this.scheduleNextQuestion();

        this.updateUI();
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

        const dt =
            delta / 1000;

        // Increase distance.
        this.distance +=
            this.speed * dt / 10;

        // Gradually increase speed.
        this.speed =
            Math.min(
                this.maxSpeed,
                this.speed + dt * 5
            );

        this.updateUI();

        if (!this.questionActive) {

            this.updateObstacles(dt);
            this.updateBackground(dt);

            this.obstacleTimer -= delta;

            if (
                this.obstacleTimer <= 0
            ) {

                this.createObstacle();

                this.scheduleNextObstacle();
            }

            this.questionTimer -= delta;

            if (
                this.questionTimer <= 0
            ) {

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

        const width =
            this.scale.width;

        const height =
            this.scale.height;

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
        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const x =
                i * 220;

            const y =
                this.groundY - 90;

            const mountain =
                this.add.triangle(
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

            this.backgroundObjects.push(
                mountain
            );
        }

        // Bamboo decorations.
        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const x =
                i * 150 + 40;

            const bamboo =
                this.add.rectangle(
                    x,
                    this.groundY - 85,
                    14,
                    170,
                    UIColors.primary,
                    0.22
                );

            this.backgroundObjects.push(
                bamboo
            );
        }
    }

    private updateBackground(
        dt: number
    ): void {

        const movement =
            this.speed *
            dt *
            0.18;

        this.backgroundObjects.forEach(
            object => {

                if (!('x' in object)) {
                    return;
                }

                const displayObject =
                    object as
                        Phaser.GameObjects.GameObject & {
                            x: number;
                        };

                displayObject.x -=
                    movement;

                if (
                    displayObject.x < -250
                ) {

                    displayObject.x +=
                        1600;
                }
            }
        );
    }

    // =========================================================
    // GROUND
    // =========================================================

    private createGround(): void {

        const width =
            this.scale.width;

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

        const x =
            Math.min(
                180,
                this.scale.width * 0.18
            );

        const y =
            this.groundY - 55;

        this.pandaBaseY =
            y;

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

        this.panda.add(
            nose
        );

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

        // Running animation.
        this.pandaRunTween =
            this.tweens.add({
                targets: this.panda,
                y:
                    this.pandaBaseY - 5,
                duration: 220,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
    }

    private updatePandaAnimation(
        _dt: number
    ): void {

        if (
            this.jumping ||
            this.gameOver
        ) {
            return;
        }

        this.pandaBody.rotation +=
            0.001;
    }

    // =========================================================
    // INPUT
    // =========================================================

    private registerInput(): void {

        this.input.keyboard?.off(
            'keydown-SPACE',
            this.handleSpace,
            this
        );

        this.input.off(
            'pointerdown',
            this.handlePointerDown,
            this
        );

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

        if (this.gameOver) {
            return;
        }

        this.jump();
    }

    private handlePointerDown(): void {

        if (this.gameOver) {
            return;
        }

        if (this.questionActive) {
            return;
        }

        this.jump();
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

        this.pandaRunTween?.pause();

        this.panda.y =
            this.pandaBaseY;

        this.tweens.add({
            targets: this.panda,

            y:
                this.pandaBaseY - 150,

            duration: 300,

            ease: 'Quad.easeOut',

            yoyo: true,

            hold: 30,

            onComplete: () => {

                this.panda.y =
                    this.pandaBaseY;

                this.jumping = false;

                if (
                    !this.gameOver
                ) {

                    this.pandaRunTween?.resume();
                }
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

        obstacle.add(
            rock
        );

        this.obstacles.push(
            obstacle
        );
    }

    private updateObstacles(
        dt: number
    ): void {

        for (
            let i =
                this.obstacles.length - 1;
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
        obstacle:
            Phaser.GameObjects.Container
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
            pandaRight >
                obstacleLeft &&
            pandaLeft <
                obstacleRight
        );
    }

    private hitObstacle(
        _obstacle:
            Phaser.GameObjects.Container
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

        if (
            this.lives <= 0
        ) {

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

        this.pandaRunTween?.pause();

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

        const panelHeight =
            410;

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

        const horizontalGap =
            20;

        const buttonWidth =
            Math.min(
                280,
                (panelWidth - 60) / 2
            );

        const totalWidth =
            buttonWidth * 2 +
            horizontalGap;

        const groupCenterX =
            width / 2;

        const leftX =
            groupCenterX -
            totalWidth / 2 +
            buttonWidth / 2;

        const rightX =
            groupCenterX +
            totalWidth / 2 -
            buttonWidth / 2;

        const centerY =
            height / 2;

        const positions:
            [number, number][] = [
                [
                    leftX,
                    centerY + 65,
                ],
                [
                    rightX,
                    centerY + 65,
                ],
                [
                    leftX,
                    centerY + 145,
                ],
                [
                    rightX,
                    centerY + 145,
                ],
            ];

        this.currentQuestion.options.forEach(
            (
                option,
                index
            ) => {

                const [
                    x,
                    y,
                ] =
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
                            width:
                                buttonWidth,
                            height: 58,
                            color:
                                UIColors.card,
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

    // =========================================================
    // CREATE QUESTION
    // =========================================================

    private createQuestion():
        RunnerQuestion {

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
                    (
                        item: HSKVocabulary
                    ) =>
                        item.word !==
                            word.word &&
                        item.pinyin !==
                            word.pinyin
                )
                .sort(
                    () =>
                        Math.random() -
                        0.5
                )
                .slice(
                    0,
                    3
                );

        const options: string[] = [
            word.pinyin,
            ...wrongWords.map(
                item =>
                    item.pinyin
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

    // =========================================================
    // SELECT ANSWER
    // =========================================================

    private selectAnswer(
        index: number
    ): void {

        if (
            !this.questionActive ||
            !this.currentQuestion ||
            this.gameOver
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

            if (
                this.lives <= 0
            ) {

                this.time.delayedCall(
                    700,
                    () => {

                        if (
                            !this.gameOver
                        ) {

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

                if (
                    !this.gameOver
                ) {

                    this.clearQuestion();

                    this.questionActive =
                        false;

                    this.panda.y =
                        this.pandaBaseY;

                    this.pandaRunTween?.resume();

                    this.scheduleNextQuestion();
                }
            }
        );
    }

    // =========================================================
    // ANSWER FEEDBACK
    // =========================================================

    private showAnswerFeedback(
        correct: boolean
    ): void {

        if (
            !this.questionPanel
        ) {
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

    // =========================================================
    // CLEAR QUESTION
    // =========================================================

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

        this.highScoreText =
            this.add.text(
                40,
                58,
                `HIGH ${this.highScore}`,
                {
                    fontFamily: 'Arial',
                    fontSize: 15,
                    fontStyle: 'bold',
                    color: '#667085',
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

        if (
            !this.scoreText
        ) {
            return;
        }

        this.scoreText.setText(
            `SCORE ${this.score}`
        );

        this.highScoreText.setText(
            `HIGH ${Math.max(
                this.highScore,
                this.score
            )}`
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

        this.jumping = false;
        this.questionActive = false;

        // Save Runner score.
        const result =
            GameScoreService.saveScore(
                'runner',
                this.level,
                this.score
            );

        this.highScore =
            result.highScore;

        this.isNewHighScore =
            result.isNewHighScore;

        // Stop timers.
        this.obstacleTimer = 0;
        this.questionTimer = 0;

        // Stop panda running animation.
        this.pandaRunTween?.stop();

        // Stop all scene tweens.
        this.tweens.killAll();

        // Remove gameplay input.
        this.input.keyboard?.off(
            'keydown-SPACE',
            this.handleSpace,
            this
        );

        this.input.off(
            'pointerdown',
            this.handlePointerDown,
            this
        );

        // Remove current question.
        this.clearQuestion();

        // Remove obstacles.
        this.obstacles.forEach(
            obstacle =>
                obstacle.destroy()
        );

        this.obstacles = [];

        const {
            width,
            height,
        } = this.scale;

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
                0.72
            );

        overlay.setDepth(100);

        // =====================================================
        // TITLE
        // =====================================================

        const title =
            this.add.text(
                width / 2,
                height / 2 - 125,
                'GAME OVER',
                {
                    fontFamily: 'Arial',
                    fontSize: 48,
                    fontStyle: 'bold',
                    color: '#FFFFFF',
                }
            );

        title.setOrigin(0.5);
        title.setDepth(101);

        // =====================================================
        // NEW HIGH SCORE
        // =====================================================

        if (
            this.isNewHighScore
        ) {

            const newHighScoreText =
                this.add.text(
                    width / 2,
                    height / 2 - 75,
                    '★ NEW HIGH SCORE!',
                    {
                        fontFamily: 'Arial',
                        fontSize: 22,
                        fontStyle: 'bold',
                        color: '#F7C948',
                    }
                );

            newHighScoreText.setOrigin(0.5);
            newHighScoreText.setDepth(101);
        }

        // =====================================================
        // SCORE
        // =====================================================

        const scoreText =
            this.add.text(
                width / 2,
                height / 2 - 30,
                `Score: ${this.score}`,
                {
                    fontFamily: 'Arial',
                    fontSize: 25,
                    fontStyle: 'bold',
                    color: '#FFFFFF',
                }
            );

        scoreText.setOrigin(0.5);
        scoreText.setDepth(101);

        // =====================================================
        // HIGH SCORE
        // =====================================================

        const highScoreText =
            this.add.text(
                width / 2,
                height / 2 + 5,
                `High Score: ${this.highScore}`,
                {
                    fontFamily: 'Arial',
                    fontSize: 19,
                    color: '#FFFFFF',
                }
            );

        highScoreText.setOrigin(0.5);
        highScoreText.setDepth(101);

        // =====================================================
        // PLAY AGAIN
        // =====================================================

        const playAgain =
            new UIButton(
                this,
                width / 2,
                height / 2 + 80,
                'PLAY AGAIN',
                () => {

                    this.scene.restart({
                        level: this.level,
                    });

                },
                {
                    width: 240,
                    height: 58,
                    color:
                        UIColors.primary,
                    darkColor:
                        UIColors.primaryDark,
                    textColor:
                        UIColors.white,
                    fontSize: 20,
                }
            );

        playAgain.setDepth(101);

        // =====================================================
        // BACK
        // =====================================================

        const backButton =
            new UIButton(
                this,
                width / 2,
                height / 2 + 155,
                'BACK',
                () => {

                    this.scene.start(
                        'HSKRunnerMenu'
                    );

                },
                {
                    width: 180,
                    height: 52,
                    color:
                        UIColors.card,
                    darkColor:
                        UIColors.cardBorder,
                    textColor:
                        UIColors.text,
                    fontSize: 18,
                }
            );

        backButton.setDepth(101);
    }
}