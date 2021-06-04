export class SqlColumnNameAliasProvider {
    getColumnNameAlias(tableName: string, columnName: string): string {
        return `${tableName}_${columnName}`;
    }

    checkColumnNameAlias(columnNameAlias: string): boolean {
        return !!columnNameAlias.match(/[a-zA-Z]+_[a-zA-Z]+/)
    }
}