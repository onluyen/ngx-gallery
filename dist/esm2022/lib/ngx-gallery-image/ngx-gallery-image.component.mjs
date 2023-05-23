import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgxGalleryAnimation } from '../ngx-gallery-animation.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "../ngx-gallery-helper.service";
import * as i3 from "@angular/common";
import * as i4 from "../ngx-gallery-action/ngx-gallery-action.component";
import * as i5 from "../ngx-gallery-arrows/ngx-gallery-arrows.component";
import * as i6 from "../ngx-gallery-bullets/ngx-gallery-bullets.component";
export class NgxGalleryImageComponent {
    constructor(sanitization, elementRef, helperService) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.onClick = new EventEmitter();
        this.onActiveChange = new EventEmitter();
        this.canChangeImage = true;
    }
    ngOnInit() {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }
    ngOnChanges(changes) {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'image', () => this.showNext(), () => this.showPrev());
        }
    }
    onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }
    onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }
    reset(index) {
        this.selectedIndex = index;
    }
    getImages() {
        if (!this.images) {
            return [];
        }
        if (this.lazyLoading) {
            let indexes = [this.selectedIndex];
            let prevIndex = this.selectedIndex - 1;
            if (prevIndex === -1 && this.infinityMove) {
                indexes.push(this.images.length - 1);
            }
            else if (prevIndex >= 0) {
                indexes.push(prevIndex);
            }
            let nextIndex = this.selectedIndex + 1;
            if (nextIndex == this.images.length && this.infinityMove) {
                indexes.push(0);
            }
            else if (nextIndex < this.images.length) {
                indexes.push(nextIndex);
            }
            return this.images.filter((img, i) => indexes.indexOf(i) != -1);
        }
        else {
            return this.images;
        }
    }
    startAutoPlay() {
        this.stopAutoPlay();
        this.timer = setInterval(() => {
            if (!this.showNext()) {
                this.selectedIndex = -1;
                this.showNext();
            }
        }, this.autoPlayInterval);
    }
    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    handleClick(event, index) {
        if (this.clickable) {
            this.onClick.emit(index);
            event.stopPropagation();
            event.preventDefault();
        }
    }
    show(index) {
        this.selectedIndex = index;
        this.onActiveChange.emit(this.selectedIndex);
        this.setChangeTimeout();
    }
    showNext() {
        if (this.canShowNext() && this.canChangeImage) {
            this.selectedIndex++;
            if (this.selectedIndex === this.images.length) {
                this.selectedIndex = 0;
            }
            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
            return true;
        }
        else {
            return false;
        }
    }
    showPrev() {
        if (this.canShowPrev() && this.canChangeImage) {
            this.selectedIndex--;
            if (this.selectedIndex < 0) {
                this.selectedIndex = this.images.length - 1;
            }
            this.onActiveChange.emit(this.selectedIndex);
            this.setChangeTimeout();
        }
    }
    setChangeTimeout() {
        this.canChangeImage = false;
        let timeout = 1000;
        if (this.animation === NgxGalleryAnimation.Slide
            || this.animation === NgxGalleryAnimation.Fade) {
            timeout = 500;
        }
        setTimeout(() => {
            this.canChangeImage = true;
        }, timeout);
    }
    canShowNext() {
        if (this.images) {
            return this.infinityMove || this.selectedIndex < this.images.length - 1
                ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.images) {
            return this.infinityMove || this.selectedIndex > 0 ? true : false;
        }
        else {
            return false;
        }
    }
    getSafeUrl(image) {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.2", ngImport: i0, type: NgxGalleryImageComponent, deps: [{ token: i1.DomSanitizer }, { token: i0.ElementRef }, { token: i2.NgxGalleryHelperService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.2", type: NgxGalleryImageComponent, selector: "ngx-gallery-image", inputs: { images: "images", clickable: "clickable", selectedIndex: "selectedIndex", arrows: "arrows", arrowsAutoHide: "arrowsAutoHide", swipe: "swipe", animation: "animation", size: "size", arrowPrevIcon: "arrowPrevIcon", arrowNextIcon: "arrowNextIcon", autoPlay: "autoPlay", autoPlayInterval: "autoPlayInterval", autoPlayPauseOnHover: "autoPlayPauseOnHover", infinityMove: "infinityMove", lazyLoading: "lazyLoading", actions: "actions", descriptions: "descriptions", showDescription: "showDescription", bullets: "bullets" }, outputs: { onClick: "onClick", onActiveChange: "onActiveChange" }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" } }, usesOnChanges: true, ngImport: i0, template: "<div class=\"ngx-gallery-image-wrapper ngx-gallery-animation-{{animation}} ngx-gallery-image-size-{{size}}\">\r\n    <div class=\"ngx-gallery-image\" \r\n        *ngFor=\"let image of getImages(); let i = index;\" \r\n        [ngClass]=\"{ 'ngx-gallery-active': selectedIndex == image.index, 'ngx-gallery-inactive-left': selectedIndex > image.index, 'ngx-gallery-inactive-right': selectedIndex < image.index, 'ngx-gallery-clickable': clickable }\" \r\n        [style.background-image]=\"getSafeUrl(image.src)\" \r\n        (click)=\"handleClick($event, image.index)\" >\r\n        <div class=\"ngx-gallery-icons-wrapper\">\r\n            <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, image.index)\"></ngx-gallery-action>\r\n        </div>\r\n        <div class=\"ngx-gallery-image-text\" *ngIf=\"showDescription && descriptions[image.index]\" [innerHTML]=\"descriptions[image.index]\" (click)=\"$event.stopPropagation()\"></div>\r\n    </div>\r\n</div>\r\n<ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"selectedIndex\" (onChange)=\"show($event)\"></ngx-gallery-bullets>\r\n<ngx-gallery-arrows class=\"ngx-gallery-image-size-{{size}}\" *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\r\n", styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-image-wrapper{width:100%;height:100%;position:absolute;left:0;top:0;overflow:hidden}.ngx-gallery-image{background-position:center;background-repeat:no-repeat;height:100%;width:100%;position:absolute;top:0}.ngx-gallery-image.ngx-gallery-active{z-index:1000}.ngx-gallery-image-size-cover .ngx-gallery-image{background-size:cover}.ngx-gallery-image-size-contain .ngx-gallery-image{background-size:contain}.ngx-gallery-animation-fade .ngx-gallery-image{left:0;opacity:0;transition:.5s ease-in-out}.ngx-gallery-animation-fade .ngx-gallery-image.ngx-gallery-active{opacity:1}.ngx-gallery-animation-slide .ngx-gallery-image{transition:.5s ease-in-out}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-active{left:0}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-left{left:-100%}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-right{left:100%}.ngx-gallery-animation-rotate .ngx-gallery-image{transition:1s ease;transform:scale(3.5) rotate(90deg);left:0;opacity:0}.ngx-gallery-animation-rotate .ngx-gallery-image.ngx-gallery-active{transform:scale(1) rotate(0);opacity:1}.ngx-gallery-animation-zoom .ngx-gallery-image{transition:1s ease;transform:scale(2.5);left:0;opacity:0}.ngx-gallery-animation-zoom .ngx-gallery-image.ngx-gallery-active{transform:scale(1);opacity:1}.ngx-gallery-image-text{width:100%;background:rgba(0,0,0,.7);padding:10px;text-align:center;color:#fff;font-size:16px;position:absolute;bottom:0;z-index:10}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.NgxGalleryActionComponent, selector: "ngx-gallery-action", inputs: ["icon", "disabled", "titleText"], outputs: ["onClick"] }, { kind: "component", type: i5.NgxGalleryArrowsComponent, selector: "ngx-gallery-arrows", inputs: ["prevDisabled", "nextDisabled", "arrowPrevIcon", "arrowNextIcon"], outputs: ["onPrevClick", "onNextClick"] }, { kind: "component", type: i6.NgxGalleryBulletsComponent, selector: "ngx-gallery-bullets", inputs: ["count", "active"], outputs: ["onChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.2", ngImport: i0, type: NgxGalleryImageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery-image', template: "<div class=\"ngx-gallery-image-wrapper ngx-gallery-animation-{{animation}} ngx-gallery-image-size-{{size}}\">\r\n    <div class=\"ngx-gallery-image\" \r\n        *ngFor=\"let image of getImages(); let i = index;\" \r\n        [ngClass]=\"{ 'ngx-gallery-active': selectedIndex == image.index, 'ngx-gallery-inactive-left': selectedIndex > image.index, 'ngx-gallery-inactive-right': selectedIndex < image.index, 'ngx-gallery-clickable': clickable }\" \r\n        [style.background-image]=\"getSafeUrl(image.src)\" \r\n        (click)=\"handleClick($event, image.index)\" >\r\n        <div class=\"ngx-gallery-icons-wrapper\">\r\n            <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, image.index)\"></ngx-gallery-action>\r\n        </div>\r\n        <div class=\"ngx-gallery-image-text\" *ngIf=\"showDescription && descriptions[image.index]\" [innerHTML]=\"descriptions[image.index]\" (click)=\"$event.stopPropagation()\"></div>\r\n    </div>\r\n</div>\r\n<ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"selectedIndex\" (onChange)=\"show($event)\"></ngx-gallery-bullets>\r\n<ngx-gallery-arrows class=\"ngx-gallery-image-size-{{size}}\" *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\r\n", styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-image-wrapper{width:100%;height:100%;position:absolute;left:0;top:0;overflow:hidden}.ngx-gallery-image{background-position:center;background-repeat:no-repeat;height:100%;width:100%;position:absolute;top:0}.ngx-gallery-image.ngx-gallery-active{z-index:1000}.ngx-gallery-image-size-cover .ngx-gallery-image{background-size:cover}.ngx-gallery-image-size-contain .ngx-gallery-image{background-size:contain}.ngx-gallery-animation-fade .ngx-gallery-image{left:0;opacity:0;transition:.5s ease-in-out}.ngx-gallery-animation-fade .ngx-gallery-image.ngx-gallery-active{opacity:1}.ngx-gallery-animation-slide .ngx-gallery-image{transition:.5s ease-in-out}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-active{left:0}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-left{left:-100%}.ngx-gallery-animation-slide .ngx-gallery-image.ngx-gallery-inactive-right{left:100%}.ngx-gallery-animation-rotate .ngx-gallery-image{transition:1s ease;transform:scale(3.5) rotate(90deg);left:0;opacity:0}.ngx-gallery-animation-rotate .ngx-gallery-image.ngx-gallery-active{transform:scale(1) rotate(0);opacity:1}.ngx-gallery-animation-zoom .ngx-gallery-image{transition:1s ease;transform:scale(2.5);left:0;opacity:0}.ngx-gallery-animation-zoom .ngx-gallery-image.ngx-gallery-active{transform:scale(1);opacity:1}.ngx-gallery-image-text{width:100%;background:rgba(0,0,0,.7);padding:10px;text-align:center;color:#fff;font-size:16px;position:absolute;bottom:0;z-index:10}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.DomSanitizer }, { type: i0.ElementRef }, { type: i2.NgxGalleryHelperService }]; }, propDecorators: { images: [{
                type: Input
            }], clickable: [{
                type: Input
            }], selectedIndex: [{
                type: Input
            }], arrows: [{
                type: Input
            }], arrowsAutoHide: [{
                type: Input
            }], swipe: [{
                type: Input
            }], animation: [{
                type: Input
            }], size: [{
                type: Input
            }], arrowPrevIcon: [{
                type: Input
            }], arrowNextIcon: [{
                type: Input
            }], autoPlay: [{
                type: Input
            }], autoPlayInterval: [{
                type: Input
            }], autoPlayPauseOnHover: [{
                type: Input
            }], infinityMove: [{
                type: Input
            }], lazyLoading: [{
                type: Input
            }], actions: [{
                type: Input
            }], descriptions: [{
                type: Input
            }], showDescription: [{
                type: Input
            }], bullets: [{
                type: Input
            }], onClick: [{
                type: Output
            }], onActiveChange: [{
                type: Output
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LWdhbGxlcnkvc3JjL2xpYi9uZ3gtZ2FsbGVyeS1pbWFnZS9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWltYWdlL25neC1nYWxsZXJ5LWltYWdlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQXFCLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUE2QixZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFLbkksT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7Ozs7Ozs7O0FBT3JFLE1BQU0sT0FBTyx3QkFBd0I7SUE0Qm5DLFlBQW9CLFlBQTBCLEVBQ2xDLFVBQXNCLEVBQVUsYUFBc0M7UUFEOUQsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDbEMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUF5QjtRQVJ4RSxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3QixtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFOUMsbUJBQWMsR0FBRyxJQUFJLENBQUM7SUFLK0QsQ0FBQztJQUV0RixRQUFRO1FBQ0osSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDdkI7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQzlCLElBQUksT0FBTyxDQUFD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QztTQUNyRTthQUFNO1lBQ0gsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRUQsVUFBVSxDQUFDLEtBQWE7UUFDcEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDOzhHQW5NVSx3QkFBd0I7a0dBQXhCLHdCQUF3Qix3dkJDWnJDLDIvQ0FjQTs7MkZERmEsd0JBQXdCO2tCQUxwQyxTQUFTOytCQUNFLG1CQUFtQjtrS0FLcEIsTUFBTTtzQkFBZCxLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csY0FBYztzQkFBdEIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUNHLG9CQUFvQjtzQkFBNUIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBRUksT0FBTztzQkFBaEIsTUFBTTtnQkFDRyxjQUFjO3NCQUF2QixNQUFNO2dCQXlCcUIsWUFBWTtzQkFBdkMsWUFBWTt1QkFBQyxZQUFZO2dCQVVFLFlBQVk7c0JBQXZDLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBPbkNoYW5nZXMsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgRWxlbWVudFJlZiwgU2ltcGxlQ2hhbmdlcywgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2UgfSBmcm9tICcuLi9uZ3gtZ2FsbGVyeS1vcmRlcmVkLWltYWdlLm1vZGVsJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUFjdGlvbiB9IGZyb20gJy4uL25neC1nYWxsZXJ5LWFjdGlvbi5tb2RlbCc7XHJcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVN0eWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QW5pbWF0aW9uIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktYW5pbWF0aW9uLm1vZGVsJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktaW1hZ2UnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpIGltYWdlczogTmd4R2FsbGVyeU9yZGVyZWRJbWFnZVtdO1xyXG4gIEBJbnB1dCgpIGNsaWNrYWJsZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSBzZWxlY3RlZEluZGV4OiBudW1iZXI7XHJcbiAgQElucHV0KCkgYXJyb3dzOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFycm93c0F1dG9IaWRlOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHN3aXBlOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFuaW1hdGlvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHNpemU6IHN0cmluZztcclxuICBASW5wdXQoKSBhcnJvd1ByZXZJY29uOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgYXJyb3dOZXh0SWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGF1dG9QbGF5OiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGF1dG9QbGF5SW50ZXJ2YWw6IG51bWJlcjtcclxuICBASW5wdXQoKSBhdXRvUGxheVBhdXNlT25Ib3ZlcjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBpbmZpbml0eU1vdmU6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgbGF6eUxvYWRpbmc6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uczogTmd4R2FsbGVyeUFjdGlvbltdO1xyXG4gIEBJbnB1dCgpIGRlc2NyaXB0aW9uczogc3RyaW5nW107XHJcbiAgQElucHV0KCkgc2hvd0Rlc2NyaXB0aW9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGJ1bGxldHM6IGJvb2xlYW47XHJcblxyXG4gIEBPdXRwdXQoKSBvbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBvbkFjdGl2ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgY2FuQ2hhbmdlSW1hZ2UgPSB0cnVlO1xyXG5cclxuICBwcml2YXRlIHRpbWVyO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXphdGlvbjogRG9tU2FuaXRpemVyLFxyXG4gICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsIHByaXZhdGUgaGVscGVyU2VydmljZTogTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UpIHt9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5hcnJvd3MgJiYgdGhpcy5hcnJvd3NBdXRvSGlkZSkge1xyXG4gICAgICAgICAgdGhpcy5hcnJvd3MgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuYXV0b1BsYXkpIHtcclxuICAgICAgICAgIHRoaXMuc3RhcnRBdXRvUGxheSgpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICAgIGlmIChjaGFuZ2VzWydzd2lwZSddKSB7XHJcbiAgICAgICAgICB0aGlzLmhlbHBlclNlcnZpY2UubWFuYWdlU3dpcGUodGhpcy5zd2lwZSwgdGhpcy5lbGVtZW50UmVmLCAnaW1hZ2UnLCAoKSA9PiB0aGlzLnNob3dOZXh0KCksICgpID0+IHRoaXMuc2hvd1ByZXYoKSk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XHJcbiAgICAgIGlmICh0aGlzLmFycm93c0F1dG9IaWRlICYmICF0aGlzLmFycm93cykge1xyXG4gICAgICAgICAgdGhpcy5hcnJvd3MgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5hdXRvUGxheSAmJiB0aGlzLmF1dG9QbGF5UGF1c2VPbkhvdmVyKSB7XHJcbiAgICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJykgb25Nb3VzZUxlYXZlKCkge1xyXG4gICAgICBpZiAodGhpcy5hcnJvd3NBdXRvSGlkZSAmJiB0aGlzLmFycm93cykge1xyXG4gICAgICAgICAgdGhpcy5hcnJvd3MgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xyXG4gICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHJlc2V0KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XHJcbiAgfVxyXG5cclxuICBnZXRJbWFnZXMoKTogTmd4R2FsbGVyeU9yZGVyZWRJbWFnZVtdIHtcclxuICAgICAgaWYgKCF0aGlzLmltYWdlcykge1xyXG4gICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5sYXp5TG9hZGluZykge1xyXG4gICAgICAgICAgbGV0IGluZGV4ZXMgPSBbdGhpcy5zZWxlY3RlZEluZGV4XTtcclxuICAgICAgICAgIGxldCBwcmV2SW5kZXggPSB0aGlzLnNlbGVjdGVkSW5kZXggLSAxO1xyXG5cclxuICAgICAgICAgIGlmIChwcmV2SW5kZXggPT09IC0xICYmIHRoaXMuaW5maW5pdHlNb3ZlKSB7XHJcbiAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDEpXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHByZXZJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKHByZXZJbmRleCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbGV0IG5leHRJbmRleCA9IHRoaXMuc2VsZWN0ZWRJbmRleCArIDE7XHJcblxyXG4gICAgICAgICAgaWYgKG5leHRJbmRleCA9PSB0aGlzLmltYWdlcy5sZW5ndGggJiYgdGhpcy5pbmZpbml0eU1vdmUpIHtcclxuICAgICAgICAgICAgICBpbmRleGVzLnB1c2goMCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKG5leHRJbmRleCA8IHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGluZGV4ZXMucHVzaChuZXh0SW5kZXgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlcy5maWx0ZXIoKGltZywgaSkgPT4gaW5kZXhlcy5pbmRleE9mKGkpICE9IC0xKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlcztcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhcnRBdXRvUGxheSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zdG9wQXV0b1BsYXkoKTtcclxuXHJcbiAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuc2hvd05leHQoKSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IC0xO1xyXG4gICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfSwgdGhpcy5hdXRvUGxheUludGVydmFsKTtcclxuICB9XHJcblxyXG4gIHN0b3BBdXRvUGxheSgpIHtcclxuICAgICAgaWYgKHRoaXMudGltZXIpIHtcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5jbGlja2FibGUpIHtcclxuICAgICAgICAgIHRoaXMub25DbGljay5lbWl0KGluZGV4KTtcclxuXHJcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHNob3coaW5kZXg6IG51bWJlcikge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcclxuICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRJbmRleCk7XHJcbiAgICAgIHRoaXMuc2V0Q2hhbmdlVGltZW91dCgpO1xyXG4gIH1cclxuXHJcbiAgc2hvd05leHQoKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICh0aGlzLmNhblNob3dOZXh0KCkgJiYgdGhpcy5jYW5DaGFuZ2VJbWFnZSkge1xyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4Kys7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJbmRleCA9PT0gdGhpcy5pbWFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZEluZGV4KTtcclxuICAgICAgICAgIHRoaXMuc2V0Q2hhbmdlVGltZW91dCgpO1xyXG5cclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93UHJldigpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuY2FuU2hvd1ByZXYoKSAmJiB0aGlzLmNhbkNoYW5nZUltYWdlKSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXgtLTtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KHRoaXMuc2VsZWN0ZWRJbmRleCk7XHJcbiAgICAgICAgICB0aGlzLnNldENoYW5nZVRpbWVvdXQoKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0Q2hhbmdlVGltZW91dCgpIHtcclxuICAgICAgdGhpcy5jYW5DaGFuZ2VJbWFnZSA9IGZhbHNlO1xyXG4gICAgICBsZXQgdGltZW91dCA9IDEwMDA7XHJcblxyXG4gICAgICBpZiAodGhpcy5hbmltYXRpb24gPT09IE5neEdhbGxlcnlBbmltYXRpb24uU2xpZGVcclxuICAgICAgICAgIHx8IHRoaXMuYW5pbWF0aW9uID09PSBOZ3hHYWxsZXJ5QW5pbWF0aW9uLkZhZGUpIHtcclxuICAgICAgICAgICAgICB0aW1lb3V0ID0gNTAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY2FuQ2hhbmdlSW1hZ2UgPSB0cnVlO1xyXG4gICAgICB9LCB0aW1lb3V0KTtcclxuICB9XHJcblxyXG4gIGNhblNob3dOZXh0KCk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAodGhpcy5pbWFnZXMpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxXHJcbiAgICAgICAgICAgICAgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGNhblNob3dQcmV2KCk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAodGhpcy5pbWFnZXMpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPiAwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRTYWZlVXJsKGltYWdlOiBzdHJpbmcpOiBTYWZlU3R5bGUge1xyXG4gICAgICByZXR1cm4gdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKHRoaXMuaGVscGVyU2VydmljZS5nZXRCYWNrZ3JvdW5kVXJsKGltYWdlKSk7XHJcbiAgfVxyXG59XHJcbiIsIjxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pbWFnZS13cmFwcGVyIG5neC1nYWxsZXJ5LWFuaW1hdGlvbi17e2FuaW1hdGlvbn19IG5neC1nYWxsZXJ5LWltYWdlLXNpemUte3tzaXplfX1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pbWFnZVwiIFxyXG4gICAgICAgICpuZ0Zvcj1cImxldCBpbWFnZSBvZiBnZXRJbWFnZXMoKTsgbGV0IGkgPSBpbmRleDtcIiBcclxuICAgICAgICBbbmdDbGFzc109XCJ7ICduZ3gtZ2FsbGVyeS1hY3RpdmUnOiBzZWxlY3RlZEluZGV4ID09IGltYWdlLmluZGV4LCAnbmd4LWdhbGxlcnktaW5hY3RpdmUtbGVmdCc6IHNlbGVjdGVkSW5kZXggPiBpbWFnZS5pbmRleCwgJ25neC1nYWxsZXJ5LWluYWN0aXZlLXJpZ2h0Jzogc2VsZWN0ZWRJbmRleCA8IGltYWdlLmluZGV4LCAnbmd4LWdhbGxlcnktY2xpY2thYmxlJzogY2xpY2thYmxlIH1cIiBcclxuICAgICAgICBbc3R5bGUuYmFja2dyb3VuZC1pbWFnZV09XCJnZXRTYWZlVXJsKGltYWdlLnNyYylcIiBcclxuICAgICAgICAoY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50LCBpbWFnZS5pbmRleClcIiA+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb25zLXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdGb3I9XCJsZXQgYWN0aW9uIG9mIGFjdGlvbnNcIiBbaWNvbl09XCJhY3Rpb24uaWNvblwiIFtkaXNhYmxlZF09XCJhY3Rpb24uZGlzYWJsZWRcIiBbdGl0bGVUZXh0XT1cImFjdGlvbi50aXRsZVRleHRcIiAob25DbGljayk9XCJhY3Rpb24ub25DbGljaygkZXZlbnQsIGltYWdlLmluZGV4KVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1pbWFnZS10ZXh0XCIgKm5nSWY9XCJzaG93RGVzY3JpcHRpb24gJiYgZGVzY3JpcHRpb25zW2ltYWdlLmluZGV4XVwiIFtpbm5lckhUTUxdPVwiZGVzY3JpcHRpb25zW2ltYWdlLmluZGV4XVwiIChjbGljayk9XCIkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcIj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuPG5neC1nYWxsZXJ5LWJ1bGxldHMgKm5nSWY9XCJidWxsZXRzXCIgW2NvdW50XT1cImltYWdlcy5sZW5ndGhcIiBbYWN0aXZlXT1cInNlbGVjdGVkSW5kZXhcIiAob25DaGFuZ2UpPVwic2hvdygkZXZlbnQpXCI+PC9uZ3gtZ2FsbGVyeS1idWxsZXRzPlxyXG48bmd4LWdhbGxlcnktYXJyb3dzIGNsYXNzPVwibmd4LWdhbGxlcnktaW1hZ2Utc2l6ZS17e3NpemV9fVwiICpuZ0lmPVwiYXJyb3dzXCIgKG9uUHJldkNsaWNrKT1cInNob3dQcmV2KClcIiAob25OZXh0Q2xpY2spPVwic2hvd05leHQoKVwiIFtwcmV2RGlzYWJsZWRdPVwiIWNhblNob3dQcmV2KClcIiBbbmV4dERpc2FibGVkXT1cIiFjYW5TaG93TmV4dCgpXCIgW2Fycm93UHJldkljb25dPVwiYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImFycm93TmV4dEljb25cIj48L25neC1nYWxsZXJ5LWFycm93cz5cclxuIl19