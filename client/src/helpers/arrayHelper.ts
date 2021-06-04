export class ArrayHelper {
    static isInArray(arr: Array<object>, propName: string, value: string): boolean {
        return arr.filter(i => {
            const arrValue = i[propName];
            return typeof (arrValue) === "string" && arrValue === value;
        }).length === 1;
    }

    static groupBy(arr, propName): any {
        return arr.reduce(function (rv, x) {
            (rv[x[propName]] = rv[x[propName]] || []).push(x);
            return rv;
        }, {});
    }

    static isArray(arr: any) {
        return Object.prototype.toString.call(arr) === '[object Array]'
    }

    static deleteByIndexes(arr: Array<any>, indexes: Array<number>) {
        let shiftNumber = 0;
        indexes.forEach((i, index) => {
            const itemIndexToDelete = index ? i - shiftNumber : i;
            arr.splice(itemIndexToDelete, 1);
            shiftNumber += 1;
        });
    }

    static indexesOf(arr: Array<object>, propName: string, propValues: Array<any>): Array<number> {
        const indexes = [];

        arr.forEach((i, index) => {
            const propValue = i[propName];
            if (propValues.indexOf(propValue) !== -1) {
                indexes.push(index);
            }
        });

        return indexes;
    }
}