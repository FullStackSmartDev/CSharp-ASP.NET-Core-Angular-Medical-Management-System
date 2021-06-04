import { Component, Input } from "@angular/core";

@Component({
    selector: "value-component",
    templateUrl: "./value.component.html"
})
export class ValueComponent {
    private _value: any = "";

    @Input("value")
    set value(value: any) {
        if (!value) {
            return;
        }

        if (typeof (value) === "string") {
            this._value = value.trim();
            return;
        }

        this._value = value;
    }

    get value(): any {
        return this._value;
    }
}