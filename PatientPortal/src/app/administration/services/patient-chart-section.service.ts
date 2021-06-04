import { PatientChartService } from "src/app/patientChart/services/patient-chart.service";
import { ISearchableByName } from 'src/app/_interfaces/iSearchableByName';

export class PatientChartSectionService implements ISearchableByName {
    constructor(private patientChartService: PatientChartService,
        private patientChartTree: any) {
    }

    getByName(name: string, companyId: string): Promise<any> {
        const patientChartSection =
            this.patientChartService.getPatientChartSectionByName(name, this.patientChartTree.patientRoot)
        return Promise.resolve(patientChartSection);
    }

}