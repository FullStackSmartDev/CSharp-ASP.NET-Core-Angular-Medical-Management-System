import { GuidHelper } from 'src/app/_helpers/guid.helper';

export class PatientAllegationsSet {
    id: string;
    allegations: string;
    peTemplates: any[];
    hpiTemplates: any[];
    rosTemplates: any[];
    sectionIds: any[];

    constructor() {
        this.id = GuidHelper.generateNewGuid();
        this.allegations = "";
        this.peTemplates = [];
        this.hpiTemplates = [];
        this.rosTemplates = [];
        this.sectionIds = [];
    }
}