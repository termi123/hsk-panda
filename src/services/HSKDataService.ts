import vocabularyHsk1 from '../data/hsk/hsk1/vocabulary.json';
import grammarHsk1 from '../data/hsk/hsk1/grammar.json';
import hanziHsk1 from '../data/hsk/hsk1/hanzi.json';
import topicsHsk1 from '../data/hsk/hsk1/topics.json';
import tasksHsk1 from '../data/hsk/hsk1/tasks.json';

import vocabularyHsk2 from '../data/hsk/hsk2/vocabulary.json';
import grammarHsk2 from '../data/hsk/hsk2/grammar.json';
import hanziHsk2 from '../data/hsk/hsk2/hanzi.json';
import topicsHsk2 from '../data/hsk/hsk2/topics.json';
import tasksHsk2 from '../data/hsk/hsk2/tasks.json';

import vocabularyHsk3 from '../data/hsk/hsk3/vocabulary.json';
import grammarHsk3 from '../data/hsk/hsk3/grammar.json';
import hanziHsk3 from '../data/hsk/hsk3/hanzi.json';
import topicsHsk3 from '../data/hsk/hsk3/topics.json';
import tasksHsk3 from '../data/hsk/hsk3/tasks.json';

import vocabularyHsk4 from '../data/hsk/hsk4/vocabulary.json';
import grammarHsk4 from '../data/hsk/hsk4/grammar.json';
import hanziHsk4 from '../data/hsk/hsk4/hanzi.json';
import topicsHsk4 from '../data/hsk/hsk4/topics.json';
import tasksHsk4 from '../data/hsk/hsk4/tasks.json';

import vocabularyHsk5 from '../data/hsk/hsk5/vocabulary.json';
import grammarHsk5 from '../data/hsk/hsk5/grammar.json';
import hanziHsk5 from '../data/hsk/hsk5/hanzi.json';
import topicsHsk5 from '../data/hsk/hsk5/topics.json';
import tasksHsk5 from '../data/hsk/hsk5/tasks.json';

import vocabularyHsk6 from '../data/hsk/hsk6/vocabulary.json';
import grammarHsk6 from '../data/hsk/hsk6/grammar.json';
import hanziHsk6 from '../data/hsk/hsk6/hanzi.json';
import topicsHsk6 from '../data/hsk/hsk6/topics.json';
import tasksHsk6 from '../data/hsk/hsk6/tasks.json';

import vocabularyHsk79 from '../data/hsk/hsk7-9/vocabulary.json';
import grammarHsk79 from '../data/hsk/hsk7-9/grammar.json';
import hanziHsk79 from '../data/hsk/hsk7-9/hanzi.json';
import topicsHsk79 from '../data/hsk/hsk7-9/topics.json';
import tasksHsk79 from '../data/hsk/hsk7-9/tasks.json';

import type {
    HSKVocabulary,
    HSKGrammar,
    HSKHanzi,
    HSKTopic,
    HSKTask,
} from '../types/HSKTypes';

export type HSKLevel =
    | 'HSK1'
    | 'HSK2'
    | 'HSK3'
    | 'HSK4'
    | 'HSK5'
    | 'HSK6'
    | 'HSK7-9';

interface HSKData {
    vocabulary: HSKVocabulary[];
    grammar: HSKGrammar[];
    hanzi: HSKHanzi[];
    topics: HSKTopic[];
    tasks: HSKTask[];
}

