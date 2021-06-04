import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { PatientChartNode } from '../_models/patientChartNode';
import { PatientChartDocumentFilter } from '../_models/patientChartDocumentFilter';

export abstract class BasePatientChartHttpService {
    abstract patientChartUrl: string;

    constructor(protected http: HttpClient,
        protected config: ConfigService) {
    }

    getByFilter(searchFilter: PatientChartDocumentFilter): Promise<PatientChartNode> {
        const queryParams = new HttpParams({
            fromObject: searchFilter.toQueryParams()
        });
        return this.http.get<PatientChartNode>(`${this.config.apiUrl}${this.patientChartUrl}`, { params: queryParams })
            .toPromise();
    }

    get(companyId: string = null, patientChartDocumentId: string = null): Promise<PatientChartNode> {
        var searchFilter = new PatientChartDocumentFilter();
        if (companyId)
            searchFilter.companyId = companyId;

        if(patientChartDocumentId)
            searchFilter.patientChartDocumentId = patientChartDocumentId;

        return this.getByFilter(searchFilter);
    }

    update(patientChart: PatientChartNode, companyId: string, patientChartDocumentId: string = null): Promise<PatientChartNode> {
        return this.http.post<PatientChartNode>(`${this.config.apiUrl}${this.patientChartUrl}`, { patientChart, companyId, patientChartDocumentId })
            .toPromise();
    }
}