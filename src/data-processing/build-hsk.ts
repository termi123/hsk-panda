import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(__dirname, '..');

const SOURCE_DIR = path.join(SRC_DIR, 'data', 'hsk30');
const OUTPUT_DIR = path.join(SRC_DIR, 'data', 'hsk');

const LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6', 'HSK7-9'] as const;

type Level = typeof LEVELS[number];

interface VocabularyRecord {
    type: number;
    word: string;
    pinyin: string;
    cixing: string;
    sort: number;
    levelName: string;
}

interface LevelRecord {
    examLevelId: string;
    [key: string]: unknown;
}

function readJson<T>(filename: string): T[] {
    const filePath = path.join(SOURCE_DIR, filename);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Source file not found: ${filePath}`);
    }

    const json = JSON.parse(
        fs.readFileSync(filePath, 'utf-8')
    );

    if (!json?.data?.records || !Array.isArray(json.data.records)) {
        throw new Error(
            `Invalid HSK data format in ${filename}: data.records is not an array`
        );
    }

    return json.data.records as T[];
}

function writeJson(filename: string, data: unknown[]) {
    const filePath = path.join(OUTPUT_DIR, filename);

    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 2),
        'utf-8'
    );
}

function getLevelFolder(level: Level): string {
    return level.toLowerCase();
}

function isVocabularyLevel(
    record: VocabularyRecord,
    level: Level
): boolean {
    const levelName = record.levelName ?? '';

    switch (level) {
        case 'HSK1':
            return levelName.includes('一级');

        case 'HSK2':
            return levelName.includes('二级');

        case 'HSK3':
            return levelName.includes('三级');

        case 'HSK4':
            return levelName.includes('四级');

        case 'HSK5':
            return levelName.includes('五级');

        case 'HSK6':
            return levelName.includes('六级');

        case 'HSK7-9':
            return (
                levelName.includes('七级') ||
                levelName.includes('八级') ||
                levelName.includes('九级')
            );
    }
}

function isLevelRecord(
    record: LevelRecord,
    level: Level
): boolean {
    return record.examLevelId === level;
}

function buildLevel<T extends LevelRecord>(
    data: T[],
    level: Level
): T[] {
    return data.filter((item) => isLevelRecord(item, level));
}

function ensureCleanOutput() {
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmSync(OUTPUT_DIR, {
            recursive: true,
            force: true,
        });
    }

    fs.mkdirSync(OUTPUT_DIR, {
        recursive: true,
    });
}

function main() {
    console.log('');
    console.log('🐼 HSK Panda - Building ALL HSK data...');
    console.log('');

    ensureCleanOutput();

    const vocabulary = readJson<VocabularyRecord>(
        'hsk_vocabulary_pretty.json'
    );

    const grammar = readJson<LevelRecord>(
        'hsk_grammar_pretty.json'
    );

    const hanzi = readJson<LevelRecord>(
        'hsk_hanzi_pretty.json'
    );

    const topics = readJson<LevelRecord>(
        'hsk_topic_pretty.json'
    );

    const tasks = readJson<LevelRecord>(
        'hsk_task_pretty.json'
    );

    const totals = {
        vocabulary: 0,
        grammar: 0,
        hanzi: 0,
        topics: 0,
        tasks: 0,
    };

    for (const level of LEVELS) {
        const folder = getLevelFolder(level);
        const levelDir = path.join(OUTPUT_DIR, folder);

        fs.mkdirSync(levelDir, {
            recursive: true,
        });

        const levelVocabulary = vocabulary.filter((item) =>
            isVocabularyLevel(item, level)
        );

        const levelGrammar = buildLevel(grammar, level);
        const levelHanzi = buildLevel(hanzi, level);
        const levelTopics = buildLevel(topics, level);
        const levelTasks = buildLevel(tasks, level);

        fs.writeFileSync(
            path.join(levelDir, 'vocabulary.json'),
            JSON.stringify(levelVocabulary, null, 2),
            'utf-8'
        );

        fs.writeFileSync(
            path.join(levelDir, 'grammar.json'),
            JSON.stringify(levelGrammar, null, 2),
            'utf-8'
        );

        fs.writeFileSync(
            path.join(levelDir, 'hanzi.json'),
            JSON.stringify(levelHanzi, null, 2),
            'utf-8'
        );

        fs.writeFileSync(
            path.join(levelDir, 'topics.json'),
            JSON.stringify(levelTopics, null, 2),
            'utf-8'
        );

        fs.writeFileSync(
            path.join(levelDir, 'tasks.json'),
            JSON.stringify(levelTasks, null, 2),
            'utf-8'
        );

        totals.vocabulary += levelVocabulary.length;
        totals.grammar += levelGrammar.length;
        totals.hanzi += levelHanzi.length;
        totals.topics += levelTopics.length;
        totals.tasks += levelTasks.length;

        console.log(`✓ ${level}`);
        console.log(`    vocabulary: ${levelVocabulary.length}`);
        console.log(`    grammar:    ${levelGrammar.length}`);
        console.log(`    hanzi:      ${levelHanzi.length}`);
        console.log(`    topics:     ${levelTopics.length}`);
        console.log(`    tasks:      ${levelTasks.length}`);
        console.log('');
    }

    console.log('========================================');
    console.log('🎉 ALL HSK data generated successfully!');
    console.log('========================================');
    console.log('');
    console.log(`Vocabulary: ${totals.vocabulary}`);
    console.log(`Grammar:    ${totals.grammar}`);
    console.log(`Hanzi:      ${totals.hanzi}`);
    console.log(`Topics:     ${totals.topics}`);
    console.log(`Tasks:      ${totals.tasks}`);
    console.log('');
    console.log(`📁 Output: ${OUTPUT_DIR}`);
    console.log('');
}

main();