export class KeywordEqualityComparerService {
    static areKeywordsEqual(keyword1: string, keyword2: string): boolean {
        return keyword1.toUpperCase() === keyword2.toUpperCase();
    }
}