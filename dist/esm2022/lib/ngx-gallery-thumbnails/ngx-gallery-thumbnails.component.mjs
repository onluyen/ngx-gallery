import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgxGalleryOrder } from '../ngx-gallery-order.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "../ngx-gallery-helper.service";
import * as i3 from "@angular/common";
import * as i4 from "../ngx-gallery-action/ngx-gallery-action.component";
import * as i5 from "../ngx-gallery-arrows/ngx-gallery-arrows.component";
export class NgxGalleryThumbnailsComponent {
    sanitization;
    elementRef;
    helperService;
    thumbnailsLeft;
    thumbnailsMarginLeft;
    mouseenter;
    remainingCountValue;
    minStopIndex = 0;
    images;
    links;
    labels;
    linkTarget;
    columns;
    rows;
    arrows;
    arrowsAutoHide;
    margin;
    selectedIndex;
    clickable;
    swipe;
    size;
    arrowPrevIcon;
    arrowNextIcon;
    moveSize;
    order;
    remainingCount;
    lazyLoading;
    actions;
    onActiveChange = new EventEmitter();
    index = 0;
    constructor(sanitization, elementRef, helperService) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
    }
    ngOnChanges(changes) {
        if (changes['selectedIndex']) {
            this.validateIndex();
        }
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'thumbnails', () => this.moveRight(), () => this.moveLeft());
        }
        if (this.images) {
            this.remainingCountValue = this.images.length - (this.rows * this.columns);
        }
    }
    onMouseEnter() {
        this.mouseenter = true;
    }
    onMouseLeave() {
        this.mouseenter = false;
    }
    reset(index) {
        this.selectedIndex = index;
        this.setDefaultPosition();
        this.index = 0;
        this.validateIndex();
    }
    getImages() {
        if (!this.images) {
            return [];
        }
        if (this.remainingCount) {
            return this.images.slice(0, this.rows * this.columns);
        }
        else if (this.lazyLoading && this.order != NgxGalleryOrder.Row) {
            let stopIndex = 0;
            if (this.order === NgxGalleryOrder.Column) {
                stopIndex = (this.index + this.columns + this.moveSize) * this.rows;
            }
            else if (this.order === NgxGalleryOrder.Page) {
                stopIndex = this.index + ((this.columns * this.rows) * 2);
            }
            if (stopIndex <= this.minStopIndex) {
                stopIndex = this.minStopIndex;
            }
            else {
                this.minStopIndex = stopIndex;
            }
            return this.images.slice(0, stopIndex);
        }
        else {
            return this.images;
        }
    }
    handleClick(event, index) {
        if (!this.hasLink(index)) {
            this.selectedIndex = index;
            this.onActiveChange.emit(index);
            event.stopPropagation();
            event.preventDefault();
        }
    }
    hasLink(index) {
        if (this.links && this.links.length && this.links[index])
            return true;
    }
    moveRight() {
        if (this.canMoveRight()) {
            this.index += this.moveSize;
            let maxIndex = this.getMaxIndex() - this.columns;
            if (this.index > maxIndex) {
                this.index = maxIndex;
            }
            this.setThumbnailsPosition();
        }
    }
    moveLeft() {
        if (this.canMoveLeft()) {
            this.index -= this.moveSize;
            if (this.index < 0) {
                this.index = 0;
            }
            this.setThumbnailsPosition();
        }
    }
    canMoveRight() {
        return this.index + this.columns < this.getMaxIndex() ? true : false;
    }
    canMoveLeft() {
        return this.index !== 0 ? true : false;
    }
    getThumbnailLeft(index) {
        let calculatedIndex;
        if (this.order === NgxGalleryOrder.Column) {
            calculatedIndex = Math.floor(index / this.rows);
        }
        else if (this.order === NgxGalleryOrder.Page) {
            calculatedIndex = (index % this.columns) + (Math.floor(index / (this.rows * this.columns)) * this.columns);
        }
        else if (this.order == NgxGalleryOrder.Row && this.remainingCount) {
            calculatedIndex = index % this.columns;
        }
        else {
            calculatedIndex = index % Math.ceil(this.images.length / this.rows);
        }
        return this.getThumbnailPosition(calculatedIndex, this.columns);
    }
    getThumbnailTop(index) {
        let calculatedIndex;
        if (this.order === NgxGalleryOrder.Column) {
            calculatedIndex = index % this.rows;
        }
        else if (this.order === NgxGalleryOrder.Page) {
            calculatedIndex = Math.floor(index / this.columns) - (Math.floor(index / (this.rows * this.columns)) * this.rows);
        }
        else if (this.order == NgxGalleryOrder.Row && this.remainingCount) {
            calculatedIndex = Math.floor(index / this.columns);
        }
        else {
            calculatedIndex = Math.floor(index / Math.ceil(this.images.length / this.rows));
        }
        return this.getThumbnailPosition(calculatedIndex, this.rows);
    }
    getThumbnailWidth() {
        return this.getThumbnailDimension(this.columns);
    }
    getThumbnailHeight() {
        return this.getThumbnailDimension(this.rows);
    }
    setThumbnailsPosition() {
        this.thumbnailsLeft = -((100 / this.columns) * this.index) + '%';
        this.thumbnailsMarginLeft = -((this.margin - (((this.columns - 1)
            * this.margin) / this.columns)) * this.index) + 'px';
    }
    setDefaultPosition() {
        this.thumbnailsLeft = '0px';
        this.thumbnailsMarginLeft = '0px';
    }
    canShowArrows() {
        if (this.remainingCount) {
            return false;
        }
        else if (this.arrows && this.images && this.images.length > this.getVisibleCount()
            && (!this.arrowsAutoHide || this.mouseenter)) {
            return true;
        }
        else {
            return false;
        }
    }
    validateIndex() {
        if (this.images) {
            let newIndex;
            if (this.order === NgxGalleryOrder.Column) {
                newIndex = Math.floor(this.selectedIndex / this.rows);
            }
            else {
                newIndex = this.selectedIndex % Math.ceil(this.images.length / this.rows);
            }
            if (this.remainingCount) {
                newIndex = 0;
            }
            if (newIndex < this.index || newIndex >= this.index + this.columns) {
                const maxIndex = this.getMaxIndex() - this.columns;
                this.index = newIndex > maxIndex ? maxIndex : newIndex;
                this.setThumbnailsPosition();
            }
        }
    }
    getSafeUrl(image) {
        return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
    }
    getThumbnailPosition(index, count) {
        return this.getSafeStyle('calc(' + ((100 / count) * index) + '% + '
            + ((this.margin - (((count - 1) * this.margin) / count)) * index) + 'px)');
    }
    getThumbnailDimension(count) {
        if (this.margin !== 0) {
            return this.getSafeStyle('calc(' + (100 / count) + '% - '
                + (((count - 1) * this.margin) / count) + 'px)');
        }
        else {
            return this.getSafeStyle('calc(' + (100 / count) + '% + 1px)');
        }
    }
    getMaxIndex() {
        if (this.order == NgxGalleryOrder.Page) {
            let maxIndex = (Math.floor(this.images.length / this.getVisibleCount()) * this.columns);
            if (this.images.length % this.getVisibleCount() > this.columns) {
                maxIndex += this.columns;
            }
            else {
                maxIndex += this.images.length % this.getVisibleCount();
            }
            return maxIndex;
        }
        else {
            return Math.ceil(this.images.length / this.rows);
        }
    }
    getVisibleCount() {
        return this.columns * this.rows;
    }
    getSafeStyle(value) {
        return this.sanitization.bypassSecurityTrustStyle(value);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryThumbnailsComponent, deps: [{ token: i1.DomSanitizer }, { token: i0.ElementRef }, { token: i2.NgxGalleryHelperService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.1.3", type: NgxGalleryThumbnailsComponent, selector: "ngx-gallery-thumbnails", inputs: { images: "images", links: "links", labels: "labels", linkTarget: "linkTarget", columns: "columns", rows: "rows", arrows: "arrows", arrowsAutoHide: "arrowsAutoHide", margin: "margin", selectedIndex: "selectedIndex", clickable: "clickable", swipe: "swipe", size: "size", arrowPrevIcon: "arrowPrevIcon", arrowNextIcon: "arrowNextIcon", moveSize: "moveSize", order: "order", remainingCount: "remainingCount", lazyLoading: "lazyLoading", actions: "actions" }, outputs: { onActiveChange: "onActiveChange" }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" } }, usesOnChanges: true, ngImport: i0, template: "<div class=\"ngx-gallery-thumbnails-wrapper ngx-gallery-thumbnail-size-{{size}}\">\r\n    <div class=\"ngx-gallery-thumbnails\" [style.transform]=\"'translateX(' + thumbnailsLeft + ')'\" [style.marginLeft]=\"thumbnailsMarginLeft\">\r\n        <a [href]=\"hasLink(i) ? links[i] : '#'\" [target]=\"linkTarget\" class=\"ngx-gallery-thumbnail\" *ngFor=\"let image of getImages(); let i = index;\" [style.background-image]=\"getSafeUrl(image)\" (click)=\"handleClick($event, i)\" [style.width]=\"getThumbnailWidth()\" [style.height]=\"getThumbnailHeight()\" [style.left]=\"getThumbnailLeft(i)\" [style.top]=\"getThumbnailTop(i)\" [ngClass]=\"{ 'ngx-gallery-active': i == selectedIndex, 'ngx-gallery-clickable': clickable }\" [attr.aria-label]=\"labels[i]\">\r\n            <div class=\"ngx-gallery-icons-wrapper\">\r\n                <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, i)\"></ngx-gallery-action>\r\n            </div>\r\n            <div class=\"ngx-gallery-remaining-count-overlay\" *ngIf=\"remainingCount && remainingCountValue && (i == (rows * columns) - 1)\">\r\n                <span class=\"ngx-gallery-remaining-count\">+{{remainingCountValue}}</span>\r\n            </div>\r\n        </a>\r\n    </div>\r\n</div>\r\n<ngx-gallery-arrows *ngIf=\"canShowArrows()\" (onPrevClick)=\"moveLeft()\" (onNextClick)=\"moveRight()\" [prevDisabled]=\"!canMoveLeft()\" [nextDisabled]=\"!canMoveRight()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\r\n", styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-thumbnails-wrapper{width:100%;height:100%;position:absolute;overflow:hidden}.ngx-gallery-thumbnails{height:100%;width:100%;position:absolute;left:0;transform:translate(0);transition:transform .5s ease-in-out;will-change:transform}.ngx-gallery-thumbnails .ngx-gallery-thumbnail{position:absolute;height:100%;background-position:center;background-repeat:no-repeat;text-decoration:none}.ngx-gallery-thumbnail-size-cover .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:cover}.ngx-gallery-thumbnail-size-contain .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:contain}.ngx-gallery-remaining-count-overlay{width:100%;height:100%;position:absolute;left:0;top:0;background-color:#0006}.ngx-gallery-remaining-count{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:30px}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.NgxGalleryActionComponent, selector: "ngx-gallery-action", inputs: ["icon", "disabled", "titleText"], outputs: ["onClick"] }, { kind: "component", type: i5.NgxGalleryArrowsComponent, selector: "ngx-gallery-arrows", inputs: ["prevDisabled", "nextDisabled", "arrowPrevIcon", "arrowNextIcon"], outputs: ["onPrevClick", "onNextClick"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryThumbnailsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery-thumbnails', template: "<div class=\"ngx-gallery-thumbnails-wrapper ngx-gallery-thumbnail-size-{{size}}\">\r\n    <div class=\"ngx-gallery-thumbnails\" [style.transform]=\"'translateX(' + thumbnailsLeft + ')'\" [style.marginLeft]=\"thumbnailsMarginLeft\">\r\n        <a [href]=\"hasLink(i) ? links[i] : '#'\" [target]=\"linkTarget\" class=\"ngx-gallery-thumbnail\" *ngFor=\"let image of getImages(); let i = index;\" [style.background-image]=\"getSafeUrl(image)\" (click)=\"handleClick($event, i)\" [style.width]=\"getThumbnailWidth()\" [style.height]=\"getThumbnailHeight()\" [style.left]=\"getThumbnailLeft(i)\" [style.top]=\"getThumbnailTop(i)\" [ngClass]=\"{ 'ngx-gallery-active': i == selectedIndex, 'ngx-gallery-clickable': clickable }\" [attr.aria-label]=\"labels[i]\">\r\n            <div class=\"ngx-gallery-icons-wrapper\">\r\n                <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, i)\"></ngx-gallery-action>\r\n            </div>\r\n            <div class=\"ngx-gallery-remaining-count-overlay\" *ngIf=\"remainingCount && remainingCountValue && (i == (rows * columns) - 1)\">\r\n                <span class=\"ngx-gallery-remaining-count\">+{{remainingCountValue}}</span>\r\n            </div>\r\n        </a>\r\n    </div>\r\n</div>\r\n<ngx-gallery-arrows *ngIf=\"canShowArrows()\" (onPrevClick)=\"moveLeft()\" (onNextClick)=\"moveRight()\" [prevDisabled]=\"!canMoveLeft()\" [nextDisabled]=\"!canMoveRight()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\r\n", styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-thumbnails-wrapper{width:100%;height:100%;position:absolute;overflow:hidden}.ngx-gallery-thumbnails{height:100%;width:100%;position:absolute;left:0;transform:translate(0);transition:transform .5s ease-in-out;will-change:transform}.ngx-gallery-thumbnails .ngx-gallery-thumbnail{position:absolute;height:100%;background-position:center;background-repeat:no-repeat;text-decoration:none}.ngx-gallery-thumbnail-size-cover .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:cover}.ngx-gallery-thumbnail-size-contain .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:contain}.ngx-gallery-remaining-count-overlay{width:100%;height:100%;position:absolute;left:0;top:0;background-color:#0006}.ngx-gallery-remaining-count{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:30px}\n"] }]
        }], ctorParameters: () => [{ type: i1.DomSanitizer }, { type: i0.ElementRef }, { type: i2.NgxGalleryHelperService }], propDecorators: { images: [{
                type: Input
            }], links: [{
                type: Input
            }], labels: [{
                type: Input
            }], linkTarget: [{
                type: Input
            }], columns: [{
                type: Input
            }], rows: [{
                type: Input
            }], arrows: [{
                type: Input
            }], arrowsAutoHide: [{
                type: Input
            }], margin: [{
                type: Input
            }], selectedIndex: [{
                type: Input
            }], clickable: [{
                type: Input
            }], swipe: [{
                type: Input
            }], size: [{
                type: Input
            }], arrowPrevIcon: [{
                type: Input
            }], arrowNextIcon: [{
                type: Input
            }], moveSize: [{
                type: Input
            }], order: [{
                type: Input
            }], remainingCount: [{
                type: Input
            }], lazyLoading: [{
                type: Input
            }], actions: [{
                type: Input
            }], onActiveChange: [{
                type: Output
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LXRodW1ibmFpbHMvbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LXRodW1ibmFpbHMvbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFhLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUE2QixZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJM0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7Ozs7O0FBTzdELE1BQU0sT0FBTyw2QkFBNkI7SUFrQ3BCO0lBQW9DO0lBQzVDO0lBakNaLGNBQWMsQ0FBUztJQUN2QixvQkFBb0IsQ0FBUztJQUM3QixVQUFVLENBQVU7SUFDcEIsbUJBQW1CLENBQVM7SUFFNUIsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUVSLE1BQU0sQ0FBK0I7SUFDckMsS0FBSyxDQUFXO0lBQ2hCLE1BQU0sQ0FBVztJQUNqQixVQUFVLENBQVM7SUFDbkIsT0FBTyxDQUFTO0lBQ2hCLElBQUksQ0FBUztJQUNiLE1BQU0sQ0FBVTtJQUNoQixjQUFjLENBQVU7SUFDeEIsTUFBTSxDQUFTO0lBQ2YsYUFBYSxDQUFTO0lBQ3RCLFNBQVMsQ0FBVTtJQUNuQixLQUFLLENBQVU7SUFDZixJQUFJLENBQVM7SUFDYixhQUFhLENBQVM7SUFDdEIsYUFBYSxDQUFTO0lBQ3RCLFFBQVEsQ0FBUztJQUNqQixLQUFLLENBQWU7SUFDcEIsY0FBYyxDQUFVO0lBQ3hCLFdBQVcsQ0FBVTtJQUNyQixPQUFPLENBQXFCO0lB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O3NCQUFkLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBRUksY0FBYztzQkFBdkIsTUFBTTtnQkFzQnFCLFlBQVk7c0JBQXZDLFlBQVk7dUJBQUMsWUFBWTtnQkFJRSxZQUFZO3NCQUF2QyxZQUFZO3VCQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uQ2hhbmdlcywgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBFbGVtZW50UmVmLCBTaW1wbGVDaGFuZ2VzLCBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsLCBEb21TYW5pdGl6ZXIsIFNhZmVTdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QWN0aW9uIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktYWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UgfSBmcm9tICcuLi9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlPcmRlciB9IGZyb20gJy4uL25neC1nYWxsZXJ5LW9yZGVyLm1vZGVsJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnktdGh1bWJuYWlscycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1nYWxsZXJ5LXRodW1ibmFpbHMuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LXRodW1ibmFpbHMuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xyXG5cclxuICB0aHVtYm5haWxzTGVmdDogc3RyaW5nO1xyXG4gIHRodW1ibmFpbHNNYXJnaW5MZWZ0OiBzdHJpbmc7XHJcbiAgbW91c2VlbnRlcjogYm9vbGVhbjtcclxuICByZW1haW5pbmdDb3VudFZhbHVlOiBudW1iZXI7XHJcblxyXG4gIG1pblN0b3BJbmRleCA9IDA7XHJcblxyXG4gIEBJbnB1dCgpIGltYWdlczogc3RyaW5nW10gfCBTYWZlUmVzb3VyY2VVcmxbXTtcclxuICBASW5wdXQoKSBsaW5rczogc3RyaW5nW107XHJcbiAgQElucHV0KCkgbGFiZWxzOiBzdHJpbmdbXTtcclxuICBASW5wdXQoKSBsaW5rVGFyZ2V0OiBzdHJpbmc7XHJcbiAgQElucHV0KCkgY29sdW1uczogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHJvd3M6IG51bWJlcjtcclxuICBASW5wdXQoKSBhcnJvd3M6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXJyb3dzQXV0b0hpZGU6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgbWFyZ2luOiBudW1iZXI7XHJcbiAgQElucHV0KCkgc2VsZWN0ZWRJbmRleDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGNsaWNrYWJsZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSBzd2lwZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSBzaXplOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGFycm93TmV4dEljb246IHN0cmluZztcclxuICBASW5wdXQoKSBtb3ZlU2l6ZTogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIG9yZGVyOiBudW1iZXIgfCBhbnk7XHJcbiAgQElucHV0KCkgcmVtYWluaW5nQ291bnQ6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgbGF6eUxvYWRpbmc6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uczogTmd4R2FsbGVyeUFjdGlvbltdO1xyXG5cclxuICBAT3V0cHV0KCkgb25BY3RpdmVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHByaXZhdGUgaW5kZXggPSAwO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXphdGlvbjogRG9tU2FuaXRpemVyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgIHByaXZhdGUgaGVscGVyU2VydmljZTogTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UpIHt9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgICAgaWYgKGNoYW5nZXNbJ3NlbGVjdGVkSW5kZXgnXSkge1xyXG4gICAgICAgICAgdGhpcy52YWxpZGF0ZUluZGV4KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjaGFuZ2VzWydzd2lwZSddKSB7XHJcbiAgICAgICAgICB0aGlzLmhlbHBlclNlcnZpY2UubWFuYWdlU3dpcGUodGhpcy5zd2lwZSwgdGhpcy5lbGVtZW50UmVmLFxyXG4gICAgICAgICAgJ3RodW1ibmFpbHMnLCAoKSA9PiB0aGlzLm1vdmVSaWdodCgpLCAoKSA9PiB0aGlzLm1vdmVMZWZ0KCkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5pbWFnZXMpIHtcclxuICAgICAgICAgIHRoaXMucmVtYWluaW5nQ291bnRWYWx1ZSA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtICh0aGlzLnJvd3MgKiB0aGlzLmNvbHVtbnMpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJykgb25Nb3VzZUVudGVyKCkge1xyXG4gICAgICB0aGlzLm1vdXNlZW50ZXIgPSB0cnVlO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VsZWF2ZScpIG9uTW91c2VMZWF2ZSgpIHtcclxuICAgICAgdGhpcy5tb3VzZWVudGVyID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICByZXNldChpbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xyXG4gICAgICB0aGlzLnNldERlZmF1bHRQb3NpdGlvbigpO1xyXG5cclxuICAgICAgdGhpcy5pbmRleCA9IDA7XHJcbiAgICAgIHRoaXMudmFsaWRhdGVJbmRleCgpO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW1hZ2VzKCk6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW10ge1xyXG4gICAgICBpZiAoIXRoaXMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnJlbWFpbmluZ0NvdW50KSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMuc2xpY2UoMCwgdGhpcy5yb3dzICogdGhpcy5jb2x1bW5zKTtcclxuICAgICAgfSBcclxuICAgICAgZWxzZSBpZiAodGhpcy5sYXp5TG9hZGluZyAmJiB0aGlzLm9yZGVyICE9IE5neEdhbGxlcnlPcmRlci5Sb3cpIHtcclxuICAgICAgICAgIGxldCBzdG9wSW5kZXggPSAwO1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuQ29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgc3RvcEluZGV4ID0gKHRoaXMuaW5kZXggKyB0aGlzLmNvbHVtbnMgKyB0aGlzLm1vdmVTaXplKSAqIHRoaXMucm93cztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5QYWdlKSB7XHJcbiAgICAgICAgICAgICAgc3RvcEluZGV4ID0gdGhpcy5pbmRleCArICgodGhpcy5jb2x1bW5zICogdGhpcy5yb3dzKSAqIDIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmIChzdG9wSW5kZXggPD0gdGhpcy5taW5TdG9wSW5kZXgpIHtcclxuICAgICAgICAgICAgICBzdG9wSW5kZXggPSB0aGlzLm1pblN0b3BJbmRleDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5taW5TdG9wSW5kZXggPSBzdG9wSW5kZXg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzLnNsaWNlKDAsIHN0b3BJbmRleCk7XHJcbiAgICAgIH0gXHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW1hZ2VzO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDbGljayhldmVudDogRXZlbnQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLmhhc0xpbmsoaW5kZXgpKSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcclxuICAgICAgICAgIHRoaXMub25BY3RpdmVDaGFuZ2UuZW1pdChpbmRleCk7XHJcblxyXG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBoYXNMaW5rKGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgaWYgKHRoaXMubGlua3MgJiYgdGhpcy5saW5rcy5sZW5ndGggJiYgdGhpcy5saW5rc1tpbmRleF0pIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgbW92ZVJpZ2h0KCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5jYW5Nb3ZlUmlnaHQoKSkge1xyXG4gICAgICAgICAgdGhpcy5pbmRleCArPSB0aGlzLm1vdmVTaXplO1xyXG4gICAgICAgICAgbGV0IG1heEluZGV4ID0gdGhpcy5nZXRNYXhJbmRleCgpIC0gdGhpcy5jb2x1bW5zO1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmluZGV4ID4gbWF4SW5kZXgpIHtcclxuICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gbWF4SW5kZXg7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5zZXRUaHVtYm5haWxzUG9zaXRpb24oKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgbW92ZUxlZnQoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmNhbk1vdmVMZWZ0KCkpIHtcclxuICAgICAgICAgIHRoaXMuaW5kZXggLT0gdGhpcy5tb3ZlU2l6ZTtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbHNQb3NpdGlvbigpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBjYW5Nb3ZlUmlnaHQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmluZGV4ICsgdGhpcy5jb2x1bW5zIDwgdGhpcy5nZXRNYXhJbmRleCgpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgY2FuTW92ZUxlZnQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmluZGV4ICE9PSAwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGh1bWJuYWlsTGVmdChpbmRleDogbnVtYmVyKTogU2FmZVN0eWxlIHtcclxuICAgICAgbGV0IGNhbGN1bGF0ZWRJbmRleDtcclxuXHJcbiAgICAgIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuQ29sdW1uKSB7XHJcbiAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gdGhpcy5yb3dzKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuUGFnZSkge1xyXG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gKGluZGV4ICUgdGhpcy5jb2x1bW5zKSArIChNYXRoLmZsb29yKGluZGV4IC8gKHRoaXMucm93cyAqIHRoaXMuY29sdW1ucykpICogdGhpcy5jb2x1bW5zKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09IE5neEdhbGxlcnlPcmRlci5Sb3cgJiYgdGhpcy5yZW1haW5pbmdDb3VudCkge1xyXG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gaW5kZXggJSB0aGlzLmNvbHVtbnM7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBpbmRleCAlIE1hdGguY2VpbCh0aGlzLmltYWdlcy5sZW5ndGggLyB0aGlzLnJvd3MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZXRUaHVtYm5haWxQb3NpdGlvbihjYWxjdWxhdGVkSW5kZXgsIHRoaXMuY29sdW1ucyk7XHJcbiAgfVxyXG5cclxuICBnZXRUaHVtYm5haWxUb3AoaW5kZXg6IG51bWJlcik6IFNhZmVTdHlsZSB7XHJcbiAgICAgIGxldCBjYWxjdWxhdGVkSW5kZXg7XHJcblxyXG4gICAgICBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLkNvbHVtbikge1xyXG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gaW5kZXggJSB0aGlzLnJvd3M7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLlBhZ2UpIHtcclxuICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyB0aGlzLmNvbHVtbnMpIC0gKE1hdGguZmxvb3IoaW5kZXggLyAodGhpcy5yb3dzICogdGhpcy5jb2x1bW5zKSkgKiB0aGlzLnJvd3MpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT0gTmd4R2FsbGVyeU9yZGVyLlJvdyAmJiB0aGlzLnJlbWFpbmluZ0NvdW50KSB7XHJcbiAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gdGhpcy5jb2x1bW5zKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyBNYXRoLmNlaWwodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5yb3dzKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdldFRodW1ibmFpbFBvc2l0aW9uKGNhbGN1bGF0ZWRJbmRleCwgdGhpcy5yb3dzKTtcclxuICB9XHJcblxyXG4gIGdldFRodW1ibmFpbFdpZHRoKCk6IFNhZmVTdHlsZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFRodW1ibmFpbERpbWVuc2lvbih0aGlzLmNvbHVtbnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGh1bWJuYWlsSGVpZ2h0KCk6IFNhZmVTdHlsZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFRodW1ibmFpbERpbWVuc2lvbih0aGlzLnJvd3MpO1xyXG4gIH1cclxuXHJcbiAgc2V0VGh1bWJuYWlsc1Bvc2l0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnRodW1ibmFpbHNMZWZ0ID0gLSAoKDEwMCAvIHRoaXMuY29sdW1ucykgKiB0aGlzLmluZGV4KSArICclJ1xyXG5cclxuICAgICAgdGhpcy50aHVtYm5haWxzTWFyZ2luTGVmdCA9IC0gKCh0aGlzLm1hcmdpbiAtICgoKHRoaXMuY29sdW1ucyAtIDEpXHJcbiAgICAgICogdGhpcy5tYXJnaW4pIC8gdGhpcy5jb2x1bW5zKSkgKiB0aGlzLmluZGV4KSArICdweCc7XHJcbiAgfVxyXG5cclxuICBzZXREZWZhdWx0UG9zaXRpb24oKTogdm9pZCB7XHJcbiAgICAgIHRoaXMudGh1bWJuYWlsc0xlZnQgPSAnMHB4JztcclxuICAgICAgdGhpcy50aHVtYm5haWxzTWFyZ2luTGVmdCA9ICcwcHgnO1xyXG4gIH1cclxuXHJcbiAgY2FuU2hvd0Fycm93cygpOiBib29sZWFuIHtcclxuICAgICAgaWYgKHRoaXMucmVtYWluaW5nQ291bnQpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmFycm93cyAmJiB0aGlzLmltYWdlcyAmJiB0aGlzLmltYWdlcy5sZW5ndGggPiB0aGlzLmdldFZpc2libGVDb3VudCgpXHJcbiAgICAgICAgICAmJiAoIXRoaXMuYXJyb3dzQXV0b0hpZGUgfHwgdGhpcy5tb3VzZWVudGVyKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHZhbGlkYXRlSW5kZXgoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmltYWdlcykge1xyXG4gICAgICAgICAgbGV0IG5ld0luZGV4O1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuQ29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgbmV3SW5kZXggPSBNYXRoLmZsb29yKHRoaXMuc2VsZWN0ZWRJbmRleCAvIHRoaXMucm93cyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIG5ld0luZGV4ID0gdGhpcy5zZWxlY3RlZEluZGV4ICUgTWF0aC5jZWlsKHRoaXMuaW1hZ2VzLmxlbmd0aCAvIHRoaXMucm93cyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMucmVtYWluaW5nQ291bnQpIHtcclxuICAgICAgICAgICAgICBuZXdJbmRleCA9IDA7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKG5ld0luZGV4IDwgdGhpcy5pbmRleCB8fCBuZXdJbmRleCA+PSB0aGlzLmluZGV4ICsgdGhpcy5jb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgbWF4SW5kZXggPSB0aGlzLmdldE1heEluZGV4KCkgLSB0aGlzLmNvbHVtbnM7XHJcbiAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IG5ld0luZGV4ID4gbWF4SW5kZXggPyBtYXhJbmRleCA6IG5ld0luZGV4O1xyXG5cclxuICAgICAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbHNQb3NpdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRTYWZlVXJsKGltYWdlOiBzdHJpbmcgfCBhbnkpOiBTYWZlU3R5bGUge1xyXG4gICAgICByZXR1cm4gdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKHRoaXMuaGVscGVyU2VydmljZS5nZXRCYWNrZ3JvdW5kVXJsKGltYWdlKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFRodW1ibmFpbFBvc2l0aW9uKGluZGV4OiBudW1iZXIsIGNvdW50OiBudW1iZXIpOiBTYWZlU3R5bGUge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRTYWZlU3R5bGUoJ2NhbGMoJyArICgoMTAwIC8gY291bnQpICogaW5kZXgpICsgJyUgKyAnXHJcbiAgICAgICAgICArICgodGhpcy5tYXJnaW4gLSAoKChjb3VudCAtIDEpICogdGhpcy5tYXJnaW4pIC8gY291bnQpKSAqIGluZGV4KSArICdweCknKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0VGh1bWJuYWlsRGltZW5zaW9uKGNvdW50OiBudW1iZXIpOiBTYWZlU3R5bGUge1xyXG4gICAgICBpZiAodGhpcy5tYXJnaW4gIT09IDApIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmdldFNhZmVTdHlsZSgnY2FsYygnICsgKDEwMCAvIGNvdW50KSArICclIC0gJ1xyXG4gICAgICAgICAgICAgICsgKCgoY291bnQgLSAxKSAqIHRoaXMubWFyZ2luKSAvIGNvdW50KSArICdweCknKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmdldFNhZmVTdHlsZSgnY2FsYygnICsgKDEwMCAvIGNvdW50KSArICclICsgMXB4KScpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE1heEluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgIGlmICh0aGlzLm9yZGVyID09IE5neEdhbGxlcnlPcmRlci5QYWdlKSB7XHJcbiAgICAgICAgICBsZXQgbWF4SW5kZXggPSAoTWF0aC5mbG9vcih0aGlzLmltYWdlcy5sZW5ndGggLyB0aGlzLmdldFZpc2libGVDb3VudCgpKSAqIHRoaXMuY29sdW1ucyk7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW1hZ2VzLmxlbmd0aCAlIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCkgPiB0aGlzLmNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICBtYXhJbmRleCArPSB0aGlzLmNvbHVtbnM7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICBtYXhJbmRleCArPSB0aGlzLmltYWdlcy5sZW5ndGggJSB0aGlzLmdldFZpc2libGVDb3VudCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiBtYXhJbmRleDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5yb3dzKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRWaXNpYmxlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY29sdW1ucyAqIHRoaXMucm93cztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0U2FmZVN0eWxlKHZhbHVlOiBzdHJpbmcpOiBTYWZlU3R5bGUge1xyXG4gICAgICByZXR1cm4gdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKHZhbHVlKTtcclxuICB9XHJcbn1cclxuIiwiPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXRodW1ibmFpbHMtd3JhcHBlciBuZ3gtZ2FsbGVyeS10aHVtYm5haWwtc2l6ZS17e3NpemV9fVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXRodW1ibmFpbHNcIiBbc3R5bGUudHJhbnNmb3JtXT1cIid0cmFuc2xhdGVYKCcgKyB0aHVtYm5haWxzTGVmdCArICcpJ1wiIFtzdHlsZS5tYXJnaW5MZWZ0XT1cInRodW1ibmFpbHNNYXJnaW5MZWZ0XCI+XHJcbiAgICAgICAgPGEgW2hyZWZdPVwiaGFzTGluayhpKSA/IGxpbmtzW2ldIDogJyMnXCIgW3RhcmdldF09XCJsaW5rVGFyZ2V0XCIgY2xhc3M9XCJuZ3gtZ2FsbGVyeS10aHVtYm5haWxcIiAqbmdGb3I9XCJsZXQgaW1hZ2Ugb2YgZ2V0SW1hZ2VzKCk7IGxldCBpID0gaW5kZXg7XCIgW3N0eWxlLmJhY2tncm91bmQtaW1hZ2VdPVwiZ2V0U2FmZVVybChpbWFnZSlcIiAoY2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50LCBpKVwiIFtzdHlsZS53aWR0aF09XCJnZXRUaHVtYm5haWxXaWR0aCgpXCIgW3N0eWxlLmhlaWdodF09XCJnZXRUaHVtYm5haWxIZWlnaHQoKVwiIFtzdHlsZS5sZWZ0XT1cImdldFRodW1ibmFpbExlZnQoaSlcIiBbc3R5bGUudG9wXT1cImdldFRodW1ibmFpbFRvcChpKVwiIFtuZ0NsYXNzXT1cInsgJ25neC1nYWxsZXJ5LWFjdGl2ZSc6IGkgPT0gc2VsZWN0ZWRJbmRleCwgJ25neC1nYWxsZXJ5LWNsaWNrYWJsZSc6IGNsaWNrYWJsZSB9XCIgW2F0dHIuYXJpYS1sYWJlbF09XCJsYWJlbHNbaV1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb25zLXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nRm9yPVwibGV0IGFjdGlvbiBvZiBhY3Rpb25zXCIgW2ljb25dPVwiYWN0aW9uLmljb25cIiBbZGlzYWJsZWRdPVwiYWN0aW9uLmRpc2FibGVkXCIgW3RpdGxlVGV4dF09XCJhY3Rpb24udGl0bGVUZXh0XCIgKG9uQ2xpY2spPVwiYWN0aW9uLm9uQ2xpY2soJGV2ZW50LCBpKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXJlbWFpbmluZy1jb3VudC1vdmVybGF5XCIgKm5nSWY9XCJyZW1haW5pbmdDb3VudCAmJiByZW1haW5pbmdDb3VudFZhbHVlICYmIChpID09IChyb3dzICogY29sdW1ucykgLSAxKVwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJuZ3gtZ2FsbGVyeS1yZW1haW5pbmctY291bnRcIj4re3tyZW1haW5pbmdDb3VudFZhbHVlfX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYT5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuPG5neC1nYWxsZXJ5LWFycm93cyAqbmdJZj1cImNhblNob3dBcnJvd3MoKVwiIChvblByZXZDbGljayk9XCJtb3ZlTGVmdCgpXCIgKG9uTmV4dENsaWNrKT1cIm1vdmVSaWdodCgpXCIgW3ByZXZEaXNhYmxlZF09XCIhY2FuTW92ZUxlZnQoKVwiIFtuZXh0RGlzYWJsZWRdPVwiIWNhbk1vdmVSaWdodCgpXCIgW2Fycm93UHJldkljb25dPVwiYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImFycm93TmV4dEljb25cIj48L25neC1nYWxsZXJ5LWFycm93cz5cclxuIl19