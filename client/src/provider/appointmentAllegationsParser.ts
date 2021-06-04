import { AppointmentAllegation } from "../components/appointmentAllegationsComponent/appointmentAllegationsComponent";

export class AppointmentAllegationsParser {
    static parse(allegationsString: string): AppointmentAllegation[] {
        return JSON.parse(allegationsString)
            .Allegations
    }

    static stringify(appointmentAllegation: AppointmentAllegation[]): string {
        return JSON.stringify({
            Allegations: appointmentAllegation
        });
    }
}