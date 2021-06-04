export class VisionVitalSigns {
    id: string;
    patientId: string;
    withGlasses: boolean;
    od: number;
    os: number;
    ou: number;
    createDate: any;
    
    constructor() {
        this.withGlasses = false;
        this.createDate = new Date();
    }
}