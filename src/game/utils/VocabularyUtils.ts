export function mapPartOfSpeech(type?: string): string {
    if (!type) return '-';

    const map: Record<string, string> = {
        '名': 'Danh từ',
        '动': 'Động từ',
        '形': 'Tính từ',
        '副': 'Phó từ',
        '代': 'Đại từ',
        '数': 'Số từ',
        '量': 'Lượng từ',
        '数量': 'Số lượng',
        '介': 'Giới từ',
        '连': 'Liên từ',
        '助': 'Trợ từ',
        '叹': 'Thán từ',
        '拟声': 'Từ tượng thanh',
        '前缀': 'Tiền tố',
        '后缀': 'Hậu tố',
    };

    return type
        .split(/[,，、]/)
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => {
            // Source sometimes uses Chinese parentheses
            // for secondary classifications, e.g. （副）.
            const normalized = item.replace(/^（|）$/g, '');

            return map[normalized] ?? normalized;
        })
        .join(' / ');
}