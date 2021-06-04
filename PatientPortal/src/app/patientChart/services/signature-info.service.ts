import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/_services/config.service';
import { SignatureInfo } from '../models/signatureInfo';
import { DateHelper } from 'src/app/_helpers/date.helper';
import { UserService } from 'src/app/administration/services/user.service';

@Injectable()
export class SignatureInfoService {
    constructor(private http: HttpClient,
        private config: ConfigService,
        private userService: UserService) {
    }

    getSignatureString(admissionId: string): Promise<string> {
        const url = `${this.config.apiUrl}signatureinfo/admission/${admissionId}`;
        return this.http.get<SignatureInfo>(url).toPromise()
            .then(signatureInfo => {
                const isAdmissionSignedOff = !!(signatureInfo && !signatureInfo.isUnsigned);

                if (!isAdmissionSignedOff) {
                    return "";
                }

                const signDate = DateHelper.sqlServerUtcDateToLocalJsDate(signatureInfo.signDate);
                const signDateString = DateHelper.getFullDate(signDate);

                return this.userService.getById(signatureInfo.physicianId)
                    .then(physician => {
                        const isNamePrefixOrSuffixSet = !!(physician.namePrefix || physician.nameSuffix);

                        const namePrefix = physician.namePrefix
                            ? `&nbsp;${physician.namePrefix}&nbsp;`
                            : isNamePrefixOrSuffixSet
                                ? "&nbsp;"
                                : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

                        const nameSuffix = physician.nameSuffix
                            ? `&nbsp;${physician.nameSuffix}&nbsp;`
                            : isNamePrefixOrSuffixSet
                                ? "&nbsp;"
                                : "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

                        return `<span>Electronically signed by${namePrefix}${physician.firstName} ${physician.lastName}${nameSuffix}${signDateString}</span>`;
                    })
            });
    }

    isAdmissionSignedOff(admissionid: string): Promise<boolean> {
        const url = `${this.config.apiUrl}signatureinfo/admission/${admissionid}`;
        return this.http.get<SignatureInfo>(url).toPromise()
            .then(signatureInfo => {
                return !!(signatureInfo && !signatureInfo.isUnsigned);
            });
    }

    save(signatureInfo: SignatureInfo): Promise<void> {
        return this.http.post<void>(`${this.config.apiUrl}signatureinfo/`, signatureInfo)
            .toPromise();
    }
}