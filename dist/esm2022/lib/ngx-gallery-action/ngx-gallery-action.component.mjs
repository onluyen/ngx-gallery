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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryActionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.1.3", type: NgxGalleryActionComponent, selector: "ngx-gallery-action", inputs: { icon: "icon", disabled: "disabled", titleText: "titleText" }, outputs: { onClick: "onClick" }, ngImport: i0, template: "<div class=\"ngx-gallery-icon\" [class.ngx-gallery-icon-disabled]=\"disabled\"\r\naria-hidden=\"true\"\r\ntitle=\"{{ titleText }}\"\r\n(click)=\"handleClick($event)\">\r\n    <i class=\"ngx-gallery-icon-content {{ icon }}\"></i>\r\n</div>", styles: [""], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryActionComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1nYWxsZXJ5L3NyYy9saWIvbmd4LWdhbGxlcnktYWN0aW9uL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWFjdGlvbi9uZ3gtZ2FsbGVyeS1hY3Rpb24uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFRaEcsTUFBTSxPQUFPLHlCQUF5QjtJQUMzQixJQUFJLENBQVM7SUFDYixRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFFZCxPQUFPLEdBQXdCLElBQUksWUFBWSxFQUFFLENBQUM7SUFFNUQsV0FBVyxDQUFDLEtBQVk7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMzQixDQUFDO3VHQWRVLHlCQUF5QjsyRkFBekIseUJBQXlCLG1LQ1J0QyxnUEFLTTs7MkZER08seUJBQXlCO2tCQU5yQyxTQUFTOytCQUNFLG9CQUFvQixtQkFHYix1QkFBdUIsQ0FBQyxNQUFNOzhCQUd0QyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVJLE9BQU87c0JBQWhCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktYWN0aW9uJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1hY3Rpb24uY29tcG9uZW50LnNjc3MnXSxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeUFjdGlvbkNvbXBvbmVudCB7XHJcbiAgQElucHV0KCkgaWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XHJcbiAgQElucHV0KCkgdGl0bGVUZXh0ID0gJyc7XHJcblxyXG4gIEBPdXRwdXQoKSBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8RXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBoYW5kbGVDbGljayhldmVudDogRXZlbnQpIHtcclxuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICB0aGlzLm9uQ2xpY2suZW1pdChldmVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH1cclxufVxyXG4iLCI8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktaWNvblwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1pY29uLWRpc2FibGVkXT1cImRpc2FibGVkXCJcclxuYXJpYS1oaWRkZW49XCJ0cnVlXCJcclxudGl0bGU9XCJ7eyB0aXRsZVRleHQgfX1cIlxyXG4oY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50KVwiPlxyXG4gICAgPGkgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29uLWNvbnRlbnQge3sgaWNvbiB9fVwiPjwvaT5cclxuPC9kaXY+Il19