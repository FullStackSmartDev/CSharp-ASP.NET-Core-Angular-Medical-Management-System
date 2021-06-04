import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../provider/dataService';

@Component({
    templateUrl: 'dayBusynessComponent.html',
    selector: 'day-busyness'
})

export class DayBusynessComponent implements OnInit {
    @Input("daySchedulerInfo") daySchedulerInfo: any;

    appointmentCount:number = 0;
    date:any;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        const self = this;
        const startDate = new Date(this.daySchedulerInfo.date.getTime());
        this.date = startDate.getDate();
        const endDate = new Date(this.daySchedulerInfo.date.setHours(startDate.getHours() + 9));
        this.dataService.getAppointmentCount(startDate, endDate)
            .then(result => {
                self.appointmentCount = result.AppointmentCount;
            })
            .catch(error => {
                console.log(error)
            });
    }
}