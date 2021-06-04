import { GuidHelper } from 'src/app/_helpers/guid.helper';

export class Assessment {
    id: string;
    diagnosis: string;
    order: number;
    notes: string;

    constructor() {
        this.id = GuidHelper.generateNewGuid();    
    }
}