const DATA: Record<HSKLevel, HSKData> = {
    HSK1: {
        vocabulary: vocabularyHsk1 as HSKVocabulary[],
        grammar: grammarHsk1 as HSKGrammar[],
        hanzi: hanziHsk1 as HSKHanzi[],
        topics: topicsHsk1 as HSKTopic[],
        tasks: tasksHsk1 as HSKTask[],
    },

    HSK2: {
        vocabulary: vocabularyHsk2 as HSKVocabulary[],
        grammar: grammarHsk2 as HSKGrammar[],
        hanzi: hanziHsk2 as HSKHanzi[],
        topics: topicsHsk2 as HSKTopic[],
        tasks: tasksHsk2 as HSKTask[],
    },

    HSK3: {
        vocabulary: vocabularyHsk3 as HSKVocabulary[],
        grammar: grammarHsk3 as HSKGrammar[],
        hanzi: hanziHsk3 as HSKHanzi[],
        topics: topicsHsk3 as HSKTopic[],
        tasks: tasksHsk3 as HSKTask[],
    },

    HSK4: {
        vocabulary: vocabularyHsk4 as HSKVocabulary[],
        grammar: grammarHsk4 as HSKGrammar[],
        hanzi: hanziHsk4 as HSKHanzi[],
        topics: topicsHsk4 as HSKTopic[],
        tasks: tasksHsk4 as HSKTask[],
    },

    HSK5: {
        vocabulary: vocabularyHsk5 as HSKVocabulary[],
        grammar: grammarHsk5 as HSKGrammar[],
        hanzi: hanziHsk5 as HSKHanzi[],
        topics: topicsHsk5 as HSKTopic[],
        tasks: tasksHsk5 as HSKTask[],
    },

    HSK6: {
        vocabulary: vocabularyHsk6 as HSKVocabulary[],
        grammar: grammarHsk6 as HSKGrammar[],
        hanzi: hanziHsk6 as HSKHanzi[],
        topics: topicsHsk6 as HSKTopic[],
        tasks: tasksHsk6 as HSKTask[],
    },

    'HSK7-9': {
        vocabulary: vocabularyHsk79 as HSKVocabulary[],
        grammar: grammarHsk79 as HSKGrammar[],
        hanzi: hanziHsk79 as HSKHanzi[],
        topics: topicsHsk79 as HSKTopic[],
        tasks: tasksHsk79 as HSKTask[],
    },
};

export class HSKDataService {

    static getLevels(): HSKLevel[] {
        return Object.keys(DATA) as HSKLevel[];
    }

    static getData(level: HSKLevel): HSKData {
        return DATA[level];
    }

    // -------------------------
    // Vocabulary
    // -------------------------

    static getVocabulary(level: HSKLevel): HSKVocabulary[] {
        return DATA[level].vocabulary;
    }

    static getVocabularyCount(level: HSKLevel): number {
        return DATA[level].vocabulary.length;
    }

    static getVocabularyByIndex(
        level: HSKLevel,
        index: number
    ): HSKVocabulary | undefined {
        return DATA[level].vocabulary[index];
    }

    static getRandomWord(level: HSKLevel): HSKVocabulary {
        const vocabulary = DATA[level].vocabulary;

        const index = Math.floor(
            Math.random() * vocabulary.length
        );

        return vocabulary[index];
    }

    static getRandomWords(
        level: HSKLevel,
        count: number
    ): HSKVocabulary[] {
        const vocabulary = DATA[level].vocabulary;

        if (count <= 0) {
            return [];
        }

        if (count >= vocabulary.length) {
            return [...vocabulary];
        }

        const shuffled = [...vocabulary];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffled[i], shuffled[j]] = [
                shuffled[j],
                shuffled[i],
            ];
        }

        return shuffled.slice(0, count);
    }

    static findVocabulary(
        level: HSKLevel,
        word: string
    ): HSKVocabulary | undefined {
        return DATA[level].vocabulary.find(
            (item) => item.word === word
        );
    }

    // -------------------------
    // Grammar
    // -------------------------

    static getGrammar(level: HSKLevel): HSKGrammar[] {
        return DATA[level].grammar;
    }

    static getGrammarCount(level: HSKLevel): number {
        return DATA[level].grammar.length;
    }

    // -------------------------
    // Hanzi
    // -------------------------

    static getHanzi(level: HSKLevel): HSKHanzi[] {
        return DATA[level].hanzi;
    }

    static getHanziCount(level: HSKLevel): number {
        return DATA[level].hanzi.length;
    }

    static findHanzi(
        level: HSKLevel,
        character: string
    ): HSKHanzi | undefined {
        return DATA[level].hanzi.find(
            (item) => item.word === character
        );
    }

    // -------------------------
    // Topics
    // -------------------------

    static getTopics(level: HSKLevel): HSKTopic[] {
        return DATA[level].topics;
    }

    static getTopicsCount(level: HSKLevel): number {
        return DATA[level].topics.length;
    }

    // -------------------------
    // Tasks
    // -------------------------

    static getTasks(level: HSKLevel): HSKTask[] {
        return DATA[level].tasks;
    }

    static getTasksCount(level: HSKLevel): number {
        return DATA[level].tasks.length;
    }

    // -------------------------
    // Stats
    // -------------------------

    static getStats(level: HSKLevel) {
        return {
            vocabulary: DATA[level].vocabulary.length,
            grammar: DATA[level].grammar.length,
            hanzi: DATA[level].hanzi.length,
            topics: DATA[level].topics.length,
            tasks: DATA[level].tasks.length,
        };
    }
}

export default HSKDataService;