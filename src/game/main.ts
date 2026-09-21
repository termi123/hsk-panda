import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import MainMenu from './scenes/main/MainMenu';
import GamesMenu from './scenes/games/GamesMenu';
import HSKDataService from "../services/HSKDataService";

import VocabularyMenu from './scenes/vocabulary/VocabularyMenu';

import HSKLevelMenu from './scenes/vocabulary/learn/hsk/HSKLevelMenu';
import HSKHome from './scenes/vocabulary/learn/hsk/HSKHome';

import VocabularyScene from './scenes/vocabulary/learn/hsk/words/VocabularyScene';
import WordDetailScene from './scenes/vocabulary/learn/hsk/words/WordDetailScene';

import GrammarScene from './scenes/vocabulary/learn/hsk/grammar/GrammarScene';
import GrammarDetailScene from './scenes/vocabulary/learn/hsk/grammar/GrammarDetailScene';

import HanziScene from './scenes/vocabulary/learn/hsk/hanzi/HanziScene';
import HanziDetailScene from './scenes/vocabulary/learn/hsk/hanzi/HanziDetailScene';

import TopicScene from './scenes/vocabulary/learn/hsk/topics/TopicScene';
import TopicDetailScene from './scenes/vocabulary/learn/hsk/topics/TopicDetailScene';

import TaskScene from './scenes/vocabulary/learn/hsk/tasks/TaskScene';
import TaskDetailScene from './scenes/vocabulary/learn/hsk/tasks/TaskDetailScene';

import WordsScene from './scenes/vocabulary/words/WordsScene';
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
    GrammarScene,
    GrammarDetailScene,
    HanziScene,
    HanziDetailScene,
    TopicScene,
    TopicDetailScene,
    TaskScene,
    TaskDetailScene,

    WordsScene
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

const types = new Set<string>();
const categories = new Set<string>();

for (const level of HSKDataService.getLevels()) {
    const grammar = HSKDataService.getGrammar(level);

    grammar.forEach(item => {
        if (item.grammarType) {
            types.add(item.grammarType);
        }

        if (item.categoryType) {
            categories.add(item.categoryType);
        }
    });
}

console.log('GRAMMAR TYPES:', [...types]);
console.log('GRAMMAR CATEGORIES:', [...categories]);

const vocabularyTypes = new Set<string>();

for (const level of HSKDataService.getLevels()) {
    const vocabulary = HSKDataService.getVocabulary(level);

    vocabulary.forEach(word => {
        if (word.cixing) {
            vocabularyTypes.add(word.cixing);
        }
    });
}

console.log(
    'VOCABULARY TYPES:',
    [...vocabularyTypes].sort()
);

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
