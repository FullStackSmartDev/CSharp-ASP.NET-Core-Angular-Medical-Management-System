export class Dependency {
    type: string;
    title: string;

    static create(type: string, title: string): Dependency {
        const dependency = new Dependency();

        dependency.title = title;
        dependency.type = type;

        return dependency;
    }
}
