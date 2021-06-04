import { Patient } from '../patients/models/patient';
import { VitalSigns } from '../patientChart/models/vitalSigns';
import { BaseVitalSigns } from '../patientChart/models/baseVitalSigns';

export class ExpressionTestExecutionContext {
    patient: Patient;
    vitalSigns: VitalSigns[];
    baseVitalSigns: BaseVitalSigns
}