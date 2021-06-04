import { SearchFilter } from '../administration/models/SearchFilter';

export class PatientSearchFilter extends SearchFilter {
    lastName: string;
    firstName: string;
    ssn: string;
    dateOfBirth: any;
}