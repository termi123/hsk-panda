import { HSKVocabulary } from '../../../../services/HSKDataService';

export interface RunnerQuestion {
    word: HSKVocabulary;
    options: string[];
    correctIndex: number;
}