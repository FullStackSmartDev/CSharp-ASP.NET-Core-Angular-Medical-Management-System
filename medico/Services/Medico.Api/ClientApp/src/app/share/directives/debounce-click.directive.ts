import { Directive, EventEmitter, HostListener, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
    selector: '[debounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
    @Output() onDebounceClick = new EventEmitter();
    private clicks = new Subject();
    private subscription: Subscription;

    constructor() { }

    ngOnInit() {
        this.subscription = this.clicks.pipe(
            debounceTime(300)
        ).subscribe(e => this.onDebounceClick.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}