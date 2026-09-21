import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import MainMenu from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import GamesMenu from "./scenes/GamesMenu";
import HSKLevelMenu from './scenes/HSKLevelMenu';
import VocabularyMenu from './scenes/VocabularyMenu';
import HSKDataService from "../services/HSKDataService";
import HSKHome from './scenes/HSKHome';
import VocabularyScene from './scenes/VocabularyScene';
import WordDetailScene from './scenes/WordDetailScene';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#f5f1e8",
  scene: [
    Boot,
    Preloader,
    MainMenu,
    GamesMenu,
    MainGame,
    GameOver,

    VocabularyMenu,

    HSKLevelMenu,
    HSKHome,
    VocabularyScene,
    WordDetailScene,
  ],
};

///
console.log("");
console.log("🐼 HSK Panda Data Test");
console.log("======================");

for (const level of HSKDataService.getLevels()) {
  const stats = HSKDataService.getStats(level);

  console.log(`${level}:`, stats);
}

console.log("");
console.log("Vocabulary test:");

for (const level of HSKDataService.getLevels()) {
  const word = HSKDataService.getRandomWord(level);

  console.log(`${level}:`, word.word, "|", word.pinyin, "|", word.cixing);
}

console.log("");
console.log("HSK1 first word:", HSKDataService.getVocabularyByIndex("HSK1", 0));

console.log("HSK6 random words:", HSKDataService.getRandomWords("HSK6", 5));

console.log("");
///

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
