import { Component, Input, EventEmitter, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class NgxGalleryBulletsComponent {
    count;
    active = 0;
    onChange = new EventEmitter();
    getBullets() {
        return Array(this.count);
    }
    handleChange(event, index) {
        this.onChange.emit(index);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryBulletsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.3", type: NgxGalleryBulletsComponent, selector: "ngx-gallery-bullets", inputs: { count: "count", active: "active" }, outputs: { onChange: "onChange" }, ngImport: i0, template: "<div class=\"ngx-gallery-bullet\" *ngFor=\"let bullet of getBullets(); let i = index;\" (click)=\"handleChange($event, i)\" [ngClass]=\"{ 'ngx-gallery-active': i == active }\"></div>", styles: [":host{position:absolute;z-index:2000;display:inline-flex;left:50%;transform:translate(-50%);bottom:0;padding:10px}.ngx-gallery-bullet{width:10px;height:10px;border-radius:50%;cursor:pointer;background:#fff}.ngx-gallery-bullet:not(:first-child){margin-left:5px}.ngx-gallery-bullet:hover,.ngx-gallery-bullet.ngx-gallery-active{background:#000}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryBulletsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery-bullets', template: "<div class=\"ngx-gallery-bullet\" *ngFor=\"let bullet of getBullets(); let i = index;\" (click)=\"handleChange($event, i)\" [ngClass]=\"{ 'ngx-gallery-active': i == active }\"></div>", styles: [":host{position:absolute;z-index:2000;display:inline-flex;left:50%;transform:translate(-50%);bottom:0;padding:10px}.ngx-gallery-bullet{width:10px;height:10px;border-radius:50%;cursor:pointer;background:#fff}.ngx-gallery-bullet:not(:first-child){margin-left:5px}.ngx-gallery-bullet:hover,.ngx-gallery-bullet.ngx-gallery-active{background:#000}\n"] }]
        }], propDecorators: { count: [{
                type: Input
            }], active: [{
                type: Input
            }], onChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWJ1bGxldHMvbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWJ1bGxldHMvbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFPdkUsTUFBTSxPQUFPLDBCQUEwQjtJQUM1QixLQUFLLENBQVM7SUFDZCxNQUFNLEdBQVcsQ0FBQyxDQUFDO0lBRWxCLFFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBRXhDLFVBQVU7UUFDTixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFZLEVBQUUsS0FBYTtRQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO3VHQVpVLDBCQUEwQjsyRkFBMUIsMEJBQTBCLDRJQ1B2Qyx3TEFBOEs7OzJGRE9qSywwQkFBMEI7a0JBTHRDLFNBQVM7K0JBQ0UscUJBQXFCOzhCQUt0QixLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUVJLFFBQVE7c0JBQWpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBFdmVudEVtaXR0ZXIsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS1idWxsZXRzJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5QnVsbGV0c0NvbXBvbmVudCB7XHJcbiAgQElucHV0KCkgY291bnQ6IG51bWJlcjtcclxuICBASW5wdXQoKSBhY3RpdmU6IG51bWJlciA9IDA7XHJcblxyXG4gIEBPdXRwdXQoKSBvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgZ2V0QnVsbGV0cygpOiBudW1iZXJbXSB7XHJcbiAgICAgIHJldHVybiBBcnJheSh0aGlzLmNvdW50KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudDogRXZlbnQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KGluZGV4KTtcclxuICB9XHJcbn1cclxuIiwiPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWJ1bGxldFwiICpuZ0Zvcj1cImxldCBidWxsZXQgb2YgZ2V0QnVsbGV0cygpOyBsZXQgaSA9IGluZGV4O1wiIChjbGljayk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50LCBpKVwiIFtuZ0NsYXNzXT1cInsgJ25neC1nYWxsZXJ5LWFjdGl2ZSc6IGkgPT0gYWN0aXZlIH1cIj48L2Rpdj4iXX0=