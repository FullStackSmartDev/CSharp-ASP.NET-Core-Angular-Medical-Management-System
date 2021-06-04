export class StringHelper {
    static format(...args: string[]): string {
        var s = args[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    }

    static camelize(str: string): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }

    static leftTrim(str: string): string {
        if (str == null)
            return str;

        return str.replace(/^\s+/g, '');
    }

    static rightTrim(str: string): string {
        if (str == null)
            return str;
            
        return str.replace(/\s+$/g, '');
    }
}