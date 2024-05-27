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
    myElement;
    options;
    images;
    imagesReady = new EventEmitter();
    change = new EventEmitter();
    previewOpen = new EventEmitter();
    previewClose = new EventEmitter();
    previewChange = new EventEmitter();
    smallImages;
    mediumImages;
    bigImages;
    descriptions;
    links;
    labels;
    oldImages;
    oldImagesLength = 0;
    selectedIndex = 0;
    previewEnabled;
    currentOptions;
    breakpoint = undefined;
    prevBreakpoint = undefined;
    fullWidthTimeout;
    preview;
    image;
    thubmnails;
    width;
    height;
    left;
    constructor(myElement) {
        this.myElement = myElement;
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.10", ngImport: i0, type: NgxGalleryComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.10", type: NgxGalleryComponent, selector: "ngx-gallery", inputs: { options: "options", images: "images" }, outputs: { imagesReady: "imagesReady", change: "change", previewOpen: "previewOpen", previewClose: "previewClose", previewChange: "previewChange" }, host: { listeners: { "window:resize": "onResize()" }, properties: { "style.width": "this.width", "style.height": "this.height", "style.left": "this.left" } }, providers: [NgxGalleryHelperService], viewQueries: [{ propertyName: "preview", first: true, predicate: NgxGalleryPreviewComponent, descendants: true }, { propertyName: "image", first: true, predicate: NgxGalleryImageComponent, descendants: true }, { propertyName: "thubmnails", first: true, predicate: NgxGalleryThumbnailsComponent, descendants: true }], ngImport: i0, template: `
    <div class="ngx-gallery-layout {{currentOptions?.layout}}">
      <ngx-gallery-image *ngIf="currentOptions?.image" 
    [style.height]="getImageHeight()" [images]="mediumImages" 
    [clickable]="currentOptions?.preview" [selectedIndex]="selectedIndex"
    [arrows]="currentOptions?.imageArrows" [arrowsAutoHide]="currentOptions?.imageArrowsAutoHide" 
    [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" 
    [swipe]="currentOptions?.imageSwipe" [animation]="currentOptions?.imageAnimation" [size]="currentOptions?.imageSize" 
    [autoPlay]="currentOptions?.imageAutoPlay" [autoPlayInterval]="currentOptions?.imageAutoPlayInterval" 
    [autoPlayPauseOnHover]="currentOptions?.imageAutoPlayPauseOnHover" [infinityMove]="currentOptions?.imageInfinityMove" 
    [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.imageActions" [descriptions]="descriptions" 
    [showDescription]="currentOptions?.imageDescription" [bullets]="currentOptions?.imageBullets" 
    (onClick)="openPreview($event)" (onActiveChange)="selectFromImage($event)"></ngx-gallery-image>

      <ngx-gallery-thumbnails *ngIf="currentOptions?.thumbnails" [style.marginTop]="getThumbnailsMarginTop()" [style.marginBottom]="getThumbnailsMarginBottom()" [style.height]="getThumbnailsHeight()" [images]="smallImages" [links]="currentOptions?.thumbnailsAsLinks ? links : []" [labels]="labels" [linkTarget]="currentOptions?.linkTarget" [selectedIndex]="selectedIndex" [columns]="currentOptions?.thumbnailsColumns" [rows]="currentOptions?.thumbnailsRows" [margin]="currentOptions?.thumbnailMargin" [arrows]="currentOptions?.thumbnailsArrows" [arrowsAutoHide]="currentOptions?.thumbnailsArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [clickable]="currentOptions?.image || currentOptions?.preview" [swipe]="currentOptions?.thumbnailsSwipe" [size]="currentOptions?.thumbnailSize" [moveSize]="currentOptions?.thumbnailsMoveSize" [order]="currentOptions?.thumbnailsOrder" [remainingCount]="currentOptions?.thumbnailsRemainingCount" [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.thumbnailActions"  (onActiveChange)="selectFromThumbnails($event)"></ngx-gallery-thumbnails>

      <ngx-gallery-preview [images]="bigImages" [descriptions]="descriptions" [showDescription]="currentOptions?.previewDescription" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [closeIcon]="currentOptions?.closeIcon" [fullscreenIcon]="currentOptions?.fullscreenIcon" [spinnerIcon]="currentOptions?.spinnerIcon" [arrows]="currentOptions?.previewArrows" [arrowsAutoHide]="currentOptions?.previewArrowsAutoHide" [swipe]="currentOptions?.previewSwipe" [fullscreen]="currentOptions?.previewFullscreen" [forceFullscreen]="currentOptions?.previewForceFullscreen" [closeOnClick]="currentOptions?.previewCloseOnClick" [closeOnEsc]="currentOptions?.previewCloseOnEsc" [keyboardNavigation]="currentOptions?.previewKeyboardNavigation" [animation]="currentOptions?.previewAnimation" [autoPlay]="currentOptions?.previewAutoPlay" [autoPlayInterval]="currentOptions?.previewAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.previewAutoPlayPauseOnHover" [infinityMove]="currentOptions?.previewInfinityMove" [zoom]="currentOptions?.previewZoom" [zoomStep]="currentOptions?.previewZoomStep" [zoomMax]="currentOptions?.previewZoomMax" [zoomMin]="currentOptions?.previewZoomMin" [zoomInIcon]="currentOptions?.zoomInIcon" [zoomOutIcon]="currentOptions?.zoomOutIcon" [actions]="currentOptions?.actions" [rotate]="currentOptions?.previewRotate" [rotateLeftIcon]="currentOptions?.rotateLeftIcon" [rotateRightIcon]="currentOptions?.rotateRightIcon" [download]="currentOptions?.previewDownload" [downloadIcon]="currentOptions?.downloadIcon" [bullets]="currentOptions?.previewBullets" (onClose)="onPreviewClose()" (onOpen)="onPreviewOpen()" (onActiveChange)="previewSelect($event)" [class.ngx-gallery-active]="previewEnabled"></ngx-gallery-preview>
    </div>
  `, isInline: true, styles: [":host{display:inline-block}:host>*{float:left}:host ::ng-deep *{box-sizing:border-box}:host ::ng-deep .ngx-gallery-icon{color:#fff;font-size:25px;position:absolute;z-index:2000;display:inline-block}:host ::ng-deep .ngx-gallery-icon .ngx-gallery-icon-content{display:block}:host ::ng-deep .ngx-gallery-clickable{cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper .ngx-gallery-icon{position:relative;margin-right:5px;margin-top:5px;font-size:20px;cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper{float:right}:host .ngx-gallery-layout{width:100%;height:100%;display:flex;flex-direction:column}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-image{order:2}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-thumbnails{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-image{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-thumbnails{order:2}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NgxGalleryPreviewComponent, selector: "ngx-gallery-preview", inputs: ["images", "descriptions", "showDescription", "arrows", "arrowsAutoHide", "swipe", "fullscreen", "forceFullscreen", "closeOnClick", "closeOnEsc", "keyboardNavigation", "arrowPrevIcon", "arrowNextIcon", "closeIcon", "fullscreenIcon", "spinnerIcon", "autoPlay", "autoPlayInterval", "autoPlayPauseOnHover", "infinityMove", "zoom", "zoomStep", "zoomMax", "zoomMin", "zoomInIcon", "zoomOutIcon", "animation", "actions", "rotate", "rotateLeftIcon", "rotateRightIcon", "download", "downloadIcon", "bullets"], outputs: ["onOpen", "onClose", "onActiveChange"] }, { kind: "component", type: i3.NgxGalleryImageComponent, selector: "ngx-gallery-image", inputs: ["images", "clickable", "selectedIndex", "arrows", "arrowsAutoHide", "swipe", "animation", "size", "arrowPrevIcon", "arrowNextIcon", "autoPlay", "autoPlayInterval", "autoPlayPauseOnHover", "infinityMove", "lazyLoading", "actions", "descriptions", "showDescription", "bullets"], outputs: ["onClick", "onActiveChange"] }, { kind: "component", type: i4.NgxGalleryThumbnailsComponent, selector: "ngx-gallery-thumbnails", inputs: ["images", "links", "labels", "linkTarget", "columns", "rows", "arrows", "arrowsAutoHide", "margin", "selectedIndex", "clickable", "swipe", "size", "arrowPrevIcon", "arrowNextIcon", "moveSize", "order", "remainingCount", "lazyLoading", "actions"], outputs: ["onActiveChange"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.10", ngImport: i0, type: NgxGalleryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery', template: `
    <div class="ngx-gallery-layout {{currentOptions?.layout}}">
      <ngx-gallery-image *ngIf="currentOptions?.image" 
    [style.height]="getImageHeight()" [images]="mediumImages" 
    [clickable]="currentOptions?.preview" [selectedIndex]="selectedIndex"
    [arrows]="currentOptions?.imageArrows" [arrowsAutoHide]="currentOptions?.imageArrowsAutoHide" 
    [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" 
    [swipe]="currentOptions?.imageSwipe" [animation]="currentOptions?.imageAnimation" [size]="currentOptions?.imageSize" 
    [autoPlay]="currentOptions?.imageAutoPlay" [autoPlayInterval]="currentOptions?.imageAutoPlayInterval" 
    [autoPlayPauseOnHover]="currentOptions?.imageAutoPlayPauseOnHover" [infinityMove]="currentOptions?.imageInfinityMove" 
    [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.imageActions" [descriptions]="descriptions" 
    [showDescription]="currentOptions?.imageDescription" [bullets]="currentOptions?.imageBullets" 
    (onClick)="openPreview($event)" (onActiveChange)="selectFromImage($event)"></ngx-gallery-image>

      <ngx-gallery-thumbnails *ngIf="currentOptions?.thumbnails" [style.marginTop]="getThumbnailsMarginTop()" [style.marginBottom]="getThumbnailsMarginBottom()" [style.height]="getThumbnailsHeight()" [images]="smallImages" [links]="currentOptions?.thumbnailsAsLinks ? links : []" [labels]="labels" [linkTarget]="currentOptions?.linkTarget" [selectedIndex]="selectedIndex" [columns]="currentOptions?.thumbnailsColumns" [rows]="currentOptions?.thumbnailsRows" [margin]="currentOptions?.thumbnailMargin" [arrows]="currentOptions?.thumbnailsArrows" [arrowsAutoHide]="currentOptions?.thumbnailsArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [clickable]="currentOptions?.image || currentOptions?.preview" [swipe]="currentOptions?.thumbnailsSwipe" [size]="currentOptions?.thumbnailSize" [moveSize]="currentOptions?.thumbnailsMoveSize" [order]="currentOptions?.thumbnailsOrder" [remainingCount]="currentOptions?.thumbnailsRemainingCount" [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.thumbnailActions"  (onActiveChange)="selectFromThumbnails($event)"></ngx-gallery-thumbnails>

      <ngx-gallery-preview [images]="bigImages" [descriptions]="descriptions" [showDescription]="currentOptions?.previewDescription" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [closeIcon]="currentOptions?.closeIcon" [fullscreenIcon]="currentOptions?.fullscreenIcon" [spinnerIcon]="currentOptions?.spinnerIcon" [arrows]="currentOptions?.previewArrows" [arrowsAutoHide]="currentOptions?.previewArrowsAutoHide" [swipe]="currentOptions?.previewSwipe" [fullscreen]="currentOptions?.previewFullscreen" [forceFullscreen]="currentOptions?.previewForceFullscreen" [closeOnClick]="currentOptions?.previewCloseOnClick" [closeOnEsc]="currentOptions?.previewCloseOnEsc" [keyboardNavigation]="currentOptions?.previewKeyboardNavigation" [animation]="currentOptions?.previewAnimation" [autoPlay]="currentOptions?.previewAutoPlay" [autoPlayInterval]="currentOptions?.previewAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.previewAutoPlayPauseOnHover" [infinityMove]="currentOptions?.previewInfinityMove" [zoom]="currentOptions?.previewZoom" [zoomStep]="currentOptions?.previewZoomStep" [zoomMax]="currentOptions?.previewZoomMax" [zoomMin]="currentOptions?.previewZoomMin" [zoomInIcon]="currentOptions?.zoomInIcon" [zoomOutIcon]="currentOptions?.zoomOutIcon" [actions]="currentOptions?.actions" [rotate]="currentOptions?.previewRotate" [rotateLeftIcon]="currentOptions?.rotateLeftIcon" [rotateRightIcon]="currentOptions?.rotateRightIcon" [download]="currentOptions?.previewDownload" [downloadIcon]="currentOptions?.downloadIcon" [bullets]="currentOptions?.previewBullets" (onClose)="onPreviewClose()" (onOpen)="onPreviewOpen()" (onActiveChange)="previewSelect($event)" [class.ngx-gallery-active]="previewEnabled"></ngx-gallery-preview>
    </div>
  `, providers: [NgxGalleryHelperService], styles: [":host{display:inline-block}:host>*{float:left}:host ::ng-deep *{box-sizing:border-box}:host ::ng-deep .ngx-gallery-icon{color:#fff;font-size:25px;position:absolute;z-index:2000;display:inline-block}:host ::ng-deep .ngx-gallery-icon .ngx-gallery-icon-content{display:block}:host ::ng-deep .ngx-gallery-clickable{cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper .ngx-gallery-icon{position:relative;margin-right:5px;margin-top:5px;font-size:20px;cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper{float:right}:host .ngx-gallery-layout{width:100%;height:100%;display:flex;flex-direction:column}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-image{order:2}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-thumbnails{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-image{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-thumbnails{order:2}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { options: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvamVjdHMvb25sdXllbi1nYWxsZXJ5L3NyYy9saWIvbmd4LWdhbGxlcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWtDLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpKLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzNGLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBQzFHLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDOzs7Ozs7QUEwQjlELE1BQU0sT0FBTyxtQkFBbUI7SUFxQ1I7SUFwQ1gsT0FBTyxDQUFzQjtJQUM3QixNQUFNLENBQW9CO0lBRXpCLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQ2pDLE1BQU0sR0FBRyxJQUFJLFlBQVksRUFBOEMsQ0FBQztJQUN4RSxXQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUNqQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUNsQyxhQUFhLEdBQUcsSUFBSSxZQUFZLEVBQThDLENBQUM7SUFFekYsV0FBVyxDQUErQjtJQUMxQyxZQUFZLENBQTJCO0lBQ3ZDLFNBQVMsQ0FBK0I7SUFDeEMsWUFBWSxDQUFX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LGFBRVksQ0FBQyx1QkFBdUIsQ0FBQzsrRUFHM0IsT0FBTztzQkFBZixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFFSSxXQUFXO3NCQUFwQixNQUFNO2dCQUNHLE1BQU07c0JBQWYsTUFBTTtnQkFDRyxXQUFXO3NCQUFwQixNQUFNO2dCQUNHLFlBQVk7c0JBQXJCLE1BQU07Z0JBQ0csYUFBYTtzQkFBdEIsTUFBTTtnQkFxQmdDLE9BQU87c0JBQTdDLFNBQVM7dUJBQUMsMEJBQTBCO2dCQUNBLEtBQUs7c0JBQXpDLFNBQVM7dUJBQUMsd0JBQXdCO2dCQUNPLFVBQVU7c0JBQW5ELFNBQVM7dUJBQUMsNkJBQTZCO2dCQUVaLEtBQUs7c0JBQWhDLFdBQVc7dUJBQUMsYUFBYTtnQkFDRyxNQUFNO3NCQUFsQyxXQUFXO3VCQUFDLGNBQWM7Z0JBQ0EsSUFBSTtzQkFBOUIsV0FBVzt1QkFBQyxZQUFZO2dCQTZDTSxRQUFRO3NCQUF0QyxZQUFZO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgRG9DaGVjaywgQWZ0ZXJWaWV3SW5pdCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIFZpZXdDaGlsZCwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlPcHRpb25zIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1vcHRpb25zJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUltYWdlIH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1pbWFnZS5tb2RlbCc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LW9yZGVyZWQtaW1hZ2UubW9kZWwnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5UHJldmlld0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktcHJldmlldy9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktaW1hZ2Uvbmd4LWdhbGxlcnktaW1hZ2UuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQgfSBmcm9tICcuL25neC1nYWxsZXJ5LXRodW1ibmFpbHMvbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5TGF5b3V0IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1sYXlvdXQubW9kZWwnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5JyxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktbGF5b3V0IHt7Y3VycmVudE9wdGlvbnM/LmxheW91dH19XCI+XHJcbiAgICAgIDxuZ3gtZ2FsbGVyeS1pbWFnZSAqbmdJZj1cImN1cnJlbnRPcHRpb25zPy5pbWFnZVwiIFxyXG4gICAgW3N0eWxlLmhlaWdodF09XCJnZXRJbWFnZUhlaWdodCgpXCIgW2ltYWdlc109XCJtZWRpdW1JbWFnZXNcIiBcclxuICAgIFtjbGlja2FibGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdcIiBbc2VsZWN0ZWRJbmRleF09XCJzZWxlY3RlZEluZGV4XCJcclxuICAgIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXJyb3dzXCIgW2Fycm93c0F1dG9IaWRlXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFycm93c0F1dG9IaWRlXCIgXHJcbiAgICBbYXJyb3dQcmV2SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd05leHRJY29uXCIgXHJcbiAgICBbc3dpcGVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlU3dpcGVcIiBbYW5pbWF0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUFuaW1hdGlvblwiIFtzaXplXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZVNpemVcIiBcclxuICAgIFthdXRvUGxheV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBdXRvUGxheVwiIFthdXRvUGxheUludGVydmFsXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUF1dG9QbGF5SW50ZXJ2YWxcIiBcclxuICAgIFthdXRvUGxheVBhdXNlT25Ib3Zlcl09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBdXRvUGxheVBhdXNlT25Ib3ZlclwiIFtpbmZpbml0eU1vdmVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlSW5maW5pdHlNb3ZlXCIgXHJcbiAgICBbbGF6eUxvYWRpbmddPVwiY3VycmVudE9wdGlvbnM/LmxhenlMb2FkaW5nXCIgW2FjdGlvbnNdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQWN0aW9uc1wiIFtkZXNjcmlwdGlvbnNdPVwiZGVzY3JpcHRpb25zXCIgXHJcbiAgICBbc2hvd0Rlc2NyaXB0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZURlc2NyaXB0aW9uXCIgW2J1bGxldHNdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQnVsbGV0c1wiIFxyXG4gICAgKG9uQ2xpY2spPVwib3BlblByZXZpZXcoJGV2ZW50KVwiIChvbkFjdGl2ZUNoYW5nZSk9XCJzZWxlY3RGcm9tSW1hZ2UoJGV2ZW50KVwiPjwvbmd4LWdhbGxlcnktaW1hZ2U+XHJcblxyXG4gICAgICA8bmd4LWdhbGxlcnktdGh1bWJuYWlscyAqbmdJZj1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzXCIgW3N0eWxlLm1hcmdpblRvcF09XCJnZXRUaHVtYm5haWxzTWFyZ2luVG9wKClcIiBbc3R5bGUubWFyZ2luQm90dG9tXT1cImdldFRodW1ibmFpbHNNYXJnaW5Cb3R0b20oKVwiIFtzdHlsZS5oZWlnaHRdPVwiZ2V0VGh1bWJuYWlsc0hlaWdodCgpXCIgW2ltYWdlc109XCJzbWFsbEltYWdlc1wiIFtsaW5rc109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc0FzTGlua3MgPyBsaW5rcyA6IFtdXCIgW2xhYmVsc109XCJsYWJlbHNcIiBbbGlua1RhcmdldF09XCJjdXJyZW50T3B0aW9ucz8ubGlua1RhcmdldFwiIFtzZWxlY3RlZEluZGV4XT1cInNlbGVjdGVkSW5kZXhcIiBbY29sdW1uc109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc0NvbHVtbnNcIiBbcm93c109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1Jvd3NcIiBbbWFyZ2luXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxNYXJnaW5cIiBbYXJyb3dzXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQXJyb3dzXCIgW2Fycm93c0F1dG9IaWRlXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQXJyb3dzQXV0b0hpZGVcIiBbYXJyb3dQcmV2SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd05leHRJY29uXCIgW2NsaWNrYWJsZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2UgfHwgY3VycmVudE9wdGlvbnM/LnByZXZpZXdcIiBbc3dpcGVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNTd2lwZVwiIFtzaXplXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxTaXplXCIgW21vdmVTaXplXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzTW92ZVNpemVcIiBbb3JkZXJdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNPcmRlclwiIFtyZW1haW5pbmdDb3VudF09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1JlbWFpbmluZ0NvdW50XCIgW2xhenlMb2FkaW5nXT1cImN1cnJlbnRPcHRpb25zPy5sYXp5TG9hZGluZ1wiIFthY3Rpb25zXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxBY3Rpb25zXCIgIChvbkFjdGl2ZUNoYW5nZSk9XCJzZWxlY3RGcm9tVGh1bWJuYWlscygkZXZlbnQpXCI+PC9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzPlxyXG5cclxuICAgICAgPG5neC1nYWxsZXJ5LXByZXZpZXcgW2ltYWdlc109XCJiaWdJbWFnZXNcIiBbZGVzY3JpcHRpb25zXT1cImRlc2NyaXB0aW9uc1wiIFtzaG93RGVzY3JpcHRpb25dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdEZXNjcmlwdGlvblwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbY2xvc2VJY29uXT1cImN1cnJlbnRPcHRpb25zPy5jbG9zZUljb25cIiBbZnVsbHNjcmVlbkljb25dPVwiY3VycmVudE9wdGlvbnM/LmZ1bGxzY3JlZW5JY29uXCIgW3NwaW5uZXJJY29uXT1cImN1cnJlbnRPcHRpb25zPy5zcGlubmVySWNvblwiIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBcnJvd3NBdXRvSGlkZVwiIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1N3aXBlXCIgW2Z1bGxzY3JlZW5dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdGdWxsc2NyZWVuXCIgW2ZvcmNlRnVsbHNjcmVlbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0ZvcmNlRnVsbHNjcmVlblwiIFtjbG9zZU9uQ2xpY2tdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdDbG9zZU9uQ2xpY2tcIiBbY2xvc2VPbkVzY109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Nsb3NlT25Fc2NcIiBba2V5Ym9hcmROYXZpZ2F0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3S2V5Ym9hcmROYXZpZ2F0aW9uXCIgW2FuaW1hdGlvbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0FuaW1hdGlvblwiIFthdXRvUGxheV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0F1dG9QbGF5XCIgW2F1dG9QbGF5SW50ZXJ2YWxdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBdXRvUGxheUludGVydmFsXCIgW2F1dG9QbGF5UGF1c2VPbkhvdmVyXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXV0b1BsYXlQYXVzZU9uSG92ZXJcIiBbaW5maW5pdHlNb3ZlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3SW5maW5pdHlNb3ZlXCIgW3pvb21dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tXCIgW3pvb21TdGVwXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Wm9vbVN0ZXBcIiBbem9vbU1heF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21NYXhcIiBbem9vbU1pbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21NaW5cIiBbem9vbUluSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uem9vbUluSWNvblwiIFt6b29tT3V0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uem9vbU91dEljb25cIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8uYWN0aW9uc1wiIFtyb3RhdGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdSb3RhdGVcIiBbcm90YXRlTGVmdEljb25dPVwiY3VycmVudE9wdGlvbnM/LnJvdGF0ZUxlZnRJY29uXCIgW3JvdGF0ZVJpZ2h0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8ucm90YXRlUmlnaHRJY29uXCIgW2Rvd25sb2FkXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3RG93bmxvYWRcIiBbZG93bmxvYWRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5kb3dubG9hZEljb25cIiBbYnVsbGV0c109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0J1bGxldHNcIiAob25DbG9zZSk9XCJvblByZXZpZXdDbG9zZSgpXCIgKG9uT3Blbik9XCJvblByZXZpZXdPcGVuKClcIiAob25BY3RpdmVDaGFuZ2UpPVwicHJldmlld1NlbGVjdCgkZXZlbnQpXCIgW2NsYXNzLm5neC1nYWxsZXJ5LWFjdGl2ZV09XCJwcmV2aWV3RW5hYmxlZFwiPjwvbmd4LWdhbGxlcnktcHJldmlldz5cclxuICAgIDwvZGl2PlxyXG4gIGAsXHJcbiAgICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS5jb21wb25lbnQuc2NzcyddLFxyXG4gICAgcHJvdmlkZXJzOiBbTmd4R2FsbGVyeUhlbHBlclNlcnZpY2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0IHtcclxuICAgIEBJbnB1dCgpIG9wdGlvbnM6IE5neEdhbGxlcnlPcHRpb25zW107XHJcbiAgICBASW5wdXQoKSBpbWFnZXM6IE5neEdhbGxlcnlJbWFnZVtdO1xyXG5cclxuICAgIEBPdXRwdXQoKSBpbWFnZXNSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSBjaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgaW5kZXg6IG51bWJlcjsgaW1hZ2U6IE5neEdhbGxlcnlJbWFnZTsgfT4oKTtcclxuICAgIEBPdXRwdXQoKSBwcmV2aWV3T3BlbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSBwcmV2aWV3Q2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICBAT3V0cHV0KCkgcHJldmlld0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBpbmRleDogbnVtYmVyOyBpbWFnZTogTmd4R2FsbGVyeUltYWdlOyB9PigpO1xyXG5cclxuICAgIHNtYWxsSW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xyXG4gICAgbWVkaXVtSW1hZ2VzOiBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlW107XHJcbiAgICBiaWdJbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XHJcbiAgICBkZXNjcmlwdGlvbnM6IHN0cmluZ1tdO1xyXG4gICAgbGlua3M6IHN0cmluZ1tdO1xyXG4gICAgbGFiZWxzOiBzdHJpbmdbXTtcclxuXHJcbiAgICBvbGRJbWFnZXM6IE5neEdhbGxlcnlJbWFnZVtdO1xyXG4gICAgb2xkSW1hZ2VzTGVuZ3RoID0gMDtcclxuXHJcbiAgICBzZWxlY3RlZEluZGV4ID0gMDtcclxuICAgIHByZXZpZXdFbmFibGVkOiBib29sZWFuO1xyXG5cclxuICAgIGN1cnJlbnRPcHRpb25zOiBOZ3hHYWxsZXJ5T3B0aW9ucztcclxuXHJcbiAgICBwcml2YXRlIGJyZWFrcG9pbnQ6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIHByaXZhdGUgcHJldkJyZWFrcG9pbnQ6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuICAgIHByaXZhdGUgZnVsbFdpZHRoVGltZW91dDogYW55O1xyXG5cclxuICAgIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQpIHByZXZpZXc6IE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50O1xyXG4gICAgQFZpZXdDaGlsZChOZ3hHYWxsZXJ5SW1hZ2VDb21wb25lbnQpIGltYWdlOiBOZ3hHYWxsZXJ5SW1hZ2VDb21wb25lbnQ7XHJcbiAgICBAVmlld0NoaWxkKE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50KSB0aHVibW5haWxzOiBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudDtcclxuXHJcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLndpZHRoJykgd2lkdGg6IHN0cmluZztcclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JykgaGVpZ2h0OiBzdHJpbmc7XHJcbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmxlZnQnKSBsZWZ0OiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBteUVsZW1lbnQ6IEVsZW1lbnRSZWYpIHsgfVxyXG5cclxuICAgIG5nT25Jbml0KCkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMub3B0aW9ucy5tYXAoKG9wdCkgPT4gbmV3IE5neEdhbGxlcnlPcHRpb25zKG9wdCkpO1xyXG4gICAgICAgIHRoaXMuc29ydE9wdGlvbnMoKTtcclxuICAgICAgICB0aGlzLnNldEJyZWFrcG9pbnQoKTtcclxuICAgICAgICB0aGlzLnNldE9wdGlvbnMoKTtcclxuICAgICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gPG51bWJlcj50aGlzLmN1cnJlbnRPcHRpb25zLnN0YXJ0SW5kZXg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nRG9DaGVjaygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5pbWFnZXMgIT09IHVuZGVmaW5lZCAmJiAodGhpcy5pbWFnZXMubGVuZ3RoICE9PSB0aGlzLm9sZEltYWdlc0xlbmd0aClcclxuICAgICAgICAgICAgfHwgKHRoaXMuaW1hZ2VzICE9PSB0aGlzLm9sZEltYWdlcykpIHtcclxuICAgICAgICAgICAgdGhpcy5vbGRJbWFnZXNMZW5ndGggPSB0aGlzLmltYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMub2xkSW1hZ2VzID0gdGhpcy5pbWFnZXM7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEltYWdlcygpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWFnZXNSZWFkeS5lbWl0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlLnJlc2V0KDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc0F1dG9IaWRlICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1xyXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5pbWFnZXMubGVuZ3RoIDw9IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlscyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUFycm93cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VGh1bWJuYWlscygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Z1bGxXaWR0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKSBvblJlc2l6ZSgpIHtcclxuICAgICAgICB0aGlzLnNldEJyZWFrcG9pbnQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJldkJyZWFrcG9pbnQgIT09IHRoaXMuYnJlYWtwb2ludCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbnMoKTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldFRodW1ibmFpbHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMuZnVsbFdpZHRoKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5mdWxsV2lkdGhUaW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mdWxsV2lkdGhUaW1lb3V0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5mdWxsV2lkdGhUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XHJcbiAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEltYWdlSGVpZ2h0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlscykgP1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlUGVyY2VudCArICclJyA6ICcxMDAlJztcclxuICAgIH1cclxuXHJcbiAgICBnZXRUaHVtYm5haWxzSGVpZ2h0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ2NhbGMoJyArIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1BlcmNlbnQgKyAnJSAtICdcclxuICAgICAgICAgICAgICAgICsgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzTWFyZ2luICsgJ3B4KSc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICcxMDAlJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGh1bWJuYWlsc01hcmdpblRvcCgpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMubGF5b3V0ID09PSBOZ3hHYWxsZXJ5TGF5b3V0LlRodW1ibmFpbHNCb3R0b20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc01hcmdpbiArICdweCc7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICcwcHgnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRUaHVtYm5haWxzTWFyZ2luQm90dG9tKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5sYXlvdXQgPT09IE5neEdhbGxlcnlMYXlvdXQuVGh1bWJuYWlsc1RvcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzTWFyZ2luICsgJ3B4JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJzBweCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9wZW5QcmV2aWV3KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3Q3VzdG9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMucHJldmlld0N1c3RvbShpbmRleCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlldy5vcGVuKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QcmV2aWV3T3BlbigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnByZXZpZXdPcGVuLmVtaXQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2UgJiYgdGhpcy5pbWFnZS5hdXRvUGxheSkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlLnN0b3BBdXRvUGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblByZXZpZXdDbG9zZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnByZXZpZXdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3Q2xvc2UuZW1pdCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbWFnZSAmJiB0aGlzLmltYWdlLmF1dG9QbGF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc3RhcnRBdXRvUGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGcm9tSW1hZ2UoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0KGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGcm9tVGh1bWJuYWlscyhpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3XHJcbiAgICAgICAgICAgICYmICghdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZSB8fCB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNSZW1haW5pbmdDb3VudCkpIHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuUHJldmlldyh0aGlzLnNlbGVjdGVkSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNlbGVjdChpbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd05leHQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5zaG93TmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dQcmV2KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaW1hZ2Uuc2hvd1ByZXYoKTtcclxuICAgIH1cclxuXHJcbiAgICBjYW5TaG93TmV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5pbWFnZXMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2VJbmZpbml0eU1vdmUgfHwgdGhpcy5zZWxlY3RlZEluZGV4IDwgdGhpcy5pbWFnZXMubGVuZ3RoIC0gMSlcclxuICAgICAgICAgICAgICAgID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2FuU2hvd1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuY3VycmVudE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlSW5maW5pdHlNb3ZlIHx8IHRoaXMuc2VsZWN0ZWRJbmRleCA+IDApID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJldmlld1NlbGVjdChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3Q2hhbmdlLmVtaXQoeyBpbmRleCwgaW1hZ2U6IHRoaXMuaW1hZ2VzW2luZGV4XSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlVGh1bWJuYWlsc1JpZ2h0KCkge1xyXG4gICAgICAgIHRoaXMudGh1Ym1uYWlscy5tb3ZlUmlnaHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlVGh1bWJuYWlsc0xlZnQoKSB7XHJcbiAgICAgICAgdGhpcy50aHVibW5haWxzLm1vdmVMZWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FuTW92ZVRodW1ibmFpbHNSaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50aHVibW5haWxzLmNhbk1vdmVSaWdodCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbk1vdmVUaHVtYm5haWxzTGVmdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50aHVibW5haWxzLmNhbk1vdmVMZWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNldFRodW1ibmFpbHMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudGh1Ym1uYWlscykge1xyXG4gICAgICAgICAgICB0aGlzLnRodWJtbmFpbHMucmVzZXQoPG51bWJlcj50aGlzLmN1cnJlbnRPcHRpb25zLnN0YXJ0SW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNlbGVjdChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhbmdlLmVtaXQoe1xyXG4gICAgICAgICAgICBpbmRleCxcclxuICAgICAgICAgICAgaW1hZ2U6IHRoaXMuaW1hZ2VzW2luZGV4XVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tGdWxsV2lkdGgoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5mdWxsV2lkdGgpIHtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggKyAncHgnO1xyXG4gICAgICAgICAgICB0aGlzLmxlZnQgPSAoLShkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC1cclxuICAgICAgICAgICAgICAgIHRoaXMubXlFbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5pbm5lcldpZHRoKSAvIDIpICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRJbWFnZXMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zbWFsbEltYWdlcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5zbWFsbCk7XHJcbiAgICAgICAgdGhpcy5tZWRpdW1JbWFnZXMgPSB0aGlzLmltYWdlcy5tYXAoKGltZywgaSkgPT4gbmV3IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2Uoe1xyXG4gICAgICAgICAgICBzcmM6IGltZy5tZWRpdW0sXHJcbiAgICAgICAgICAgIGluZGV4OiBpXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuYmlnSW1hZ2VzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLmJpZyk7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbnMgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgIHRoaXMubGlua3MgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcudXJsKTtcclxuICAgICAgICB0aGlzLmxhYmVscyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5sYWJlbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRCcmVha3BvaW50KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucHJldkJyZWFrcG9pbnQgPSB0aGlzLmJyZWFrcG9pbnQ7XHJcbiAgICAgICAgbGV0IGJyZWFrcG9pbnRzO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludHMgPSB0aGlzLm9wdGlvbnMuZmlsdGVyKChvcHQpID0+IG9wdC5icmVha3BvaW50ID49IHdpbmRvdy5pbm5lcldpZHRoKVxyXG4gICAgICAgICAgICAgICAgLm1hcCgob3B0KSA9PiBvcHQuYnJlYWtwb2ludCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYnJlYWtwb2ludHMgJiYgYnJlYWtwb2ludHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzLnBvcCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnJlYWtwb2ludCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzb3J0T3B0aW9ucygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBbXHJcbiAgICAgICAgICAgIC4uLnRoaXMub3B0aW9ucy5maWx0ZXIoKGEpID0+IGEuYnJlYWtwb2ludCA9PT0gdW5kZWZpbmVkKSxcclxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChhKSA9PiBhLmJyZWFrcG9pbnQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBiLmJyZWFrcG9pbnQgLSBhLmJyZWFrcG9pbnQpXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldE9wdGlvbnMoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IG5ldyBOZ3hHYWxsZXJ5T3B0aW9ucyh7fSk7XHJcblxyXG4gICAgICAgIHRoaXMub3B0aW9uc1xyXG4gICAgICAgICAgICAuZmlsdGVyKChvcHQpID0+IG9wdC5icmVha3BvaW50ID09PSB1bmRlZmluZWQgfHwgb3B0LmJyZWFrcG9pbnQgPj0gdGhpcy5icmVha3BvaW50KVxyXG4gICAgICAgICAgICAubWFwKChvcHQpID0+IHRoaXMuY29tYmluZU9wdGlvbnModGhpcy5jdXJyZW50T3B0aW9ucywgb3B0KSk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSA8c3RyaW5nPnRoaXMuY3VycmVudE9wdGlvbnMud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSA8c3RyaW5nPnRoaXMuY3VycmVudE9wdGlvbnMuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29tYmluZU9wdGlvbnMoZmlyc3Q6IE5neEdhbGxlcnlPcHRpb25zLCBzZWNvbmQ6IE5neEdhbGxlcnlPcHRpb25zKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoc2Vjb25kKS5tYXAoKHZhbCkgPT4gZmlyc3RbdmFsXSA9IHNlY29uZFt2YWxdICE9PSB1bmRlZmluZWQgPyBzZWNvbmRbdmFsXSA6IGZpcnN0W3ZhbF0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==