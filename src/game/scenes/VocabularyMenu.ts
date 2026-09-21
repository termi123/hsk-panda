import * as Phaser from "phaser";

export default class VocabularyMenu extends Phaser.Scene {
  constructor() {
    super("VocabularyMenu");
  }

  create() {
    const { width } = this.scale;

    // Background
    this.cameras.main.setBackgroundColor(0xf5f1e8);

    // Title
    this.add
      .text(width / 2, 80, "VOCABULARY", {
        fontFamily: "Arial",
        fontSize: "42px",
        color: "#2d2d2d",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(width / 2, 125, "Learn Chinese vocabulary", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#666666",
      })
      .setOrigin(0.5);

    // Menu buttons
    this.createMenuButton(
      width / 2,
      220,
      500,
      80,
      "LEARN",
      "Choose your HSK level",
      () => {
        this.showComingSoon("Learn");
      },
    );

    this.createMenuButton(
      width / 2,
      320,
      500,
      80,
      "WORDS",
      "Browse all vocabulary",
      () => {
        this.showComingSoon("Words");
      },
    );

    this.createMenuButton(
      width / 2,
      420,
      500,
      80,
      "MY WORDS",
      "Your saved words",
      () => {
        this.showComingSoon("My Words");
      },
    );

    this.createMenuButton(
      width / 2,
      520,
      500,
      80,
      "REVIEW",
      "Review words you have learned",
      () => {
        this.showComingSoon("Review");
      },
    );

    this.createMenuButton(
      width / 2,
      620,
      500,
      80,
      "PROGRESS",
      "Track your learning progress",
      () => {
        this.showComingSoon("Progress");
      },
    );

    // Back button
    this.createBackButton(width / 2, 715);
  }

  private createMenuButton(
    x: number,
    y: number,
    buttonWidth: number,
    buttonHeight: number,
    title: string,
    subtitle: string,
    callback: () => void,
  ) {
    const background = this.add.rectangle(
      x,
      y,
      buttonWidth,
      buttonHeight,
      0xffffff,
    );

    background.setStrokeStyle(2, 0xd8d2c8);
    background.setInteractive({ useHandCursor: true });

    const titleText = this.add.text(x - buttonWidth / 2 + 25, y - 17, title, {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#2d2d2d",
      fontStyle: "bold",
    });

    const subtitleText = this.add.text(
      x - buttonWidth / 2 + 25,
      y + 12,
      subtitle,
      {
        fontFamily: "Arial",
        fontSize: "15px",
        color: "#777777",
      },
    );

    const arrow = this.add
      .text(x + buttonWidth / 2 - 30, y, ">", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#999999",
      })
      .setOrigin(0.5);

    background.on("pointerover", () => {
      background.setFillStyle(0xf0ebe2);
      background.setStrokeStyle(2, 0xbdb5a8);

      titleText.setColor("#111111");
      arrow.setColor("#555555");
    });

    background.on("pointerout", () => {
      background.setFillStyle(0xffffff);
      background.setStrokeStyle(2, 0xd8d2c8);

      titleText.setColor("#2d2d2d");
      arrow.setColor("#999999");
    });

    background.on("pointerdown", callback);
  }

  private createBackButton(x: number, y: number) {
    const button = this.add
      .text(x, y, "BACK", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#555555",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on("pointerover", () => {
      button.setColor("#222222");
    });

    button.on("pointerout", () => {
      button.setColor("#555555");
    });

    button.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }

  private showComingSoon(feature: string) {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.35,
    );

    const panel = this.add.rectangle(width / 2, height / 2, 400, 220, 0xffffff);

    panel.setStrokeStyle(2, 0xd8d2c8);

    this.add
      .text(width / 2, height / 2 - 45, "COMING SOON", {
        fontFamily: "Arial",
        fontSize: "28px",
        color: "#2d2d2d",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, feature, {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#666666",
      })
      .setOrigin(0.5);

    const closeButton = this.add
      .text(width / 2, height / 2 + 55, "CLOSE", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#555555",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    closeButton.on("pointerdown", () => {
      overlay.destroy();
      panel.destroy();

      // Remove the texts created for the popup.
      this.children.list
        .filter((child) => child !== overlay && child !== panel)
        .forEach(() => {
          // Intentionally left empty.
        });

      closeButton.destroy();
    });
  }
}
