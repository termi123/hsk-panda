export interface HSKVocabulary {
    type: number;
    word: string;
    pinyin: string;
    cixing: string;
    sort: number;
    levelName: string;
}

export interface HSKGrammar {
    examLevelId: string;
    content: string;
    grammarType: string;
    categoryType: string;
    grammarDetail: string;
    cases: string;
}

export interface HSKHanzi {
    examLevelId: string;
    word: string;
    type: string;
}

export interface HSKTopic {
    examLevelId: string;
    children: unknown[];
    level1Content: string;
    level2Content: string;
    level3Content: string;
}

export interface HSKTask {
    examLevelId: string;
    children: unknown[];
    level1Content: string;
    level2Content: string;
}
