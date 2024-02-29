import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxGalleryArrowsComponent {
    prevDisabled;
    nextDisabled;
    arrowPrevIcon;
    arrowNextIcon;
    onPrevClick = new EventEmitter();
    onNextClick = new EventEmitter();
    handlePrevClick() {
        this.onPrevClick.emit();
    }
    handleNextClick() {
        this.onNextClick.emit();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryArrowsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.3", type: NgxGalleryArrowsComponent, selector: "ngx-gallery-arrows", inputs: { prevDisabled: "prevDisabled", nextDisabled: "nextDisabled", arrowPrevIcon: "arrowPrevIcon", arrowNextIcon: "arrowNextIcon" }, outputs: { onPrevClick: "onPrevClick", onNextClick: "onNextClick" }, ngImport: i0, template: "<div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-left\">\r\n    <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handlePrevClick()\" [class.ngx-gallery-disabled]=\"prevDisabled\">\r\n        <i class=\"ngx-gallery-icon-content {{arrowPrevIcon}}\"></i>\r\n    </div>\r\n</div>\r\n<div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-right\">\r\n    <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handleNextClick()\" [class.ngx-gallery-disabled]=\"nextDisabled\">\r\n        <i class=\"ngx-gallery-icon-content {{arrowNextIcon}}\"></i>\r\n    </div>\r\n</div>", styles: [".ngx-gallery-arrow-wrapper{position:absolute;height:100%;width:1px;display:table;z-index:2000;table-layout:fixed}.ngx-gallery-arrow-left{left:0}.ngx-gallery-arrow-right{right:0}.ngx-gallery-arrow{top:50%;transform:translateY(-50%);cursor:pointer}.ngx-gallery-arrow.ngx-gallery-disabled{opacity:.6;cursor:default}.ngx-gallery-arrow-left .ngx-gallery-arrow{left:10px}.ngx-gallery-arrow-right .ngx-gallery-arrow{right:10px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryArrowsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery-arrows', template: "<div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-left\">\r\n    <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handlePrevClick()\" [class.ngx-gallery-disabled]=\"prevDisabled\">\r\n        <i class=\"ngx-gallery-icon-content {{arrowPrevIcon}}\"></i>\r\n    </div>\r\n</div>\r\n<div class=\"ngx-gallery-arrow-wrapper ngx-gallery-arrow-right\">\r\n    <div class=\"ngx-gallery-icon ngx-gallery-arrow\" aria-hidden=\"true\" (click)=\"handleNextClick()\" [class.ngx-gallery-disabled]=\"nextDisabled\">\r\n        <i class=\"ngx-gallery-icon-content {{arrowNextIcon}}\"></i>\r\n    </div>\r\n</div>", styles: [".ngx-gallery-arrow-wrapper{position:absolute;height:100%;width:1px;display:table;z-index:2000;table-layout:fixed}.ngx-gallery-arrow-left{left:0}.ngx-gallery-arrow-right{right:0}.ngx-gallery-arrow{top:50%;transform:translateY(-50%);cursor:pointer}.ngx-gallery-arrow.ngx-gallery-disabled{opacity:.6;cursor:default}.ngx-gallery-arrow-left .ngx-gallery-arrow{left:10px}.ngx-gallery-arrow-right .ngx-gallery-arrow{right:10px}\n"] }]
        }], propDecorators: { prevDisabled: [{
                type: Input
            }], nextDisabled: [{
                type: Input
            }], arrowPrevIcon: [{
                type: Input
            }], arrowNextIcon: [{
                type: Input
            }], onPrevClick: [{
                type: Output
            }], onNextClick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktYXJyb3dzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1nYWxsZXJ5L3NyYy9saWIvbmd4LWdhbGxlcnktYXJyb3dzL25neC1nYWxsZXJ5LWFycm93cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWFycm93cy9uZ3gtZ2FsbGVyeS1hcnJvd3MuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFPdkUsTUFBTSxPQUFPLHlCQUF5QjtJQUMzQixZQUFZLENBQVU7SUFDdEIsWUFBWSxDQUFVO0lBQ3RCLGFBQWEsQ0FBUztJQUN0QixhQUFhLENBQVM7SUFFckIsV0FBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDakMsV0FBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFFM0MsZUFBZTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGVBQWU7UUFDWCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVCLENBQUM7dUdBZlUseUJBQXlCOzJGQUF6Qix5QkFBeUIsdVFDUHRDLDZuQkFTTTs7MkZERk8seUJBQXlCO2tCQUxyQyxTQUFTOytCQUNFLG9CQUFvQjs4QkFLckIsWUFBWTtzQkFBcEIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFFSSxXQUFXO3NCQUFwQixNQUFNO2dCQUNHLFdBQVc7c0JBQXBCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS1hcnJvd3MnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1hcnJvd3MuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LWFycm93cy5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5QXJyb3dzQ29tcG9uZW50e1xyXG4gIEBJbnB1dCgpIHByZXZEaXNhYmxlZDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBuZXh0RGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGFycm93TmV4dEljb246IHN0cmluZztcclxuXHJcbiAgQE91dHB1dCgpIG9uUHJldkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBvbk5leHRDbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgaGFuZGxlUHJldkNsaWNrKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLm9uUHJldkNsaWNrLmVtaXQoKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZU5leHRDbGljaygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5vbk5leHRDbGljay5lbWl0KCk7XHJcbiAgfVxyXG59XHJcbiIsIjxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1hcnJvdy13cmFwcGVyIG5neC1nYWxsZXJ5LWFycm93LWxlZnRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29uIG5neC1nYWxsZXJ5LWFycm93XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgKGNsaWNrKT1cImhhbmRsZVByZXZDbGljaygpXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWRpc2FibGVkXT1cInByZXZEaXNhYmxlZFwiPlxyXG4gICAgICAgIDxpIGNsYXNzPVwibmd4LWdhbGxlcnktaWNvbi1jb250ZW50IHt7YXJyb3dQcmV2SWNvbn19XCI+PC9pPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG48ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktYXJyb3ctd3JhcHBlciBuZ3gtZ2FsbGVyeS1hcnJvdy1yaWdodFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb24gbmd4LWdhbGxlcnktYXJyb3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIiAoY2xpY2spPVwiaGFuZGxlTmV4dENsaWNrKClcIiBbY2xhc3Mubmd4LWdhbGxlcnktZGlzYWJsZWRdPVwibmV4dERpc2FibGVkXCI+XHJcbiAgICAgICAgPGkgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pY29uLWNvbnRlbnQge3thcnJvd05leHRJY29ufX1cIj48L2k+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+Il19