import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxGalleryActionComponent {
    constructor() {
        this.disabled = false;
        this.titleText = '';
        this.onClick = new EventEmitter();
    }
    handleClick(event) {
        if (!this.disabled) {
            this.onClick.emit(event);
        }
        event.stopPropagation();
        event.preventDefault();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryActionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.3", type: NgxGalleryActionComponent, selector: "ngx-gallery-action", inputs: { icon: "icon", disabled: "disabled", titleText: "titleText" }, outputs: { onClick: "onClick" }, ngImport: i0, template: "<div class=\"ngx-gallery-icon\" [class.ngx-gallery-icon-disabled]=\"disabled\"\r\naria-hidden=\"true\"\r\ntitle=\"{{ titleText }}\"\r\n(click)=\"handleClick($event)\">\r\n    <i class=\"ngx-gallery-icon-content {{ icon }}\"></i>\r\n</div>", styles: [""], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryActionComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1nYWxsZXJ5L3NyYy9saWIvbmd4LWdhbGxlcnktYWN0aW9uL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWFjdGlvbi9uZ3gtZ2FsbGVyeS1hY3Rpb24uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFRaEcsTUFBTSxPQUFPLHlCQUF5QjtJQU50QztRQVFXLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVkLFlBQU8sR0FBd0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztLQVU3RDtJQVJDLFdBQVcsQ0FBQyxLQUFZO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUVELEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs4R0FkVSx5QkFBeUI7a0dBQXpCLHlCQUF5QixtS0NSdEMsZ1BBS007OzJGREdPLHlCQUF5QjtrQkFOckMsU0FBUzsrQkFDRSxvQkFBb0IsbUJBR2IsdUJBQXVCLENBQUMsTUFBTTs4QkFHdEMsSUFBSTtzQkFBWixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFFSSxPQUFPO3NCQUFoQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5LWFjdGlvbicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1nYWxsZXJ5LWFjdGlvbi5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlBY3Rpb25Db21wb25lbnQge1xyXG4gIEBJbnB1dCgpIGljb246IHN0cmluZztcclxuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xyXG4gIEBJbnB1dCgpIHRpdGxlVGV4dCA9ICcnO1xyXG5cclxuICBAT3V0cHV0KCkgb25DbGljazogRXZlbnRFbWl0dGVyPEV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICAgIGlmICghdGhpcy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgdGhpcy5vbkNsaWNrLmVtaXQoZXZlbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9XHJcbn1cclxuIiwiPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb25cIiBbY2xhc3Mubmd4LWdhbGxlcnktaWNvbi1kaXNhYmxlZF09XCJkaXNhYmxlZFwiXHJcbmFyaWEtaGlkZGVuPVwidHJ1ZVwiXHJcbnRpdGxlPVwie3sgdGl0bGVUZXh0IH19XCJcclxuKGNsaWNrKT1cImhhbmRsZUNsaWNrKCRldmVudClcIj5cclxuICAgIDxpIGNsYXNzPVwibmd4LWdhbGxlcnktaWNvbi1jb250ZW50IHt7IGljb24gfX1cIj48L2k+XHJcbjwvZGl2PiJdfQ==