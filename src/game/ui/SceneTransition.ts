import * as Phaser from 'phaser';

const FADE_OUT_MS = 180;
const FADE_IN_MS = 220;

/**
 * Fades the current scene's camera out, then starts the target scene.
 * Use this instead of `scene.scene.start(...)` for menu navigation so
 * transitions feel like deliberate scene changes rather than instant cuts.
 */
export function goToScene(
    scene: Phaser.Scene,
    key: string,
    data?: object
): void {

    scene.cameras.main.fadeOut(FADE_OUT_MS, 0, 0, 0);

    scene.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
            scene.scene.start(key, data);
        }
    );
}

/**
 * Fades the scene's camera in from black. Call once at the top of a
 * scene's `create()` so it arrives smoothly instead of popping in.
 */
export function fadeInScene(scene: Phaser.Scene): void {
    scene.cameras.main.fadeIn(FADE_IN_MS, 0, 0, 0);
}
