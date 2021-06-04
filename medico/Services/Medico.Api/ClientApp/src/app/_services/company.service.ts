import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company } from '../_models/company';
import { ConfigService } from 'src/app/_services/config.service';
import { ApiBaseUrls } from '../_models/apiBaseUrls';
import { CompanySearchFilter } from '../administration/models/companySearchFilter';

@Injectable({ providedIn: 'root' })
export class CompanyService {
    constructor(private http: HttpClient,
        private config: ConfigService) {
    }

    getByFilter(searchFilter: CompanySearchFilter): Promise<Company[]> {
        const queryParams = new HttpParams({
            fromObject: searchFilter.toQueryParams()
        });

        return this.http.get<Company[]>(`${this.config.apiUrl}${ApiBaseUrls.company}`, { params: queryParams })
            .toPromise();
    }

    getFirst(): Promise<Company> {
        const filter = this.getFirstActiveFilter();

        return this.getByFilter(filter)
            .then(companies => companies[0]);
    }

    getByAppointmentId(appointmentId: string): Promise<Company> {
        const filter = this.getByAppointmentIdFilter(appointmentId);

        return this.getByFilter(filter)
            .then(companies => companies[0]);
    }

    getById(id: string): Promise<Company> {
        return this.http.get<Company>(`${this.config.apiUrl}${ApiBaseUrls.company}/${id}`)
            .toPromise();
    }

    save(company: Company): Promise<Company> {
        return this.http.post<Company>(`${this.config.apiUrl}${ApiBaseUrls.company}/`, company)
            .toPromise();
    }

    private getFirstActiveFilter(): CompanySearchFilter {
        const filter = new CompanySearchFilter();

        filter.isActive = true;
        filter.take = 1;

        return filter;
    }

    private getByAppointmentIdFilter(appointmentId: string): CompanySearchFilter {
        const filter = new CompanySearchFilter();

        filter.appointmentId = appointmentId;
        filter.take = 1;

        return filter;
    }
}