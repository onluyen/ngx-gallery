import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxGalleryActionComponent {
    icon;
    disabled = false;
    titleText = '';
    onClick = new EventEmitter();
    handleClick(event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }
        event.stopPropagation();
        event.preventDefault();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.10", ngImport: i0, type: NgxGalleryActionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.10", type: NgxGalleryActionComponent, selector: "ngx-gallery-action", inputs: { icon: "icon", disabled: "disabled", titleText: "titleText" }, outputs: { onClick: "onClick" }, ngImport: i0, template: "<div class=\"ngx-gallery-icon\" [class.ngx-gallery-icon-disabled]=\"disabled\"\r\naria-hidden=\"true\"\r\ntitle=\"{{ titleText }}\"\r\n(click)=\"handleClick($event)\">\r\n    <i class=\"ngx-gallery-icon-content {{ icon }}\"></i>\r\n</div>", styles: [""], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.10", ngImport: i0, type: NgxGalleryActionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery-action', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"ngx-gallery-icon\" [class.ngx-gallery-icon-disabled]=\"disabled\"\r\naria-hidden=\"true\"\r\ntitle=\"{{ titleText }}\"\r\n(click)=\"handleClick($event)\">\r\n    <i class=\"ngx-gallery-icon-content {{ icon }}\"></i>\r\n</div>" }]
        }], propDecorators: { icon: [{
                type: Input
            }], disabled: [{
                type: Input
            }], titleText: [{
                type: Input
            }], onClick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL29ubHV5ZW4tZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWFjdGlvbi9uZ3gtZ2FsbGVyeS1hY3Rpb24uY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvb25sdXllbi1nYWxsZXJ5L3NyYy9saWIvbmd4LWdhbGxlcnktYWN0aW9uL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLHVCQUF1QixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQVFoRyxNQUFNLE9BQU8seUJBQXlCO0lBQzNCLElBQUksQ0FBUztJQUNiLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDakIsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUVkLE9BQU8sR0FBd0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUU1RCxXQUFXLENBQUMsS0FBWTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFFRCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzNCLENBQUM7d0dBZFUseUJBQXlCOzRGQUF6Qix5QkFBeUIsbUtDUnRDLGdQQUtNOzs0RkRHTyx5QkFBeUI7a0JBTnJDLFNBQVM7K0JBQ0Usb0JBQW9CLG1CQUdiLHVCQUF1QixDQUFDLE1BQU07OEJBR3RDLElBQUk7c0JBQVosS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUksT0FBTztzQkFBaEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS1hY3Rpb24nLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1hY3Rpb24uY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQuc2NzcyddLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5QWN0aW9uQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSBpY29uOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcclxuICBASW5wdXQoKSB0aXRsZVRleHQgPSAnJztcclxuXHJcbiAgQE91dHB1dCgpIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgICAgIHRoaXMub25DbGljay5lbWl0KGV2ZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfVxyXG59XHJcbiIsIjxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29uXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWljb24tZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxyXG5hcmlhLWhpZGRlbj1cInRydWVcIlxyXG50aXRsZT1cInt7IHRpdGxlVGV4dCB9fVwiXHJcbihjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQpXCI+XHJcbiAgICA8aSBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb24tY29udGVudCB7eyBpY29uIH19XCI+PC9pPlxyXG48L2Rpdj4iXX0=