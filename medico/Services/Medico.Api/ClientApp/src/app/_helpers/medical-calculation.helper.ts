export class MedicalCalculationHelper {
    static calculateBmi(height: number, weight: number): string {
        if (weight && height) {
            return ((weight * 703 / (height * height)))
                .toFixed(0);
        }

        return "";
    }
}