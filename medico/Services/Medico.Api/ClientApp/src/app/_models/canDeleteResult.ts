import { Dependency } from './dependency';

export class CanDeleteResult {
    canDelete: boolean;
    dependencies: Dependency[];

    static failedResult(dependencies: Dependency[]) {
        const canDeleteResult = new CanDeleteResult();
        canDeleteResult.canDelete = false;
        canDeleteResult.dependencies = dependencies;

        return canDeleteResult;
    }

    static successResult() {
        const canDeleteResult = new CanDeleteResult();
        canDeleteResult.canDelete = true;

        return canDeleteResult;
    }
}