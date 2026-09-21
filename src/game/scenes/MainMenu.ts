import * as Phaser from "phaser";
export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0xf5f1e8);

    // Title
    this.add
      .text(width / 2, 100, "HSK PANDA", {
        fontFamily: "Arial",
        fontSize: "52px",
        color: "#2d2d2d",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(width / 2, 155, "Learn Chinese - Play - Grow", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#777777",
      })
      .setOrigin(0.5);

    // Panda placeholder
    this.add.circle(width / 2, 270, 70, 0xffffff);
    this.add.circle(width / 2 - 30, 235, 18, 0x222222);
    this.add.circle(width / 2 + 30, 235, 18, 0x222222);

    // Eyes
    this.add.circle(width / 2 - 25, 265, 7, 0x222222);
    this.add.circle(width / 2 + 25, 265, 7, 0x222222);

    // Play
    this.createButton(width / 2, 410, 300, 70, "PLAY", () => {
      this.scene.start("GamesMenu");
    });

    // Vocabulary
    this.createButton(width / 2, 500, 300, 60, "VOCABULARY", () => {
      this.scene.start("VocabularyMenu");
    });

    // Achievements
    this.createButton(width / 2, 575, 300, 60, "ACHIEVEMENTS", () => {
      this.showComingSoon("Achievements");
    });

    this.add
      .text(width / 2, height - 25, "HSK Panda v0.1", {
        fontFamily: "Arial",
        fontSize: "14px",
        color: "#999999",
      })
      .setOrigin(0.5);
  }

  private createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    callback: () => void,
  ) {
    const background = this.add.rectangle(x, y, width, height, 0xffffff);

    background
      .setStrokeStyle(2, 0xdddddd)
      .setInteractive({ useHandCursor: true });

    const text = this.add
      .text(x, y, label, {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#333333",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    background.on("pointerover", () => {
      background.setFillStyle(0xe8f5e9);
    });

    background.on("pointerout", () => {
      background.setFillStyle(0xffffff);
    });

    background.on("pointerdown", callback);

    text.setInteractive({ useHandCursor: true });

    text.on("pointerdown", callback);
  }

  private showComingSoon(name: string) {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.5,
    );

    const message = this.add
      .text(width / 2, height / 2, `${name}\n\nComing Soon`, {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    overlay.setInteractive();

    overlay.once("pointerdown", () => {
      overlay.destroy();
      message.destroy();
    });
  }
}
