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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.4", ngImport: i0, type: NgxGalleryThumbnailsComponent, deps: [{ token: i1.DomSanitizer }, { token: i0.ElementRef }, { token: i2.NgxGalleryHelperService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.1.4", type: NgxGalleryThumbnailsComponent, selector: "ngx-gallery-thumbnails", inputs: { images: "images", links: "links", labels: "labels", linkTarget: "linkTarget", columns: "columns", rows: "rows", arrows: "arrows", arrowsAutoHide: "arrowsAutoHide", margin: "margin", selectedIndex: "selectedIndex", clickable: "clickable", swipe: "swipe", size: "size", arrowPrevIcon: "arrowPrevIcon", arrowNextIcon: "arrowNextIcon", moveSize: "moveSize", order: "order", remainingCount: "remainingCount", lazyLoading: "lazyLoading", actions: "actions" }, outputs: { onActiveChange: "onActiveChange" }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" } }, usesOnChanges: true, ngImport: i0, template: "<div class=\"ngx-gallery-thumbnails-wrapper ngx-gallery-thumbnail-size-{{size}}\">\r\n    <div class=\"ngx-gallery-thumbnails\" [style.transform]=\"'translateX(' + thumbnailsLeft + ')'\" [style.marginLeft]=\"thumbnailsMarginLeft\">\r\n        <a [href]=\"hasLink(i) ? links[i] : '#'\" [target]=\"linkTarget\" class=\"ngx-gallery-thumbnail\" *ngFor=\"let image of getImages(); let i = index;\" [style.background-image]=\"getSafeUrl(image)\" (click)=\"handleClick($event, i)\" [style.width]=\"getThumbnailWidth()\" [style.height]=\"getThumbnailHeight()\" [style.left]=\"getThumbnailLeft(i)\" [style.top]=\"getThumbnailTop(i)\" [ngClass]=\"{ 'ngx-gallery-active': i == selectedIndex, 'ngx-gallery-clickable': clickable }\" [attr.aria-label]=\"labels[i]\">\r\n            <div class=\"ngx-gallery-icons-wrapper\">\r\n                <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, i)\"></ngx-gallery-action>\r\n            </div>\r\n            <div class=\"ngx-gallery-remaining-count-overlay\" *ngIf=\"remainingCount && remainingCountValue && (i == (rows * columns) - 1)\">\r\n                <span class=\"ngx-gallery-remaining-count\">+{{remainingCountValue}}</span>\r\n            </div>\r\n        </a>\r\n    </div>\r\n</div>\r\n<ngx-gallery-arrows *ngIf=\"canShowArrows()\" (onPrevClick)=\"moveLeft()\" (onNextClick)=\"moveRight()\" [prevDisabled]=\"!canMoveLeft()\" [nextDisabled]=\"!canMoveRight()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\r\n", styles: [":host{width:100%;display:inline-block;position:relative}.ngx-gallery-thumbnails-wrapper{width:100%;height:100%;position:absolute;overflow:hidden}.ngx-gallery-thumbnails{height:100%;width:100%;position:absolute;left:0;transform:translate(0);transition:transform .5s ease-in-out;will-change:transform}.ngx-gallery-thumbnails .ngx-gallery-thumbnail{position:absolute;height:100%;background-position:center;background-repeat:no-repeat;text-decoration:none}.ngx-gallery-thumbnail-size-cover .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:cover}.ngx-gallery-thumbnail-size-contain .ngx-gallery-thumbnails .ngx-gallery-thumbnail{background-size:contain}.ngx-gallery-remaining-count-overlay{width:100%;height:100%;position:absolute;left:0;top:0;background-color:#0006}.ngx-gallery-remaining-count{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:30px}\n"], dependencies: [{ kind: "directive", type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.NgxGalleryActionComponent, selector: "ngx-gallery-action", inputs: ["icon", "disabled", "titleText"], outputs: ["onClick"] }, { kind: "component", type: i5.NgxGalleryArrowsComponent, selector: "ngx-gallery-arrows", inputs: ["prevDisabled", "nextDisabled", "arrowPrevIcon", "arrowNextIcon"], outputs: ["onPrevClick", "onNextClick"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.4", ngImport: i0, type: NgxGalleryThumbnailsComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9vbmx1eWVuLWdhbGxlcnkvc3JjL2xpYi9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzL25neC1nYWxsZXJ5LXRodW1ibmFpbHMuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvb25sdXllbi1nYWxsZXJ5L3NyYy9saWIvbmd4LWdhbGxlcnktdGh1bWJuYWlscy9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWEsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQTZCLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzSCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7Ozs7Ozs7QUFPN0QsTUFBTSxPQUFPLDZCQUE2QjtJQWtDcEI7SUFBb0M7SUFDNUM7SUFqQ1osY0FBYyxDQUFTO0lBQ3ZCLG9CQUFvQixDQUFTO0lBQzdCLFVBQVUsQ0FBVTtJQUNwQixtQkFBbUIsQ0FBUztJQUU1QixZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBRVIsTUFBTSxDQUErQjtJQUNyQyxLQUFLLENBQVc7SUFDaEIsTUFBTSxDQUFXO0lBQ2pCLFVBQVUsQ0FBUztJQUNuQixPQUFPLENBQVM7SUFDaEIsSUFBSSxDQUFTO0lBQ2IsTUFBTSxDQUFVO0lBQ2hCLGNBQWMsQ0FBVTtJQUN4QixNQUFNLENBQVM7SUFDZixhQUFhLENBQVM7SUFDdEIsU0FBUyxDQUFVO0lBQ25CLEtBQUssQ0FBVTtJQUNmLElBQUksQ0FBUztJQUNiLGFBQWEsQ0FBUztJQUN0QixhQUFhLENBQVM7SUFDdEIsUUFBUSxDQUFTO0lBQ2pCLEtBQUssQ0FBZTtJQUNwQixjQUFjLENBQVU7SUFDeEIsV0FBVyxDQUFVO0lBQ3JCLE9BQU8s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QUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csY0FBYztzQkFBdEIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFFSSxjQUFjO3NCQUF2QixNQUFNO2dCQXNCcUIsWUFBWTtzQkFBdkMsWUFBWTt1QkFBQyxZQUFZO2dCQUlFLFlBQVk7c0JBQXZDLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25DaGFuZ2VzLCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIEVsZW1lbnRSZWYsIFNpbXBsZUNoYW5nZXMsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTYWZlUmVzb3VyY2VVcmwsIERvbVNhbml0aXplciwgU2FmZVN0eWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlBY3Rpb24gfSBmcm9tICcuLi9uZ3gtZ2FsbGVyeS1hY3Rpb24ubW9kZWwnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB9IGZyb20gJy4uL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktb3JkZXIubW9kZWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtZ2FsbGVyeS10aHVtYm5haWxzJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQuc2NzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcblxyXG4gIHRodW1ibmFpbHNMZWZ0OiBzdHJpbmc7XHJcbiAgdGh1bWJuYWlsc01hcmdpbkxlZnQ6IHN0cmluZztcclxuICBtb3VzZWVudGVyOiBib29sZWFuO1xyXG4gIHJlbWFpbmluZ0NvdW50VmFsdWU6IG51bWJlcjtcclxuXHJcbiAgbWluU3RvcEluZGV4ID0gMDtcclxuXHJcbiAgQElucHV0KCkgaW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xyXG4gIEBJbnB1dCgpIGxpbmtzOiBzdHJpbmdbXTtcclxuICBASW5wdXQoKSBsYWJlbHM6IHN0cmluZ1tdO1xyXG4gIEBJbnB1dCgpIGxpbmtUYXJnZXQ6IHN0cmluZztcclxuICBASW5wdXQoKSBjb2x1bW5zOiBudW1iZXI7XHJcbiAgQElucHV0KCkgcm93czogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGFycm93czogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhcnJvd3NBdXRvSGlkZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSBtYXJnaW46IG51bWJlcjtcclxuICBASW5wdXQoKSBzZWxlY3RlZEluZGV4OiBudW1iZXI7XHJcbiAgQElucHV0KCkgY2xpY2thYmxlOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHN3aXBlOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHNpemU6IHN0cmluZztcclxuICBASW5wdXQoKSBhcnJvd1ByZXZJY29uOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgYXJyb3dOZXh0SWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIG1vdmVTaXplOiBudW1iZXI7XHJcbiAgQElucHV0KCkgb3JkZXI6IG51bWJlciB8IGFueTtcclxuICBASW5wdXQoKSByZW1haW5pbmdDb3VudDogYm9vbGVhbjtcclxuICBASW5wdXQoKSBsYXp5TG9hZGluZzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhY3Rpb25zOiBOZ3hHYWxsZXJ5QWN0aW9uW107XHJcblxyXG4gIEBPdXRwdXQoKSBvbkFjdGl2ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcHJpdmF0ZSBpbmRleCA9IDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemF0aW9uOiBEb21TYW5pdGl6ZXIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgcHJpdmF0ZSBoZWxwZXJTZXJ2aWNlOiBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSkge31cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgICBpZiAoY2hhbmdlc1snc2VsZWN0ZWRJbmRleCddKSB7XHJcbiAgICAgICAgICB0aGlzLnZhbGlkYXRlSW5kZXgoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGNoYW5nZXNbJ3N3aXBlJ10pIHtcclxuICAgICAgICAgIHRoaXMuaGVscGVyU2VydmljZS5tYW5hZ2VTd2lwZSh0aGlzLnN3aXBlLCB0aGlzLmVsZW1lbnRSZWYsXHJcbiAgICAgICAgICAndGh1bWJuYWlscycsICgpID0+IHRoaXMubW92ZVJpZ2h0KCksICgpID0+IHRoaXMubW92ZUxlZnQoKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmltYWdlcykge1xyXG4gICAgICAgICAgdGhpcy5yZW1haW5pbmdDb3VudFZhbHVlID0gdGhpcy5pbWFnZXMubGVuZ3RoIC0gKHRoaXMucm93cyAqIHRoaXMuY29sdW1ucyk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XHJcbiAgICAgIHRoaXMubW91c2VlbnRlciA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJykgb25Nb3VzZUxlYXZlKCkge1xyXG4gICAgICB0aGlzLm1vdXNlZW50ZXIgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIHJlc2V0KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XHJcbiAgICAgIHRoaXMuc2V0RGVmYXVsdFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICB0aGlzLmluZGV4ID0gMDtcclxuICAgICAgdGhpcy52YWxpZGF0ZUluZGV4KCk7XHJcbiAgfVxyXG5cclxuICBnZXRJbWFnZXMoKTogc3RyaW5nW10gfCBTYWZlUmVzb3VyY2VVcmxbXSB7XHJcbiAgICAgIGlmICghdGhpcy5pbWFnZXMpIHtcclxuICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucmVtYWluaW5nQ291bnQpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmltYWdlcy5zbGljZSgwLCB0aGlzLnJvd3MgKiB0aGlzLmNvbHVtbnMpO1xyXG4gICAgICB9IFxyXG4gICAgICBlbHNlIGlmICh0aGlzLmxhenlMb2FkaW5nICYmIHRoaXMub3JkZXIgIT0gTmd4R2FsbGVyeU9yZGVyLlJvdykge1xyXG4gICAgICAgICAgbGV0IHN0b3BJbmRleCA9IDA7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5Db2x1bW4pIHtcclxuICAgICAgICAgICAgICBzdG9wSW5kZXggPSAodGhpcy5pbmRleCArIHRoaXMuY29sdW1ucyArIHRoaXMubW92ZVNpemUpICogdGhpcy5yb3dzO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gTmd4R2FsbGVyeU9yZGVyLlBhZ2UpIHtcclxuICAgICAgICAgICAgICBzdG9wSW5kZXggPSB0aGlzLmluZGV4ICsgKCh0aGlzLmNvbHVtbnMgKiB0aGlzLnJvd3MpICogMik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHN0b3BJbmRleCA8PSB0aGlzLm1pblN0b3BJbmRleCkge1xyXG4gICAgICAgICAgICAgIHN0b3BJbmRleCA9IHRoaXMubWluU3RvcEluZGV4O1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLm1pblN0b3BJbmRleCA9IHN0b3BJbmRleDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMuc2xpY2UoMCwgc3RvcEluZGV4KTtcclxuICAgICAgfSBcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXM7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBFdmVudCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBpZiAoIXRoaXMuaGFzTGluayhpbmRleCkpIHtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgdGhpcy5vbkFjdGl2ZUNoYW5nZS5lbWl0KGluZGV4KTtcclxuXHJcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGhhc0xpbmsoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAodGhpcy5saW5rcyAmJiB0aGlzLmxpbmtzLmxlbmd0aCAmJiB0aGlzLmxpbmtzW2luZGV4XSkgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBtb3ZlUmlnaHQoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmNhbk1vdmVSaWdodCgpKSB7XHJcbiAgICAgICAgICB0aGlzLmluZGV4ICs9IHRoaXMubW92ZVNpemU7XHJcbiAgICAgICAgICBsZXQgbWF4SW5kZXggPSB0aGlzLmdldE1heEluZGV4KCkgLSB0aGlzLmNvbHVtbnM7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW5kZXggPiBtYXhJbmRleCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBtYXhJbmRleDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLnNldFRodW1ibmFpbHNQb3NpdGlvbigpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBtb3ZlTGVmdCgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuY2FuTW92ZUxlZnQoKSkge1xyXG4gICAgICAgICAgdGhpcy5pbmRleCAtPSB0aGlzLm1vdmVTaXplO1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuc2V0VGh1bWJuYWlsc1Bvc2l0aW9uKCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGNhbk1vdmVSaWdodCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5kZXggKyB0aGlzLmNvbHVtbnMgPCB0aGlzLmdldE1heEluZGV4KCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjYW5Nb3ZlTGVmdCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5kZXggIT09IDAgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICBnZXRUaHVtYm5haWxMZWZ0KGluZGV4OiBudW1iZXIpOiBTYWZlU3R5bGUge1xyXG4gICAgICBsZXQgY2FsY3VsYXRlZEluZGV4O1xyXG5cclxuICAgICAgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5Db2x1bW4pIHtcclxuICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyB0aGlzLnJvd3MpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5QYWdlKSB7XHJcbiAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSAoaW5kZXggJSB0aGlzLmNvbHVtbnMpICsgKE1hdGguZmxvb3IoaW5kZXggLyAodGhpcy5yb3dzICogdGhpcy5jb2x1bW5zKSkgKiB0aGlzLmNvbHVtbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT0gTmd4R2FsbGVyeU9yZGVyLlJvdyAmJiB0aGlzLnJlbWFpbmluZ0NvdW50KSB7XHJcbiAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBpbmRleCAlIHRoaXMuY29sdW1ucztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IGluZGV4ICUgTWF0aC5jZWlsKHRoaXMuaW1hZ2VzLmxlbmd0aCAvIHRoaXMucm93cyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdldFRodW1ibmFpbFBvc2l0aW9uKGNhbGN1bGF0ZWRJbmRleCwgdGhpcy5jb2x1bW5zKTtcclxuICB9XHJcblxyXG4gIGdldFRodW1ibmFpbFRvcChpbmRleDogbnVtYmVyKTogU2FmZVN0eWxlIHtcclxuICAgICAgbGV0IGNhbGN1bGF0ZWRJbmRleDtcclxuXHJcbiAgICAgIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuQ29sdW1uKSB7XHJcbiAgICAgICAgICBjYWxjdWxhdGVkSW5kZXggPSBpbmRleCAlIHRoaXMucm93cztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSBOZ3hHYWxsZXJ5T3JkZXIuUGFnZSkge1xyXG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIHRoaXMuY29sdW1ucykgLSAoTWF0aC5mbG9vcihpbmRleCAvICh0aGlzLnJvd3MgKiB0aGlzLmNvbHVtbnMpKSAqIHRoaXMucm93cyk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PSBOZ3hHYWxsZXJ5T3JkZXIuUm93ICYmIHRoaXMucmVtYWluaW5nQ291bnQpIHtcclxuICAgICAgICAgIGNhbGN1bGF0ZWRJbmRleCA9IE1hdGguZmxvb3IoaW5kZXggLyB0aGlzLmNvbHVtbnMpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgY2FsY3VsYXRlZEluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIE1hdGguY2VpbCh0aGlzLmltYWdlcy5sZW5ndGggLyB0aGlzLnJvd3MpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGh1bWJuYWlsUG9zaXRpb24oY2FsY3VsYXRlZEluZGV4LCB0aGlzLnJvd3MpO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGh1bWJuYWlsV2lkdGgoKTogU2FmZVN0eWxlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGh1bWJuYWlsRGltZW5zaW9uKHRoaXMuY29sdW1ucyk7XHJcbiAgfVxyXG5cclxuICBnZXRUaHVtYm5haWxIZWlnaHQoKTogU2FmZVN0eWxlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0VGh1bWJuYWlsRGltZW5zaW9uKHRoaXMucm93cyk7XHJcbiAgfVxyXG5cclxuICBzZXRUaHVtYm5haWxzUG9zaXRpb24oKTogdm9pZCB7XHJcbiAgICAgIHRoaXMudGh1bWJuYWlsc0xlZnQgPSAtICgoMTAwIC8gdGhpcy5jb2x1bW5zKSAqIHRoaXMuaW5kZXgpICsgJyUnXHJcblxyXG4gICAgICB0aGlzLnRodW1ibmFpbHNNYXJnaW5MZWZ0ID0gLSAoKHRoaXMubWFyZ2luIC0gKCgodGhpcy5jb2x1bW5zIC0gMSlcclxuICAgICAgKiB0aGlzLm1hcmdpbikgLyB0aGlzLmNvbHVtbnMpKSAqIHRoaXMuaW5kZXgpICsgJ3B4JztcclxuICB9XHJcblxyXG4gIHNldERlZmF1bHRQb3NpdGlvbigpOiB2b2lkIHtcclxuICAgICAgdGhpcy50aHVtYm5haWxzTGVmdCA9ICcwcHgnO1xyXG4gICAgICB0aGlzLnRodW1ibmFpbHNNYXJnaW5MZWZ0ID0gJzBweCc7XHJcbiAgfVxyXG5cclxuICBjYW5TaG93QXJyb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAodGhpcy5yZW1haW5pbmdDb3VudCkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXJyb3dzICYmIHRoaXMuaW1hZ2VzICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCA+IHRoaXMuZ2V0VmlzaWJsZUNvdW50KClcclxuICAgICAgICAgICYmICghdGhpcy5hcnJvd3NBdXRvSGlkZSB8fCB0aGlzLm1vdXNlZW50ZXIpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGVJbmRleCgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW1hZ2VzKSB7XHJcbiAgICAgICAgICBsZXQgbmV3SW5kZXg7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMub3JkZXIgPT09IE5neEdhbGxlcnlPcmRlci5Db2x1bW4pIHtcclxuICAgICAgICAgICAgICBuZXdJbmRleCA9IE1hdGguZmxvb3IodGhpcy5zZWxlY3RlZEluZGV4IC8gdGhpcy5yb3dzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgbmV3SW5kZXggPSB0aGlzLnNlbGVjdGVkSW5kZXggJSBNYXRoLmNlaWwodGhpcy5pbWFnZXMubGVuZ3RoIC8gdGhpcy5yb3dzKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5yZW1haW5pbmdDb3VudCkge1xyXG4gICAgICAgICAgICAgIG5ld0luZGV4ID0gMDtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAobmV3SW5kZXggPCB0aGlzLmluZGV4IHx8IG5ld0luZGV4ID49IHRoaXMuaW5kZXggKyB0aGlzLmNvbHVtbnMpIHtcclxuICAgICAgICAgICAgICBjb25zdCBtYXhJbmRleCA9IHRoaXMuZ2V0TWF4SW5kZXgoKSAtIHRoaXMuY29sdW1ucztcclxuICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gbmV3SW5kZXggPiBtYXhJbmRleCA/IG1heEluZGV4IDogbmV3SW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgIHRoaXMuc2V0VGh1bWJuYWlsc1Bvc2l0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGdldFNhZmVVcmwoaW1hZ2U6IHN0cmluZyB8IGFueSk6IFNhZmVTdHlsZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUodGhpcy5oZWxwZXJTZXJ2aWNlLmdldEJhY2tncm91bmRVcmwoaW1hZ2UpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0VGh1bWJuYWlsUG9zaXRpb24oaW5kZXg6IG51bWJlciwgY291bnQ6IG51bWJlcik6IFNhZmVTdHlsZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFNhZmVTdHlsZSgnY2FsYygnICsgKCgxMDAgLyBjb3VudCkgKiBpbmRleCkgKyAnJSArICdcclxuICAgICAgICAgICsgKCh0aGlzLm1hcmdpbiAtICgoKGNvdW50IC0gMSkgKiB0aGlzLm1hcmdpbikgLyBjb3VudCkpICogaW5kZXgpICsgJ3B4KScpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRUaHVtYm5haWxEaW1lbnNpb24oY291bnQ6IG51bWJlcik6IFNhZmVTdHlsZSB7XHJcbiAgICAgIGlmICh0aGlzLm1hcmdpbiAhPT0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2FmZVN0eWxlKCdjYWxjKCcgKyAoMTAwIC8gY291bnQpICsgJyUgLSAnXHJcbiAgICAgICAgICAgICAgKyAoKChjb3VudCAtIDEpICogdGhpcy5tYXJnaW4pIC8gY291bnQpICsgJ3B4KScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2FmZVN0eWxlKCdjYWxjKCcgKyAoMTAwIC8gY291bnQpICsgJyUgKyAxcHgpJyk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0TWF4SW5kZXgoKTogbnVtYmVyIHtcclxuICAgICAgaWYgKHRoaXMub3JkZXIgPT0gTmd4R2FsbGVyeU9yZGVyLlBhZ2UpIHtcclxuICAgICAgICAgIGxldCBtYXhJbmRleCA9IChNYXRoLmZsb29yKHRoaXMuaW1hZ2VzLmxlbmd0aCAvIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCkpICogdGhpcy5jb2x1bW5zKTtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWFnZXMubGVuZ3RoICUgdGhpcy5nZXRWaXNpYmxlQ291bnQoKSA+IHRoaXMuY29sdW1ucykge1xyXG4gICAgICAgICAgICAgIG1heEluZGV4ICs9IHRoaXMuY29sdW1ucztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIG1heEluZGV4ICs9IHRoaXMuaW1hZ2VzLmxlbmd0aCAlIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0dXJuIG1heEluZGV4O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh0aGlzLmltYWdlcy5sZW5ndGggLyB0aGlzLnJvd3MpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFZpc2libGVDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5jb2x1bW5zICogdGhpcy5yb3dzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRTYWZlU3R5bGUodmFsdWU6IHN0cmluZyk6IFNhZmVTdHlsZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0U3R5bGUodmFsdWUpO1xyXG4gIH1cclxufVxyXG4iLCI8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktdGh1bWJuYWlscy13cmFwcGVyIG5neC1nYWxsZXJ5LXRodW1ibmFpbC1zaXplLXt7c2l6ZX19XCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktdGh1bWJuYWlsc1wiIFtzdHlsZS50cmFuc2Zvcm1dPVwiJ3RyYW5zbGF0ZVgoJyArIHRodW1ibmFpbHNMZWZ0ICsgJyknXCIgW3N0eWxlLm1hcmdpbkxlZnRdPVwidGh1bWJuYWlsc01hcmdpbkxlZnRcIj5cclxuICAgICAgICA8YSBbaHJlZl09XCJoYXNMaW5rKGkpID8gbGlua3NbaV0gOiAnIydcIiBbdGFyZ2V0XT1cImxpbmtUYXJnZXRcIiBjbGFzcz1cIm5neC1nYWxsZXJ5LXRodW1ibmFpbFwiICpuZ0Zvcj1cImxldCBpbWFnZSBvZiBnZXRJbWFnZXMoKTsgbGV0IGkgPSBpbmRleDtcIiBbc3R5bGUuYmFja2dyb3VuZC1pbWFnZV09XCJnZXRTYWZlVXJsKGltYWdlKVwiIChjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQsIGkpXCIgW3N0eWxlLndpZHRoXT1cImdldFRodW1ibmFpbFdpZHRoKClcIiBbc3R5bGUuaGVpZ2h0XT1cImdldFRodW1ibmFpbEhlaWdodCgpXCIgW3N0eWxlLmxlZnRdPVwiZ2V0VGh1bWJuYWlsTGVmdChpKVwiIFtzdHlsZS50b3BdPVwiZ2V0VGh1bWJuYWlsVG9wKGkpXCIgW25nQ2xhc3NdPVwieyAnbmd4LWdhbGxlcnktYWN0aXZlJzogaSA9PSBzZWxlY3RlZEluZGV4LCAnbmd4LWdhbGxlcnktY2xpY2thYmxlJzogY2xpY2thYmxlIH1cIiBbYXR0ci5hcmlhLWxhYmVsXT1cImxhYmVsc1tpXVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktaWNvbnMtd3JhcHBlclwiPlxyXG4gICAgICAgICAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdGb3I9XCJsZXQgYWN0aW9uIG9mIGFjdGlvbnNcIiBbaWNvbl09XCJhY3Rpb24uaWNvblwiIFtkaXNhYmxlZF09XCJhY3Rpb24uZGlzYWJsZWRcIiBbdGl0bGVUZXh0XT1cImFjdGlvbi50aXRsZVRleHRcIiAob25DbGljayk9XCJhY3Rpb24ub25DbGljaygkZXZlbnQsIGkpXCI+PC9uZ3gtZ2FsbGVyeS1hY3Rpb24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktcmVtYWluaW5nLWNvdW50LW92ZXJsYXlcIiAqbmdJZj1cInJlbWFpbmluZ0NvdW50ICYmIHJlbWFpbmluZ0NvdW50VmFsdWUgJiYgKGkgPT0gKHJvd3MgKiBjb2x1bW5zKSAtIDEpXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5neC1nYWxsZXJ5LXJlbWFpbmluZy1jb3VudFwiPit7e3JlbWFpbmluZ0NvdW50VmFsdWV9fTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9hPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG48bmd4LWdhbGxlcnktYXJyb3dzICpuZ0lmPVwiY2FuU2hvd0Fycm93cygpXCIgKG9uUHJldkNsaWNrKT1cIm1vdmVMZWZ0KClcIiAob25OZXh0Q2xpY2spPVwibW92ZVJpZ2h0KClcIiBbcHJldkRpc2FibGVkXT1cIiFjYW5Nb3ZlTGVmdCgpXCIgW25leHREaXNhYmxlZF09XCIhY2FuTW92ZVJpZ2h0KClcIiBbYXJyb3dQcmV2SWNvbl09XCJhcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiYXJyb3dOZXh0SWNvblwiPjwvbmd4LWdhbGxlcnktYXJyb3dzPlxyXG4iXX0=