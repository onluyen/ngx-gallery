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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.10", ngImport: i0, type: NgxGalleryBulletsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.10", type: NgxGalleryBulletsComponent, selector: "ngx-gallery-bullets", inputs: { count: "count", active: "active" }, outputs: { onChange: "onChange" }, ngImport: i0, template: "<div class=\"ngx-gallery-bullet\" *ngFor=\"let bullet of getBullets(); let i = index;\" (click)=\"handleChange($event, i)\" [ngClass]=\"{ 'ngx-gallery-active': i == active }\"></div>", styles: [":host{position:absolute;z-index:2000;display:inline-flex;left:50%;transform:translate(-50%);bottom:0;padding:10px}.ngx-gallery-bullet{width:10px;height:10px;border-radius:50%;cursor:pointer;background:#fff}.ngx-gallery-bullet:not(:first-child){margin-left:5px}.ngx-gallery-bullet:hover,.ngx-gallery-bullet.ngx-gallery-active{background:#000}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.10", ngImport: i0, type: NgxGalleryBulletsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery-bullets', template: "<div class=\"ngx-gallery-bullet\" *ngFor=\"let bullet of getBullets(); let i = index;\" (click)=\"handleChange($event, i)\" [ngClass]=\"{ 'ngx-gallery-active': i == active }\"></div>", styles: [":host{position:absolute;z-index:2000;display:inline-flex;left:50%;transform:translate(-50%);bottom:0;padding:10px}.ngx-gallery-bullet{width:10px;height:10px;border-radius:50%;cursor:pointer;background:#fff}.ngx-gallery-bullet:not(:first-child){margin-left:5px}.ngx-gallery-bullet:hover,.ngx-gallery-bullet.ngx-gallery-active{background:#000}\n"] }]
        }], propDecorators: { count: [{
                type: Input
            }], active: [{
                type: Input
            }], onChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYnVsbGV0cy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9vbmx1eWVuLWdhbGxlcnkvc3JjL2xpYi9uZ3gtZ2FsbGVyeS1idWxsZXRzL25neC1nYWxsZXJ5LWJ1bGxldHMuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvb25sdXllbi1nYWxsZXJ5L3NyYy9saWIvbmd4LWdhbGxlcnktYnVsbGV0cy9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQU92RSxNQUFNLE9BQU8sMEJBQTBCO0lBQzVCLEtBQUssQ0FBUztJQUNkLE1BQU0sR0FBVyxDQUFDLENBQUM7SUFFbEIsUUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFFeEMsVUFBVTtRQUNOLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQVksRUFBRSxLQUFhO1FBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7d0dBWlUsMEJBQTBCOzRGQUExQiwwQkFBMEIsNElDUHZDLHdMQUE4Szs7NEZET2pLLDBCQUEwQjtrQkFMdEMsU0FBUzsrQkFDRSxxQkFBcUI7OEJBS3RCLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUksUUFBUTtzQkFBakIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIEV2ZW50RW1pdHRlciwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5LWJ1bGxldHMnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1idWxsZXRzLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlCdWxsZXRzQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSBjb3VudDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGFjdGl2ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgQE91dHB1dCgpIG9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBnZXRCdWxsZXRzKCk6IG51bWJlcltdIHtcclxuICAgICAgcmV0dXJuIEFycmF5KHRoaXMuY291bnQpO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50OiBFdmVudCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoaW5kZXgpO1xyXG4gIH1cclxufVxyXG4iLCI8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktYnVsbGV0XCIgKm5nRm9yPVwibGV0IGJ1bGxldCBvZiBnZXRCdWxsZXRzKCk7IGxldCBpID0gaW5kZXg7XCIgKGNsaWNrKT1cImhhbmRsZUNoYW5nZSgkZXZlbnQsIGkpXCIgW25nQ2xhc3NdPVwieyAnbmd4LWdhbGxlcnktYWN0aXZlJzogaSA9PSBhY3RpdmUgfVwiPjwvZGl2PiJdfQ==