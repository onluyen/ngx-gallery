import { Component, EventEmitter, Output, ViewChild, HostBinding, HostListener, Input } from '@angular/core';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
import { NgxGalleryOptions } from './ngx-gallery-options';
import { NgxGalleryOrderedImage } from './ngx-gallery-ordered-image.model';
import { NgxGalleryPreviewComponent } from './ngx-gallery-preview/ngx-gallery-preview.component';
import { NgxGalleryImageComponent } from './ngx-gallery-image/ngx-gallery-image.component';
import { NgxGalleryThumbnailsComponent } from './ngx-gallery-thumbnails/ngx-gallery-thumbnails.component';
import { NgxGalleryLayout } from './ngx-gallery-layout.model';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./ngx-gallery-preview/ngx-gallery-preview.component";
import * as i3 from "./ngx-gallery-image/ngx-gallery-image.component";
import * as i4 from "./ngx-gallery-thumbnails/ngx-gallery-thumbnails.component";
export class NgxGalleryComponent {
    constructor(myElement) {
        this.myElement = myElement;
        this.imagesReady = new EventEmitter();
        this.change = new EventEmitter();
        this.previewOpen = new EventEmitter();
        this.previewClose = new EventEmitter();
        this.previewChange = new EventEmitter();
        this.oldImagesLength = 0;
        this.selectedIndex = 0;
        this.breakpoint = undefined;
        this.prevBreakpoint = undefined;
    }
    ngOnInit() {
        this.options = this.options.map((opt) => new NgxGalleryOptions(opt));
        this.sortOptions();
        this.setBreakpoint();
        this.setOptions();
        this.checkFullWidth();
        if (this.currentOptions) {
            this.selectedIndex = this.currentOptions.startIndex;
        }
    }
    ngDoCheck() {
        if (this.images !== undefined && (this.images.length !== this.oldImagesLength)
            || (this.images !== this.oldImages)) {
            this.oldImagesLength = this.images.length;
            this.oldImages = this.images;
            this.setOptions();
            this.setImages();
            if (this.images && this.images.length) {
                this.imagesReady.emit();
            }
            if (this.image) {
                this.image.reset(this.currentOptions.startIndex);
            }
            if (this.currentOptions.thumbnailsAutoHide && this.currentOptions.thumbnails
                && this.images.length <= 1) {
                this.currentOptions.thumbnails = false;
                this.currentOptions.imageArrows = false;
            }
            this.resetThumbnails();
        }
    }
    ngAfterViewInit() {
        this.checkFullWidth();
    }
    onResize() {
        this.setBreakpoint();
        if (this.prevBreakpoint !== this.breakpoint) {
            this.setOptions();
            this.resetThumbnails();
        }
        if (this.currentOptions && this.currentOptions.fullWidth) {
            if (this.fullWidthTimeout) {
                clearTimeout(this.fullWidthTimeout);
            }
            this.fullWidthTimeout = setTimeout(() => {
                this.checkFullWidth();
            }, 200);
        }
    }
    getImageHeight() {
        return (this.currentOptions && this.currentOptions.thumbnails) ?
            this.currentOptions.imagePercent + '%' : '100%';
    }
    getThumbnailsHeight() {
        if (this.currentOptions && this.currentOptions.image) {
            return 'calc(' + this.currentOptions.thumbnailsPercent + '% - '
                + this.currentOptions.thumbnailsMargin + 'px)';
        }
        else {
            return '100%';
        }
    }
    getThumbnailsMarginTop() {
        if (this.currentOptions && this.currentOptions.layout === NgxGalleryLayout.ThumbnailsBottom) {
            return this.currentOptions.thumbnailsMargin + 'px';
        }
        else {
            return '0px';
        }
    }
    getThumbnailsMarginBottom() {
        if (this.currentOptions && this.currentOptions.layout === NgxGalleryLayout.ThumbnailsTop) {
            return this.currentOptions.thumbnailsMargin + 'px';
        }
        else {
            return '0px';
        }
    }
    openPreview(index) {
        if (this.currentOptions.previewCustom) {
            this.currentOptions.previewCustom(index);
        }
        else {
            this.previewEnabled = true;
            this.preview.open(index);
        }
    }
    onPreviewOpen() {
        this.previewOpen.emit();
        if (this.image && this.image.autoPlay) {
            this.image.stopAutoPlay();
        }
    }
    onPreviewClose() {
        this.previewEnabled = false;
        this.previewClose.emit();
        if (this.image && this.image.autoPlay) {
            this.image.startAutoPlay();
        }
    }
    selectFromImage(index) {
        this.select(index);
    }
    selectFromThumbnails(index) {
        this.select(index);
        if (this.currentOptions && this.currentOptions.thumbnails && this.currentOptions.preview
            && (!this.currentOptions.image || this.currentOptions.thumbnailsRemainingCount)) {
            this.openPreview(this.selectedIndex);
        }
    }
    show(index) {
        this.select(index);
    }
    showNext() {
        this.image.showNext();
    }
    showPrev() {
        this.image.showPrev();
    }
    canShowNext() {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex < this.images.length - 1)
                ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.images && this.currentOptions) {
            return (this.currentOptions.imageInfinityMove || this.selectedIndex > 0) ? true : false;
        }
        else {
            return false;
        }
    }
    previewSelect(index) {
        this.previewChange.emit({ index, image: this.images[index] });
    }
    moveThumbnailsRight() {
        this.thubmnails.moveRight();
    }
    moveThumbnailsLeft() {
        this.thubmnails.moveLeft();
    }
    canMoveThumbnailsRight() {
        return this.thubmnails.canMoveRight();
    }
    canMoveThumbnailsLeft() {
        return this.thubmnails.canMoveLeft();
    }
    resetThumbnails() {
        if (this.thubmnails) {
            this.thubmnails.reset(this.currentOptions.startIndex);
        }
    }
    select(index) {
        this.selectedIndex = index;
        this.change.emit({
            index,
            image: this.images[index]
        });
    }
    checkFullWidth() {
        if (this.currentOptions && this.currentOptions.fullWidth) {
            this.width = document.body.clientWidth + 'px';
            this.left = (-(document.body.clientWidth -
                this.myElement.nativeElement.parentNode.innerWidth) / 2) + 'px';
        }
    }
    setImages() {
        this.smallImages = this.images.map((img) => img.small);
        this.mediumImages = this.images.map((img, i) => new NgxGalleryOrderedImage({
            src: img.medium,
            index: i
        }));
        this.bigImages = this.images.map((img) => img.big);
        this.descriptions = this.images.map((img) => img.description);
        this.links = this.images.map((img) => img.url);
        this.labels = this.images.map((img) => img.label);
    }
    setBreakpoint() {
        this.prevBreakpoint = this.breakpoint;
        let breakpoints;
        if (typeof window !== 'undefined') {
            breakpoints = this.options.filter((opt) => opt.breakpoint >= window.innerWidth)
                .map((opt) => opt.breakpoint);
        }
        if (breakpoints && breakpoints.length) {
            this.breakpoint = breakpoints.pop();
        }
        else {
            this.breakpoint = undefined;
        }
    }
    sortOptions() {
        this.options = [
            ...this.options.filter((a) => a.breakpoint === undefined),
            ...this.options
                .filter((a) => a.breakpoint !== undefined)
                .sort((a, b) => b.breakpoint - a.breakpoint)
        ];
    }
    setOptions() {
        this.currentOptions = new NgxGalleryOptions({});
        this.options
            .filter((opt) => opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint)
            .map((opt) => this.combineOptions(this.currentOptions, opt));
        this.width = this.currentOptions.width;
        this.height = this.currentOptions.height;
    }
    combineOptions(first, second) {
        Object.keys(second).map((val) => first[val] = second[val] !== undefined ? second[val] : first[val]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.1", ngImport: i0, type: NgxGalleryComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.1", type: NgxGalleryComponent, selector: "ngx-gallery", inputs: { options: "options", images: "images" }, outputs: { imagesReady: "imagesReady", change: "change", previewOpen: "previewOpen", previewClose: "previewClose", previewChange: "previewChange" }, host: { listeners: { "window:resize": "onResize()" }, properties: { "style.width": "this.width", "style.height": "this.height", "style.left": "this.left" } }, providers: [NgxGalleryHelperService], viewQueries: [{ propertyName: "preview", first: true, predicate: NgxGalleryPreviewComponent, descendants: true }, { propertyName: "image", first: true, predicate: NgxGalleryImageComponent, descendants: true }, { propertyName: "thubmnails", first: true, predicate: NgxGalleryThumbnailsComponent, descendants: true }], ngImport: i0, template: `
    <div class="ngx-gallery-layout {{currentOptions?.layout}}">
      <ngx-gallery-image *ngIf="currentOptions?.image" [style.height]="getImageHeight()" [images]="mediumImages" [clickable]="currentOptions?.preview" [selectedIndex]="selectedIndex" [arrows]="currentOptions?.imageArrows" [arrowsAutoHide]="currentOptions?.imageArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [swipe]="currentOptions?.imageSwipe" [animation]="currentOptions?.imageAnimation" [size]="currentOptions?.imageSize" [autoPlay]="currentOptions?.imageAutoPlay" [autoPlayInterval]="currentOptions?.imageAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.imageAutoPlayPauseOnHover" [infinityMove]="currentOptions?.imageInfinityMove"  [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.imageActions" [descriptions]="descriptions" [showDescription]="currentOptions?.imageDescription" [bullets]="currentOptions?.imageBullets" (onClick)="openPreview($event)" (onActiveChange)="selectFromImage($event)"></ngx-gallery-image>

      <ngx-gallery-thumbnails *ngIf="currentOptions?.thumbnails" [style.marginTop]="getThumbnailsMarginTop()" [style.marginBottom]="getThumbnailsMarginBottom()" [style.height]="getThumbnailsHeight()" [images]="smallImages" [links]="currentOptions?.thumbnailsAsLinks ? links : []" [labels]="labels" [linkTarget]="currentOptions?.linkTarget" [selectedIndex]="selectedIndex" [columns]="currentOptions?.thumbnailsColumns" [rows]="currentOptions?.thumbnailsRows" [margin]="currentOptions?.thumbnailMargin" [arrows]="currentOptions?.thumbnailsArrows" [arrowsAutoHide]="currentOptions?.thumbnailsArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [clickable]="currentOptions?.image || currentOptions?.preview" [swipe]="currentOptions?.thumbnailsSwipe" [size]="currentOptions?.thumbnailSize" [moveSize]="currentOptions?.thumbnailsMoveSize" [order]="currentOptions?.thumbnailsOrder" [remainingCount]="currentOptions?.thumbnailsRemainingCount" [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.thumbnailActions"  (onActiveChange)="selectFromThumbnails($event)"></ngx-gallery-thumbnails>

      <ngx-gallery-preview [images]="bigImages" [descriptions]="descriptions" [showDescription]="currentOptions?.previewDescription" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [closeIcon]="currentOptions?.closeIcon" [fullscreenIcon]="currentOptions?.fullscreenIcon" [spinnerIcon]="currentOptions?.spinnerIcon" [arrows]="currentOptions?.previewArrows" [arrowsAutoHide]="currentOptions?.previewArrowsAutoHide" [swipe]="currentOptions?.previewSwipe" [fullscreen]="currentOptions?.previewFullscreen" [forceFullscreen]="currentOptions?.previewForceFullscreen" [closeOnClick]="currentOptions?.previewCloseOnClick" [closeOnEsc]="currentOptions?.previewCloseOnEsc" [keyboardNavigation]="currentOptions?.previewKeyboardNavigation" [animation]="currentOptions?.previewAnimation" [autoPlay]="currentOptions?.previewAutoPlay" [autoPlayInterval]="currentOptions?.previewAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.previewAutoPlayPauseOnHover" [infinityMove]="currentOptions?.previewInfinityMove" [zoom]="currentOptions?.previewZoom" [zoomStep]="currentOptions?.previewZoomStep" [zoomMax]="currentOptions?.previewZoomMax" [zoomMin]="currentOptions?.previewZoomMin" [zoomInIcon]="currentOptions?.zoomInIcon" [zoomOutIcon]="currentOptions?.zoomOutIcon" [actions]="currentOptions?.actions" [rotate]="currentOptions?.previewRotate" [rotateLeftIcon]="currentOptions?.rotateLeftIcon" [rotateRightIcon]="currentOptions?.rotateRightIcon" [download]="currentOptions?.previewDownload" [downloadIcon]="currentOptions?.downloadIcon" [bullets]="currentOptions?.previewBullets" (onClose)="onPreviewClose()" (onOpen)="onPreviewOpen()" (onActiveChange)="previewSelect($event)" [class.ngx-gallery-active]="previewEnabled"></ngx-gallery-preview>
    </div>
  `, isInline: true, styles: [":host{display:inline-block}:host>*{float:left}:host ::ng-deep *{box-sizing:border-box}:host ::ng-deep .ngx-gallery-icon{color:#fff;font-size:25px;position:absolute;z-index:2000;display:inline-block}:host ::ng-deep .ngx-gallery-icon .ngx-gallery-icon-content{display:block}:host ::ng-deep .ngx-gallery-clickable{cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper .ngx-gallery-icon{position:relative;margin-right:5px;margin-top:5px;font-size:20px;cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper{float:right}:host .ngx-gallery-layout{width:100%;height:100%;display:flex;flex-direction:column}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-image{order:2}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-thumbnails{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-image{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-thumbnails{order:2}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NgxGalleryPreviewComponent, selector: "ngx-gallery-preview", inputs: ["images", "descriptions", "showDescription", "arrows", "arrowsAutoHide", "swipe", "fullscreen", "forceFullscreen", "closeOnClick", "closeOnEsc", "keyboardNavigation", "arrowPrevIcon", "arrowNextIcon", "closeIcon", "fullscreenIcon", "spinnerIcon", "autoPlay", "autoPlayInterval", "autoPlayPauseOnHover", "infinityMove", "zoom", "zoomStep", "zoomMax", "zoomMin", "zoomInIcon", "zoomOutIcon", "animation", "actions", "rotate", "rotateLeftIcon", "rotateRightIcon", "download", "downloadIcon", "bullets"], outputs: ["onOpen", "onClose", "onActiveChange"] }, { kind: "component", type: i3.NgxGalleryImageComponent, selector: "ngx-gallery-image", inputs: ["images", "clickable", "selectedIndex", "arrows", "arrowsAutoHide", "swipe", "animation", "size", "arrowPrevIcon", "arrowNextIcon", "autoPlay", "autoPlayInterval", "autoPlayPauseOnHover", "infinityMove", "lazyLoading", "actions", "descriptions", "showDescription", "bullets"], outputs: ["onClick", "onActiveChange"] }, { kind: "component", type: i4.NgxGalleryThumbnailsComponent, selector: "ngx-gallery-thumbnails", inputs: ["images", "links", "labels", "linkTarget", "columns", "rows", "arrows", "arrowsAutoHide", "margin", "selectedIndex", "clickable", "swipe", "size", "arrowPrevIcon", "arrowNextIcon", "moveSize", "order", "remainingCount", "lazyLoading", "actions"], outputs: ["onActiveChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.1", ngImport: i0, type: NgxGalleryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery', template: `
    <div class="ngx-gallery-layout {{currentOptions?.layout}}">
      <ngx-gallery-image *ngIf="currentOptions?.image" [style.height]="getImageHeight()" [images]="mediumImages" [clickable]="currentOptions?.preview" [selectedIndex]="selectedIndex" [arrows]="currentOptions?.imageArrows" [arrowsAutoHide]="currentOptions?.imageArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [swipe]="currentOptions?.imageSwipe" [animation]="currentOptions?.imageAnimation" [size]="currentOptions?.imageSize" [autoPlay]="currentOptions?.imageAutoPlay" [autoPlayInterval]="currentOptions?.imageAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.imageAutoPlayPauseOnHover" [infinityMove]="currentOptions?.imageInfinityMove"  [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.imageActions" [descriptions]="descriptions" [showDescription]="currentOptions?.imageDescription" [bullets]="currentOptions?.imageBullets" (onClick)="openPreview($event)" (onActiveChange)="selectFromImage($event)"></ngx-gallery-image>

      <ngx-gallery-thumbnails *ngIf="currentOptions?.thumbnails" [style.marginTop]="getThumbnailsMarginTop()" [style.marginBottom]="getThumbnailsMarginBottom()" [style.height]="getThumbnailsHeight()" [images]="smallImages" [links]="currentOptions?.thumbnailsAsLinks ? links : []" [labels]="labels" [linkTarget]="currentOptions?.linkTarget" [selectedIndex]="selectedIndex" [columns]="currentOptions?.thumbnailsColumns" [rows]="currentOptions?.thumbnailsRows" [margin]="currentOptions?.thumbnailMargin" [arrows]="currentOptions?.thumbnailsArrows" [arrowsAutoHide]="currentOptions?.thumbnailsArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [clickable]="currentOptions?.image || currentOptions?.preview" [swipe]="currentOptions?.thumbnailsSwipe" [size]="currentOptions?.thumbnailSize" [moveSize]="currentOptions?.thumbnailsMoveSize" [order]="currentOptions?.thumbnailsOrder" [remainingCount]="currentOptions?.thumbnailsRemainingCount" [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.thumbnailActions"  (onActiveChange)="selectFromThumbnails($event)"></ngx-gallery-thumbnails>

      <ngx-gallery-preview [images]="bigImages" [descriptions]="descriptions" [showDescription]="currentOptions?.previewDescription" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [closeIcon]="currentOptions?.closeIcon" [fullscreenIcon]="currentOptions?.fullscreenIcon" [spinnerIcon]="currentOptions?.spinnerIcon" [arrows]="currentOptions?.previewArrows" [arrowsAutoHide]="currentOptions?.previewArrowsAutoHide" [swipe]="currentOptions?.previewSwipe" [fullscreen]="currentOptions?.previewFullscreen" [forceFullscreen]="currentOptions?.previewForceFullscreen" [closeOnClick]="currentOptions?.previewCloseOnClick" [closeOnEsc]="currentOptions?.previewCloseOnEsc" [keyboardNavigation]="currentOptions?.previewKeyboardNavigation" [animation]="currentOptions?.previewAnimation" [autoPlay]="currentOptions?.previewAutoPlay" [autoPlayInterval]="currentOptions?.previewAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.previewAutoPlayPauseOnHover" [infinityMove]="currentOptions?.previewInfinityMove" [zoom]="currentOptions?.previewZoom" [zoomStep]="currentOptions?.previewZoomStep" [zoomMax]="currentOptions?.previewZoomMax" [zoomMin]="currentOptions?.previewZoomMin" [zoomInIcon]="currentOptions?.zoomInIcon" [zoomOutIcon]="currentOptions?.zoomOutIcon" [actions]="currentOptions?.actions" [rotate]="currentOptions?.previewRotate" [rotateLeftIcon]="currentOptions?.rotateLeftIcon" [rotateRightIcon]="currentOptions?.rotateRightIcon" [download]="currentOptions?.previewDownload" [downloadIcon]="currentOptions?.downloadIcon" [bullets]="currentOptions?.previewBullets" (onClose)="onPreviewClose()" (onOpen)="onPreviewOpen()" (onActiveChange)="previewSelect($event)" [class.ngx-gallery-active]="previewEnabled"></ngx-gallery-preview>
    </div>
  `, providers: [NgxGalleryHelperService], styles: [":host{display:inline-block}:host>*{float:left}:host ::ng-deep *{box-sizing:border-box}:host ::ng-deep .ngx-gallery-icon{color:#fff;font-size:25px;position:absolute;z-index:2000;display:inline-block}:host ::ng-deep .ngx-gallery-icon .ngx-gallery-icon-content{display:block}:host ::ng-deep .ngx-gallery-clickable{cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper .ngx-gallery-icon{position:relative;margin-right:5px;margin-top:5px;font-size:20px;cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper{float:right}:host .ngx-gallery-layout{width:100%;height:100%;display:flex;flex-direction:column}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-image{order:2}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-thumbnails{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-image{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-thumbnails{order:2}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { options: [{
                type: Input
            }], images: [{
                type: Input
            }], imagesReady: [{
                type: Output
            }], change: [{
                type: Output
            }], previewOpen: [{
                type: Output
            }], previewClose: [{
                type: Output
            }], previewChange: [{
                type: Output
            }], preview: [{
                type: ViewChild,
                args: [NgxGalleryPreviewComponent]
            }], image: [{
                type: ViewChild,
                args: [NgxGalleryImageComponent]
            }], thubmnails: [{
                type: ViewChild,
                args: [NgxGalleryThumbnailsComponent]
            }], width: [{
                type: HostBinding,
                args: ['style.width']
            }], height: [{
                type: HostBinding,
                args: ['style.height']
            }], left: [{
                type: HostBinding,
                args: ['style.left']
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvamVjdHMvbmd4LWdhbGxlcnkvc3JjL2xpYi9uZ3gtZ2FsbGVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBa0MsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekosT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHMUQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDM0UsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDM0YsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDMUcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7Ozs7OztBQWdCOUQsTUFBTSxPQUFPLG1CQUFtQjtJQXFDOUIsWUFBb0IsU0FBcUI7UUFBckIsY0FBUyxHQUFULFNBQVMsQ0FBWTtRQWpDL0IsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBOEMsQ0FBQztRQUN4RSxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQThDLENBQUM7UUFVekYsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFFcEIsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFLVixl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QUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hHLENBQUM7OEdBblNVLG1CQUFtQjtrR0FBbkIsbUJBQW1CLDRZQUZuQixDQUFDLHVCQUF1QixDQUFDLG1FQStCekIsMEJBQTBCLHdFQUMxQix3QkFBd0IsNkVBQ3hCLDZCQUE2QixnREEzQzlCOzs7Ozs7OztHQVFUOzsyRkFJVSxtQkFBbUI7a0JBZC9CLFNBQVM7K0JBQ0UsYUFBYSxZQUNiOzs7Ozs7OztHQVFULGFBRVUsQ0FBQyx1QkFBdUIsQ0FBQztpR0FHM0IsT0FBTztzQkFBZixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFFSSxXQUFXO3NCQUFwQixNQUFNO2dCQUNHLE1BQU07c0JBQWYsTUFBTTtnQkFDRyxXQUFXO3NCQUFwQixNQUFNO2dCQUNHLFlBQVk7c0JBQXJCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFxQmdDLE9BQU87c0JBQTdDLFNBQVM7dUJBQUMsMEJBQTBCO2dCQUNBLEtBQUs7c0JBQXpDLFNBQVM7dUJBQUMsd0JBQXdCO2dCQUNPLFVBQVU7c0JBQW5ELFNBQVM7dUJBQUMsNkJBQTZCO2dCQUVaLEtBQUs7c0JBQWhDLFdBQVc7dUJBQUMsYUFBYTtnQkFDRyxNQUFNO3NCQUFsQyxXQUFXO3VCQUFDLGNBQWM7Z0JBQ0EsSUFBSTtzQkFBOUIsV0FBVzt1QkFBQyxZQUFZO2dCQTZDTSxRQUFRO3NCQUF0QyxZQUFZO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgRG9DaGVjaywgQWZ0ZXJWaWV3SW5pdCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIFZpZXdDaGlsZCwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlPcHRpb25zIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1vcHRpb25zJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUltYWdlU2l6ZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2Utc2l6ZS5tb2RlbCc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlJbWFnZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1vcmRlcmVkLWltYWdlLm1vZGVsJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LXByZXZpZXcvbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SW1hZ2VDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlL25neC1nYWxsZXJ5LWltYWdlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzL25neC1nYWxsZXJ5LXRodW1ibmFpbHMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUxheW91dCB9IGZyb20gJy4vbmd4LWdhbGxlcnktbGF5b3V0Lm1vZGVsJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnknLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktbGF5b3V0IHt7Y3VycmVudE9wdGlvbnM/LmxheW91dH19XCI+XHJcbiAgICAgIDxuZ3gtZ2FsbGVyeS1pbWFnZSAqbmdJZj1cImN1cnJlbnRPcHRpb25zPy5pbWFnZVwiIFtzdHlsZS5oZWlnaHRdPVwiZ2V0SW1hZ2VIZWlnaHQoKVwiIFtpbWFnZXNdPVwibWVkaXVtSW1hZ2VzXCIgW2NsaWNrYWJsZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1wiIFtzZWxlY3RlZEluZGV4XT1cInNlbGVjdGVkSW5kZXhcIiBbYXJyb3dzXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFycm93c1wiIFthcnJvd3NBdXRvSGlkZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBcnJvd3NBdXRvSGlkZVwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbc3dpcGVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlU3dpcGVcIiBbYW5pbWF0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFuaW1hdGlvblwiIFtzaXplXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZVNpemVcIiBbYXV0b1BsYXldPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXV0b1BsYXlcIiBbYXV0b1BsYXlJbnRlcnZhbF09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBdXRvUGxheUludGVydmFsXCIgW2F1dG9QbGF5UGF1c2VPbkhvdmVyXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUF1dG9QbGF5UGF1c2VPbkhvdmVyXCIgW2luZmluaXR5TW92ZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VJbmZpbml0eU1vdmVcIiAgW2xhenlMb2FkaW5nXT1cImN1cnJlbnRPcHRpb25zPy5sYXp5TG9hZGluZ1wiIFthY3Rpb25zXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFjdGlvbnNcIiBbZGVzY3JpcHRpb25zXT1cImRlc2NyaXB0aW9uc1wiIFtzaG93RGVzY3JpcHRpb25dPVwiY3VycmVudE9wdGlvbnM/LmltYWdlRGVzY3JpcHRpb25cIiBbYnVsbGV0c109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VCdWxsZXRzXCIgKG9uQ2xpY2spPVwib3BlblByZXZpZXcoJGV2ZW50KVwiIChvbkFjdGl2ZUNoYW5nZSk9XCJzZWxlY3RGcm9tSW1hZ2UoJGV2ZW50KVwiPjwvbmd4LWdhbGxlcnktaW1hZ2U+XHJcblxyXG4gICAgICA8bmd4LWdhbGxlcnktdGh1bWJuYWlscyAqbmdJZj1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzXCIgW3N0eWxlLm1hcmdpblRvcF09XCJnZXRUaHVtYm5haWxzTWFyZ2luVG9wKClcIiBbc3R5bGUubWFyZ2luQm90dG9tXT1cImdldFRodW1ibmFpbHNNYXJnaW5Cb3R0b20oKVwiIFtzdHlsZS5oZWlnaHRdPVwiZ2V0VGh1bWJuYWlsc0hlaWdodCgpXCIgW2ltYWdlc109XCJzbWFsbEltYWdlc1wiIFtsaW5rc109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc0FzTGlua3MgPyBsaW5rcyA6IFtdXCIgW2xhYmVsc109XCJsYWJlbHNcIiBbbGlua1RhcmdldF09XCJjdXJyZW50T3B0aW9ucz8ubGlua1RhcmdldFwiIFtzZWxlY3RlZEluZGV4XT1cInNlbGVjdGVkSW5kZXhcIiBbY29sdW1uc109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc0NvbHVtbnNcIiBbcm93c109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1Jvd3NcIiBbbWFyZ2luXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxNYXJnaW5cIiBbYXJyb3dzXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQXJyb3dzXCIgW2Fycm93c0F1dG9IaWRlXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQXJyb3dzQXV0b0hpZGVcIiBbYXJyb3dQcmV2SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd05leHRJY29uXCIgW2NsaWNrYWJsZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2UgfHwgY3VycmVudE9wdGlvbnM/LnByZXZpZXdcIiBbc3dpcGVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNTd2lwZVwiIFtzaXplXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxTaXplXCIgW21vdmVTaXplXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzTW92ZVNpemVcIiBbb3JkZXJdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNPcmRlclwiIFtyZW1haW5pbmdDb3VudF09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1JlbWFpbmluZ0NvdW50XCIgW2xhenlMb2FkaW5nXT1cImN1cnJlbnRPcHRpb25zPy5sYXp5TG9hZGluZ1wiIFthY3Rpb25zXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxBY3Rpb25zXCIgIChvbkFjdGl2ZUNoYW5nZSk9XCJzZWxlY3RGcm9tVGh1bWJuYWlscygkZXZlbnQpXCI+PC9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzPlxyXG5cclxuICAgICAgPG5neC1nYWxsZXJ5LXByZXZpZXcgW2ltYWdlc109XCJiaWdJbWFnZXNcIiBbZGVzY3JpcHRpb25zXT1cImRlc2NyaXB0aW9uc1wiIFtzaG93RGVzY3JpcHRpb25dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdEZXNjcmlwdGlvblwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbY2xvc2VJY29uXT1cImN1cnJlbnRPcHRpb25zPy5jbG9zZUljb25cIiBbZnVsbHNjcmVlbkljb25dPVwiY3VycmVudE9wdGlvbnM/LmZ1bGxzY3JlZW5JY29uXCIgW3NwaW5uZXJJY29uXT1cImN1cnJlbnRPcHRpb25zPy5zcGlubmVySWNvblwiIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBcnJvd3NBdXRvSGlkZVwiIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1N3aXBlXCIgW2Z1bGxzY3JlZW5dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdGdWxsc2NyZWVuXCIgW2ZvcmNlRnVsbHNjcmVlbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0ZvcmNlRnVsbHNjcmVlblwiIFtjbG9zZU9uQ2xpY2tdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdDbG9zZU9uQ2xpY2tcIiBbY2xvc2VPbkVzY109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Nsb3NlT25Fc2NcIiBba2V5Ym9hcmROYXZpZ2F0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3S2V5Ym9hcmROYXZpZ2F0aW9uXCIgW2FuaW1hdGlvbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0FuaW1hdGlvblwiIFthdXRvUGxheV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0F1dG9QbGF5XCIgW2F1dG9QbGF5SW50ZXJ2YWxdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBdXRvUGxheUludGVydmFsXCIgW2F1dG9QbGF5UGF1c2VPbkhvdmVyXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXV0b1BsYXlQYXVzZU9uSG92ZXJcIiBbaW5maW5pdHlNb3ZlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3SW5maW5pdHlNb3ZlXCIgW3pvb21dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tXCIgW3pvb21TdGVwXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Wm9vbVN0ZXBcIiBbem9vbU1heF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21NYXhcIiBbem9vbU1pbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21NaW5cIiBbem9vbUluSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uem9vbUluSWNvblwiIFt6b29tT3V0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uem9vbU91dEljb25cIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8uYWN0aW9uc1wiIFtyb3RhdGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdSb3RhdGVcIiBbcm90YXRlTGVmdEljb25dPVwiY3VycmVudE9wdGlvbnM/LnJvdGF0ZUxlZnRJY29uXCIgW3JvdGF0ZVJpZ2h0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8ucm90YXRlUmlnaHRJY29uXCIgW2Rvd25sb2FkXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3RG93bmxvYWRcIiBbZG93bmxvYWRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5kb3dubG9hZEljb25cIiBbYnVsbGV0c109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0J1bGxldHNcIiAob25DbG9zZSk9XCJvblByZXZpZXdDbG9zZSgpXCIgKG9uT3Blbik9XCJvblByZXZpZXdPcGVuKClcIiAob25BY3RpdmVDaGFuZ2UpPVwicHJldmlld1NlbGVjdCgkZXZlbnQpXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWFjdGl2ZV09XCJwcmV2aWV3RW5hYmxlZFwiPjwvbmd4LWdhbGxlcnktcHJldmlldz5cclxuICAgIDwvZGl2PlxyXG4gIGAsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LWdhbGxlcnkuY29tcG9uZW50LnNjc3MnXSxcclxuICBwcm92aWRlcnM6IFtOZ3hHYWxsZXJ5SGVscGVyU2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpIG9wdGlvbnM6IE5neEdhbGxlcnlPcHRpb25zW107XHJcbiAgQElucHV0KCkgaW1hZ2VzOiBOZ3hHYWxsZXJ5SW1hZ2VbXTtcclxuXHJcbiAgQE91dHB1dCgpIGltYWdlc1JlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgaW5kZXg6IG51bWJlcjsgaW1hZ2U6IE5neEdhbGxlcnlJbWFnZTsgfT4oKTtcclxuICBAT3V0cHV0KCkgcHJldmlld09wZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIHByZXZpZXdDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgcHJldmlld0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBpbmRleDogbnVtYmVyOyBpbWFnZTogTmd4R2FsbGVyeUltYWdlOyB9PigpO1xyXG5cclxuICBzbWFsbEltYWdlczogc3RyaW5nW10gfCBTYWZlUmVzb3VyY2VVcmxbXTtcclxuICBtZWRpdW1JbWFnZXM6IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2VbXTtcclxuICBiaWdJbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XHJcbiAgZGVzY3JpcHRpb25zOiBzdHJpbmdbXTtcclxuICBsaW5rczogc3RyaW5nW107XHJcbiAgbGFiZWxzOiBzdHJpbmdbXTtcclxuXHJcbiAgb2xkSW1hZ2VzOiBOZ3hHYWxsZXJ5SW1hZ2VbXTtcclxuICBvbGRJbWFnZXNMZW5ndGggPSAwO1xyXG5cclxuICBzZWxlY3RlZEluZGV4ID0gMDtcclxuICBwcmV2aWV3RW5hYmxlZDogYm9vbGVhbjtcclxuXHJcbiAgY3VycmVudE9wdGlvbnM6IE5neEdhbGxlcnlPcHRpb25zO1xyXG5cclxuICBwcml2YXRlIGJyZWFrcG9pbnQ6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICBwcml2YXRlIHByZXZCcmVha3BvaW50OiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgcHJpdmF0ZSBmdWxsV2lkdGhUaW1lb3V0OiBhbnk7XHJcblxyXG4gIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQpIHByZXZpZXc6IE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50O1xyXG4gIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50KSBpbWFnZTogTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50O1xyXG4gIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQpIHRodWJtbmFpbHM6IE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50O1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLndpZHRoJykgd2lkdGg6IHN0cmluZztcclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmhlaWdodCcpIGhlaWdodDogc3RyaW5nO1xyXG4gIEBIb3N0QmluZGluZygnc3R5bGUubGVmdCcpIGxlZnQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBteUVsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnMubWFwKChvcHQpID0+IG5ldyBOZ3hHYWxsZXJ5T3B0aW9ucyhvcHQpKTtcclxuICAgICAgdGhpcy5zb3J0T3B0aW9ucygpO1xyXG4gICAgICB0aGlzLnNldEJyZWFrcG9pbnQoKTtcclxuICAgICAgdGhpcy5zZXRPcHRpb25zKCk7XHJcbiAgICAgIHRoaXMuY2hlY2tGdWxsV2lkdGgoKTtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMpIHtcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4O1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmltYWdlcyAhPT0gdW5kZWZpbmVkICYmICh0aGlzLmltYWdlcy5sZW5ndGggIT09IHRoaXMub2xkSW1hZ2VzTGVuZ3RoKVxyXG4gICAgICAgICAgfHwgKHRoaXMuaW1hZ2VzICE9PSB0aGlzLm9sZEltYWdlcykpIHtcclxuICAgICAgICAgIHRoaXMub2xkSW1hZ2VzTGVuZ3RoID0gdGhpcy5pbWFnZXMubGVuZ3RoO1xyXG4gICAgICAgICAgdGhpcy5vbGRJbWFnZXMgPSB0aGlzLmltYWdlcztcclxuICAgICAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xyXG4gICAgICAgICAgdGhpcy5zZXRJbWFnZXMoKTtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5pbWFnZXMgJiYgdGhpcy5pbWFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5pbWFnZXNSZWFkeS5lbWl0KCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW1hZ2UpIHtcclxuICAgICAgICAgICAgICB0aGlzLmltYWdlLnJlc2V0KDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzQXV0b0hpZGUgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzXHJcbiAgICAgICAgICAgICAgJiYgdGhpcy5pbWFnZXMubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlQXJyb3dzID0gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5yZXNldFRodW1ibmFpbHMoKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJykgb25SZXNpemUoKSB7XHJcbiAgICAgIHRoaXMuc2V0QnJlYWtwb2ludCgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMucHJldkJyZWFrcG9pbnQgIT09IHRoaXMuYnJlYWtwb2ludCkge1xyXG4gICAgICAgICAgdGhpcy5zZXRPcHRpb25zKCk7XHJcbiAgICAgICAgICB0aGlzLnJlc2V0VGh1bWJuYWlscygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmZ1bGxXaWR0aCkge1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmZ1bGxXaWR0aFRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mdWxsV2lkdGhUaW1lb3V0KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB0aGlzLmZ1bGxXaWR0aFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XHJcbiAgICAgICAgICB9LCAyMDApO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRJbWFnZUhlaWdodCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzKSA/XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlUGVyY2VudCArICclJyA6ICcxMDAlJztcclxuICB9XHJcblxyXG4gIGdldFRodW1ibmFpbHNIZWlnaHQoKTogc3RyaW5nIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZSkge1xyXG4gICAgICAgICAgcmV0dXJuICdjYWxjKCcgKyB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNQZXJjZW50ICsgJyUgLSAnXHJcbiAgICAgICAgICArIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc01hcmdpbiArICdweCknO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuICcxMDAlJztcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0VGh1bWJuYWlsc01hcmdpblRvcCgpOiBzdHJpbmcge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmxheW91dCA9PT0gTmd4R2FsbGVyeUxheW91dC5UaHVtYm5haWxzQm90dG9tKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzTWFyZ2luICsgJ3B4JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAnMHB4JztcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0VGh1bWJuYWlsc01hcmdpbkJvdHRvbSgpOiBzdHJpbmcge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmxheW91dCA9PT0gTmd4R2FsbGVyeUxheW91dC5UaHVtYm5haWxzVG9wKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzTWFyZ2luICsgJ3B4JztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAnMHB4JztcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgb3BlblByZXZpZXcoaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3Q3VzdG9tKSB7XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLnByZXZpZXdDdXN0b20oaW5kZXgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wcmV2aWV3RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnByZXZpZXcub3BlbihpbmRleCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIG9uUHJldmlld09wZW4oKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucHJldmlld09wZW4uZW1pdCgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuaW1hZ2UgJiYgdGhpcy5pbWFnZS5hdXRvUGxheSkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZS5zdG9wQXV0b1BsYXkoKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgb25QcmV2aWV3Q2xvc2UoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucHJldmlld0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5wcmV2aWV3Q2xvc2UuZW1pdCgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuaW1hZ2UgJiYgdGhpcy5pbWFnZS5hdXRvUGxheSkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZS5zdGFydEF1dG9QbGF5KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHNlbGVjdEZyb21JbWFnZShpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0KGluZGV4KTtcclxuICB9XHJcblxyXG4gIHNlbGVjdEZyb21UaHVtYm5haWxzKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzICYmIHRoaXMuY3VycmVudE9wdGlvbnMucHJldmlld1xyXG4gICAgICAgICAgJiYgKCF0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlIHx8IHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1JlbWFpbmluZ0NvdW50KSkge1xyXG4gICAgICAgICAgdGhpcy5vcGVuUHJldmlldyh0aGlzLnNlbGVjdGVkSW5kZXgpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBzaG93KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xyXG4gIH1cclxuXHJcbiAgc2hvd05leHQoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaW1hZ2Uuc2hvd05leHQoKTtcclxuICB9XHJcblxyXG4gIHNob3dQcmV2KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmltYWdlLnNob3dQcmV2KCk7XHJcbiAgfVxyXG5cclxuICBjYW5TaG93TmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuY3VycmVudE9wdGlvbnMpIHtcclxuICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBjYW5TaG93UHJldigpOiBib29sZWFuIHtcclxuICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuY3VycmVudE9wdGlvbnMpIHtcclxuICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPiAwKSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgcHJldmlld1NlbGVjdChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMucHJldmlld0NoYW5nZS5lbWl0KHtpbmRleCwgaW1hZ2U6IHRoaXMuaW1hZ2VzW2luZGV4XX0pO1xyXG4gIH1cclxuXHJcbiAgbW92ZVRodW1ibmFpbHNSaWdodCgpIHtcclxuICAgICAgdGhpcy50aHVibW5haWxzLm1vdmVSaWdodCgpO1xyXG4gIH1cclxuXHJcbiAgbW92ZVRodW1ibmFpbHNMZWZ0KCkge1xyXG4gICAgICB0aGlzLnRodWJtbmFpbHMubW92ZUxlZnQoKTtcclxuICB9XHJcblxyXG4gIGNhbk1vdmVUaHVtYm5haWxzUmlnaHQoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRodWJtbmFpbHMuY2FuTW92ZVJpZ2h0KCk7XHJcbiAgfVxyXG5cclxuICBjYW5Nb3ZlVGh1bWJuYWlsc0xlZnQoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRodWJtbmFpbHMuY2FuTW92ZUxlZnQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVzZXRUaHVtYm5haWxzKCkge1xyXG4gICAgICBpZiAodGhpcy50aHVibW5haWxzKSB7XHJcbiAgICAgICAgICB0aGlzLnRodWJtbmFpbHMucmVzZXQoPG51bWJlcj50aGlzLmN1cnJlbnRPcHRpb25zLnN0YXJ0SW5kZXgpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlbGVjdChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IGluZGV4O1xyXG5cclxuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XHJcbiAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgIGltYWdlOiB0aGlzLmltYWdlc1tpbmRleF1cclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrRnVsbFdpZHRoKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmZ1bGxXaWR0aCkge1xyXG4gICAgICAgICAgdGhpcy53aWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggKyAncHgnO1xyXG4gICAgICAgICAgdGhpcy5sZWZ0ID0gKC0oZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtXHJcbiAgICAgICAgICAgICAgdGhpcy5teUVsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLmlubmVyV2lkdGgpIC8gMikgKyAncHgnO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEltYWdlcygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zbWFsbEltYWdlcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5zbWFsbCk7XHJcbiAgICAgIHRoaXMubWVkaXVtSW1hZ2VzID0gdGhpcy5pbWFnZXMubWFwKChpbWcsIGkpID0+IG5ldyBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlKHtcclxuICAgICAgICAgIHNyYzogaW1nLm1lZGl1bSxcclxuICAgICAgICAgIGluZGV4OiBpXHJcbiAgICAgIH0pKTtcclxuICAgICAgdGhpcy5iaWdJbWFnZXMgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcuYmlnKTtcclxuICAgICAgdGhpcy5kZXNjcmlwdGlvbnMgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcuZGVzY3JpcHRpb24pO1xyXG4gICAgICB0aGlzLmxpbmtzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLnVybCk7XHJcbiAgICAgIHRoaXMubGFiZWxzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLmxhYmVsKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0QnJlYWtwb2ludCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5wcmV2QnJlYWtwb2ludCA9IHRoaXMuYnJlYWtwb2ludDtcclxuICAgICAgbGV0IGJyZWFrcG9pbnRzO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBicmVha3BvaW50cyA9IHRoaXMub3B0aW9ucy5maWx0ZXIoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQgPj0gd2luZG93LmlubmVyV2lkdGgpXHJcbiAgICAgICAgICAgICAgLm1hcCgob3B0KSA9PiBvcHQuYnJlYWtwb2ludCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChicmVha3BvaW50cyAmJiBicmVha3BvaW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgIHRoaXMuYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzLnBvcCgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5icmVha3BvaW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNvcnRPcHRpb25zKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLm9wdGlvbnMgPSBbXHJcbiAgICAgICAgICAuLi50aGlzLm9wdGlvbnMuZmlsdGVyKChhKSA9PiBhLmJyZWFrcG9pbnQgPT09IHVuZGVmaW5lZCksXHJcbiAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcclxuICAgICAgICAgICAgICAuZmlsdGVyKChhKSA9PiBhLmJyZWFrcG9pbnQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYi5icmVha3BvaW50IC0gYS5icmVha3BvaW50KVxyXG4gICAgICBdO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRPcHRpb25zKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gbmV3IE5neEdhbGxlcnlPcHRpb25zKHt9KTtcclxuXHJcbiAgICAgIHRoaXMub3B0aW9uc1xyXG4gICAgICAgICAgLmZpbHRlcigob3B0KSA9PiBvcHQuYnJlYWtwb2ludCA9PT0gdW5kZWZpbmVkIHx8IG9wdC5icmVha3BvaW50ID49IHRoaXMuYnJlYWtwb2ludClcclxuICAgICAgICAgIC5tYXAoKG9wdCkgPT4gdGhpcy5jb21iaW5lT3B0aW9ucyh0aGlzLmN1cnJlbnRPcHRpb25zLCBvcHQpKTtcclxuXHJcbiAgICAgIHRoaXMud2lkdGggPSA8c3RyaW5nPnRoaXMuY3VycmVudE9wdGlvbnMud2lkdGg7XHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gPHN0cmluZz50aGlzLmN1cnJlbnRPcHRpb25zLmhlaWdodDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29tYmluZU9wdGlvbnMoZmlyc3Q6IE5neEdhbGxlcnlPcHRpb25zLCBzZWNvbmQ6IE5neEdhbGxlcnlPcHRpb25zKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzKHNlY29uZCkubWFwKCh2YWwpID0+IGZpcnN0W3ZhbF0gPSBzZWNvbmRbdmFsXSAhPT0gdW5kZWZpbmVkID8gc2Vjb25kW3ZhbF0gOiBmaXJzdFt2YWxdKTtcclxuICB9XHJcbn1cclxuIl19