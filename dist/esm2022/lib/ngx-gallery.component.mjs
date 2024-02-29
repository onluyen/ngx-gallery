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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.3", type: NgxGalleryComponent, selector: "ngx-gallery", inputs: { options: "options", images: "images" }, outputs: { imagesReady: "imagesReady", change: "change", previewOpen: "previewOpen", previewClose: "previewClose", previewChange: "previewChange" }, host: { listeners: { "window:resize": "onResize()" }, properties: { "style.width": "this.width", "style.height": "this.height", "style.left": "this.left" } }, providers: [NgxGalleryHelperService], viewQueries: [{ propertyName: "preview", first: true, predicate: NgxGalleryPreviewComponent, descendants: true }, { propertyName: "image", first: true, predicate: NgxGalleryImageComponent, descendants: true }, { propertyName: "thubmnails", first: true, predicate: NgxGalleryThumbnailsComponent, descendants: true }], ngImport: i0, template: `
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvamVjdHMvbmd4LWdhbGxlcnkvc3JjL2xpYi9uZ3gtZ2FsbGVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBa0MsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekosT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFMUQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDM0UsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDM0YsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDMUcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7Ozs7OztBQTBCOUQsTUFBTSxPQUFPLG1CQUFtQjtJQXFDUjtJQXBDWCxPQUFPLENBQXNCO0lBQzdCLE1BQU0sQ0FBb0I7SUFFekIsV0FBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDakMsTUFBTSxHQUFHLElBQUksWUFBWSxFQUE4QyxDQUFDO0lBQ3hFLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQ2pDLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQ2xDLGFBQWEsR0FBRyxJQUFJLFlBQVksRUFBOEMsQ0FBQztJQUV6RixXQUFXLENBQStCO0lBQzFDLFlBQVksQ0FBMkI7SUFDdkMsU0FBUyxDQUErQjtJQUN4QyxZQUFZLENBQVc7SUFD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WSxDQUFDLHVCQUF1QixDQUFDOytFQUczQixPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUVJLFdBQVc7c0JBQXBCLE1BQU07Z0JBQ0csTUFBTTtzQkFBZixNQUFNO2dCQUNHLFdBQVc7c0JBQXBCLE1BQU07Z0JBQ0csWUFBWTtzQkFBckIsTUFBTTtnQkFDRyxhQUFhO3NCQUF0QixNQUFNO2dCQXFCZ0MsT0FBTztzQkFBN0MsU0FBUzt1QkFBQywwQkFBMEI7Z0JBQ0EsS0FBSztzQkFBekMsU0FBUzt1QkFBQyx3QkFBd0I7Z0JBQ08sVUFBVTtzQkFBbkQsU0FBUzt1QkFBQyw2QkFBNkI7Z0JBRVosS0FBSztzQkFBaEMsV0FBVzt1QkFBQyxhQUFhO2dCQUNHLE1BQU07c0JBQWxDLFdBQVc7dUJBQUMsY0FBYztnQkFDQSxJQUFJO3NCQUE5QixXQUFXO3VCQUFDLFlBQVk7Z0JBNkNNLFFBQVE7c0JBQXRDLFlBQVk7dUJBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0LCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgVmlld0NoaWxkLCBIb3N0QmluZGluZywgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTYWZlUmVzb3VyY2VVcmwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeU9wdGlvbnMgfSBmcm9tICcuL25neC1nYWxsZXJ5LW9wdGlvbnMnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SW1hZ2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlLm1vZGVsJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktb3JkZXJlZC1pbWFnZS5tb2RlbCc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3L25neC1nYWxsZXJ5LXByZXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1pbWFnZS9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlMYXlvdXQgfSBmcm9tICcuL25neC1nYWxsZXJ5LWxheW91dC5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnbmd4LWdhbGxlcnknLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1sYXlvdXQge3tjdXJyZW50T3B0aW9ucz8ubGF5b3V0fX1cIj5cclxuICAgICAgPG5neC1nYWxsZXJ5LWltYWdlICpuZ0lmPVwiY3VycmVudE9wdGlvbnM/LmltYWdlXCIgXHJcbiAgICBbc3R5bGUuaGVpZ2h0XT1cImdldEltYWdlSGVpZ2h0KClcIiBbaW1hZ2VzXT1cIm1lZGl1bUltYWdlc1wiIFxyXG4gICAgW2NsaWNrYWJsZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1wiIFtzZWxlY3RlZEluZGV4XT1cInNlbGVjdGVkSW5kZXhcIlxyXG4gICAgW2Fycm93c109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXJyb3dzQXV0b0hpZGVcIiBcclxuICAgIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBcclxuICAgIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VTd2lwZVwiIFthbmltYXRpb25dPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQW5pbWF0aW9uXCIgW3NpemVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlU2l6ZVwiIFxyXG4gICAgW2F1dG9QbGF5XT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUF1dG9QbGF5XCIgW2F1dG9QbGF5SW50ZXJ2YWxdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXV0b1BsYXlJbnRlcnZhbFwiIFxyXG4gICAgW2F1dG9QbGF5UGF1c2VPbkhvdmVyXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUF1dG9QbGF5UGF1c2VPbkhvdmVyXCIgW2luZmluaXR5TW92ZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VJbmZpbml0eU1vdmVcIiBcclxuICAgIFtsYXp5TG9hZGluZ109XCJjdXJyZW50T3B0aW9ucz8ubGF6eUxvYWRpbmdcIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBY3Rpb25zXCIgW2Rlc2NyaXB0aW9uc109XCJkZXNjcmlwdGlvbnNcIiBcclxuICAgIFtzaG93RGVzY3JpcHRpb25dPVwiY3VycmVudE9wdGlvbnM/LmltYWdlRGVzY3JpcHRpb25cIiBbYnVsbGV0c109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VCdWxsZXRzXCIgXHJcbiAgICAob25DbGljayk9XCJvcGVuUHJldmlldygkZXZlbnQpXCIgKG9uQWN0aXZlQ2hhbmdlKT1cInNlbGVjdEZyb21JbWFnZSgkZXZlbnQpXCI+PC9uZ3gtZ2FsbGVyeS1pbWFnZT5cclxuXHJcbiAgICAgIDxuZ3gtZ2FsbGVyeS10aHVtYm5haWxzICpuZ0lmPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNcIiBbc3R5bGUubWFyZ2luVG9wXT1cImdldFRodW1ibmFpbHNNYXJnaW5Ub3AoKVwiIFtzdHlsZS5tYXJnaW5Cb3R0b21dPVwiZ2V0VGh1bWJuYWlsc01hcmdpbkJvdHRvbSgpXCIgW3N0eWxlLmhlaWdodF09XCJnZXRUaHVtYm5haWxzSGVpZ2h0KClcIiBbaW1hZ2VzXT1cInNtYWxsSW1hZ2VzXCIgW2xpbmtzXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQXNMaW5rcyA/IGxpbmtzIDogW11cIiBbbGFiZWxzXT1cImxhYmVsc1wiIFtsaW5rVGFyZ2V0XT1cImN1cnJlbnRPcHRpb25zPy5saW5rVGFyZ2V0XCIgW3NlbGVjdGVkSW5kZXhdPVwic2VsZWN0ZWRJbmRleFwiIFtjb2x1bW5zXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzQ29sdW1uc1wiIFtyb3dzXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzUm93c1wiIFttYXJnaW5dPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbE1hcmdpblwiIFthcnJvd3NdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNBcnJvd3NBdXRvSGlkZVwiIFthcnJvd1ByZXZJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd1ByZXZJY29uXCIgW2Fycm93TmV4dEljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93TmV4dEljb25cIiBbY2xpY2thYmxlXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZSB8fCBjdXJyZW50T3B0aW9ucz8ucHJldmlld1wiIFtzd2lwZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1N3aXBlXCIgW3NpemVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbFNpemVcIiBbbW92ZVNpemVdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNNb3ZlU2l6ZVwiIFtvcmRlcl09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc09yZGVyXCIgW3JlbWFpbmluZ0NvdW50XT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzUmVtYWluaW5nQ291bnRcIiBbbGF6eUxvYWRpbmddPVwiY3VycmVudE9wdGlvbnM/LmxhenlMb2FkaW5nXCIgW2FjdGlvbnNdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbEFjdGlvbnNcIiAgKG9uQWN0aXZlQ2hhbmdlKT1cInNlbGVjdEZyb21UaHVtYm5haWxzKCRldmVudClcIj48L25neC1nYWxsZXJ5LXRodW1ibmFpbHM+XHJcblxyXG4gICAgICA8bmd4LWdhbGxlcnktcHJldmlldyBbaW1hZ2VzXT1cImJpZ0ltYWdlc1wiIFtkZXNjcmlwdGlvbnNdPVwiZGVzY3JpcHRpb25zXCIgW3Nob3dEZXNjcmlwdGlvbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Rlc2NyaXB0aW9uXCIgW2Fycm93UHJldkljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93UHJldkljb25cIiBbYXJyb3dOZXh0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dOZXh0SWNvblwiIFtjbG9zZUljb25dPVwiY3VycmVudE9wdGlvbnM/LmNsb3NlSWNvblwiIFtmdWxsc2NyZWVuSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uZnVsbHNjcmVlbkljb25cIiBbc3Bpbm5lckljb25dPVwiY3VycmVudE9wdGlvbnM/LnNwaW5uZXJJY29uXCIgW2Fycm93c109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Fycm93c1wiIFthcnJvd3NBdXRvSGlkZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Fycm93c0F1dG9IaWRlXCIgW3N3aXBlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3U3dpcGVcIiBbZnVsbHNjcmVlbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Z1bGxzY3JlZW5cIiBbZm9yY2VGdWxsc2NyZWVuXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Rm9yY2VGdWxsc2NyZWVuXCIgW2Nsb3NlT25DbGlja109XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Nsb3NlT25DbGlja1wiIFtjbG9zZU9uRXNjXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Q2xvc2VPbkVzY1wiIFtrZXlib2FyZE5hdmlnYXRpb25dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdLZXlib2FyZE5hdmlnYXRpb25cIiBbYW5pbWF0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QW5pbWF0aW9uXCIgW2F1dG9QbGF5XT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXV0b1BsYXlcIiBbYXV0b1BsYXlJbnRlcnZhbF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0F1dG9QbGF5SW50ZXJ2YWxcIiBbYXV0b1BsYXlQYXVzZU9uSG92ZXJdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBdXRvUGxheVBhdXNlT25Ib3ZlclwiIFtpbmZpbml0eU1vdmVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdJbmZpbml0eU1vdmVcIiBbem9vbV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21cIiBbem9vbVN0ZXBdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tU3RlcFwiIFt6b29tTWF4XT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Wm9vbU1heFwiIFt6b29tTWluXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Wm9vbU1pblwiIFt6b29tSW5JY29uXT1cImN1cnJlbnRPcHRpb25zPy56b29tSW5JY29uXCIgW3pvb21PdXRJY29uXT1cImN1cnJlbnRPcHRpb25zPy56b29tT3V0SWNvblwiIFthY3Rpb25zXT1cImN1cnJlbnRPcHRpb25zPy5hY3Rpb25zXCIgW3JvdGF0ZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1JvdGF0ZVwiIFtyb3RhdGVMZWZ0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8ucm90YXRlTGVmdEljb25cIiBbcm90YXRlUmlnaHRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5yb3RhdGVSaWdodEljb25cIiBbZG93bmxvYWRdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdEb3dubG9hZFwiIFtkb3dubG9hZEljb25dPVwiY3VycmVudE9wdGlvbnM/LmRvd25sb2FkSWNvblwiIFtidWxsZXRzXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QnVsbGV0c1wiIChvbkNsb3NlKT1cIm9uUHJldmlld0Nsb3NlKClcIiAob25PcGVuKT1cIm9uUHJldmlld09wZW4oKVwiIChvbkFjdGl2ZUNoYW5nZSk9XCJwcmV2aWV3U2VsZWN0KCRldmVudClcIiBbY2xhc3Mubmd4LWdhbGxlcnktYWN0aXZlXT1cInByZXZpZXdFbmFibGVkXCI+PC9uZ3gtZ2FsbGVyeS1wcmV2aWV3PlxyXG4gICAgPC9kaXY+XHJcbiAgYCxcclxuICAgIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgICBwcm92aWRlcnM6IFtOZ3hHYWxsZXJ5SGVscGVyU2VydmljZV1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQge1xyXG4gICAgQElucHV0KCkgb3B0aW9uczogTmd4R2FsbGVyeU9wdGlvbnNbXTtcclxuICAgIEBJbnB1dCgpIGltYWdlczogTmd4R2FsbGVyeUltYWdlW107XHJcblxyXG4gICAgQE91dHB1dCgpIGltYWdlc1JlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8eyBpbmRleDogbnVtYmVyOyBpbWFnZTogTmd4R2FsbGVyeUltYWdlOyB9PigpO1xyXG4gICAgQE91dHB1dCgpIHByZXZpZXdPcGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQE91dHB1dCgpIHByZXZpZXdDbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSBwcmV2aWV3Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjx7IGluZGV4OiBudW1iZXI7IGltYWdlOiBOZ3hHYWxsZXJ5SW1hZ2U7IH0+KCk7XHJcblxyXG4gICAgc21hbGxJbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XHJcbiAgICBtZWRpdW1JbWFnZXM6IE5neEdhbGxlcnlPcmRlcmVkSW1hZ2VbXTtcclxuICAgIGJpZ0ltYWdlczogc3RyaW5nW10gfCBTYWZlUmVzb3VyY2VVcmxbXTtcclxuICAgIGRlc2NyaXB0aW9uczogc3RyaW5nW107XHJcbiAgICBsaW5rczogc3RyaW5nW107XHJcbiAgICBsYWJlbHM6IHN0cmluZ1tdO1xyXG5cclxuICAgIG9sZEltYWdlczogTmd4R2FsbGVyeUltYWdlW107XHJcbiAgICBvbGRJbWFnZXNMZW5ndGggPSAwO1xyXG5cclxuICAgIHNlbGVjdGVkSW5kZXggPSAwO1xyXG4gICAgcHJldmlld0VuYWJsZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgY3VycmVudE9wdGlvbnM6IE5neEdhbGxlcnlPcHRpb25zO1xyXG5cclxuICAgIHByaXZhdGUgYnJlYWtwb2ludDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBwcmV2QnJlYWtwb2ludDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gICAgcHJpdmF0ZSBmdWxsV2lkdGhUaW1lb3V0OiBhbnk7XHJcblxyXG4gICAgQFZpZXdDaGlsZChOZ3hHYWxsZXJ5UHJldmlld0NvbXBvbmVudCkgcHJldmlldzogTmd4R2FsbGVyeVByZXZpZXdDb21wb25lbnQ7XHJcbiAgICBAVmlld0NoaWxkKE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCkgaW1hZ2U6IE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudDtcclxuICAgIEBWaWV3Q2hpbGQoTmd4R2FsbGVyeVRodW1ibmFpbHNDb21wb25lbnQpIHRodWJtbmFpbHM6IE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50O1xyXG5cclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKSB3aWR0aDogc3RyaW5nO1xyXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKSBoZWlnaHQ6IHN0cmluZztcclxuICAgIEBIb3N0QmluZGluZygnc3R5bGUubGVmdCcpIGxlZnQ6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG15RWxlbWVudDogRWxlbWVudFJlZikgeyB9XHJcblxyXG4gICAgbmdPbkluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zLm1hcCgob3B0KSA9PiBuZXcgTmd4R2FsbGVyeU9wdGlvbnMob3B0KSk7XHJcbiAgICAgICAgdGhpcy5zb3J0T3B0aW9ucygpO1xyXG4gICAgICAgIHRoaXMuc2V0QnJlYWtwb2ludCgpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tGdWxsV2lkdGgoKTtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSA8bnVtYmVyPnRoaXMuY3VycmVudE9wdGlvbnMuc3RhcnRJbmRleDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmdEb0NoZWNrKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmltYWdlcyAhPT0gdW5kZWZpbmVkICYmICh0aGlzLmltYWdlcy5sZW5ndGggIT09IHRoaXMub2xkSW1hZ2VzTGVuZ3RoKVxyXG4gICAgICAgICAgICB8fCAodGhpcy5pbWFnZXMgIT09IHRoaXMub2xkSW1hZ2VzKSkge1xyXG4gICAgICAgICAgICB0aGlzLm9sZEltYWdlc0xlbmd0aCA9IHRoaXMuaW1hZ2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5vbGRJbWFnZXMgPSB0aGlzLmltYWdlcztcclxuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb25zKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VzKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5pbWFnZXMgJiYgdGhpcy5pbWFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltYWdlc1JlYWR5LmVtaXQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuaW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2UucmVzZXQoPG51bWJlcj50aGlzLmN1cnJlbnRPcHRpb25zLnN0YXJ0SW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzQXV0b0hpZGUgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzXHJcbiAgICAgICAgICAgICAgICAmJiB0aGlzLmltYWdlcy5sZW5ndGggPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlQXJyb3dzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRUaHVtYm5haWxzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpIG9uUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuc2V0QnJlYWtwb2ludCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2QnJlYWtwb2ludCAhPT0gdGhpcy5icmVha3BvaW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VGh1bWJuYWlscygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5mdWxsV2lkdGgpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZ1bGxXaWR0aFRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZ1bGxXaWR0aFRpbWVvdXQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZ1bGxXaWR0aFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGdWxsV2lkdGgoKTtcclxuICAgICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SW1hZ2VIZWlnaHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzKSA/XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2VQZXJjZW50ICsgJyUnIDogJzEwMCUnO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRodW1ibmFpbHNIZWlnaHQoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnY2FsYygnICsgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzUGVyY2VudCArICclIC0gJ1xyXG4gICAgICAgICAgICAgICAgKyB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNNYXJnaW4gKyAncHgpJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJzEwMCUnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRUaHVtYm5haWxzTWFyZ2luVG9wKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5sYXlvdXQgPT09IE5neEdhbGxlcnlMYXlvdXQuVGh1bWJuYWlsc0JvdHRvbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzTWFyZ2luICsgJ3B4JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJzBweCc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFRodW1ibmFpbHNNYXJnaW5Cb3R0b20oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmxheW91dCA9PT0gTmd4R2FsbGVyeUxheW91dC5UaHVtYm5haWxzVG9wKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNNYXJnaW4gKyAncHgnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnMHB4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb3BlblByZXZpZXcoaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zLnByZXZpZXdDdXN0b20pIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3Q3VzdG9tKGluZGV4KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpZXdFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3Lm9wZW4oaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblByZXZpZXdPcGVuKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucHJldmlld09wZW4uZW1pdCgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pbWFnZSAmJiB0aGlzLmltYWdlLmF1dG9QbGF5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2Uuc3RvcEF1dG9QbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uUHJldmlld0Nsb3NlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucHJldmlld0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnByZXZpZXdDbG9zZS5lbWl0KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmltYWdlICYmIHRoaXMuaW1hZ2UuYXV0b1BsYXkpIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZS5zdGFydEF1dG9QbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdEZyb21JbWFnZShpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3QoaW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdEZyb21UaHVtYm5haWxzKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdChpbmRleCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlscyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLnByZXZpZXdcclxuICAgICAgICAgICAgJiYgKCF0aGlzLmN1cnJlbnRPcHRpb25zLmltYWdlIHx8IHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1JlbWFpbmluZ0NvdW50KSkge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW5QcmV2aWV3KHRoaXMuc2VsZWN0ZWRJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNob3coaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0KGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93TmV4dCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmltYWdlLnNob3dOZXh0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1ByZXYoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5zaG93UHJldigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhblNob3dOZXh0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmltYWdlcyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUluZmluaXR5TW92ZSB8fCB0aGlzLnNlbGVjdGVkSW5kZXggPCB0aGlzLmltYWdlcy5sZW5ndGggLSAxKVxyXG4gICAgICAgICAgICAgICAgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjYW5TaG93UHJldigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5pbWFnZXMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2VJbmZpbml0eU1vdmUgfHwgdGhpcy5zZWxlY3RlZEluZGV4ID4gMCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcmV2aWV3U2VsZWN0KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnByZXZpZXdDaGFuZ2UuZW1pdCh7IGluZGV4LCBpbWFnZTogdGhpcy5pbWFnZXNbaW5kZXhdIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVUaHVtYm5haWxzUmlnaHQoKSB7XHJcbiAgICAgICAgdGhpcy50aHVibW5haWxzLm1vdmVSaWdodCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVUaHVtYm5haWxzTGVmdCgpIHtcclxuICAgICAgICB0aGlzLnRodWJtbmFpbHMubW92ZUxlZnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjYW5Nb3ZlVGh1bWJuYWlsc1JpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRodWJtbmFpbHMuY2FuTW92ZVJpZ2h0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FuTW92ZVRodW1ibmFpbHNMZWZ0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRodWJtbmFpbHMuY2FuTW92ZUxlZnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc2V0VGh1bWJuYWlscygpIHtcclxuICAgICAgICBpZiAodGhpcy50aHVibW5haWxzKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGh1Ym1uYWlscy5yZXNldCg8bnVtYmVyPnRoaXMuY3VycmVudE9wdGlvbnMuc3RhcnRJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2VsZWN0KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh7XHJcbiAgICAgICAgICAgIGluZGV4LFxyXG4gICAgICAgICAgICBpbWFnZTogdGhpcy5pbWFnZXNbaW5kZXhdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja0Z1bGxXaWR0aCgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50T3B0aW9ucyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLmZ1bGxXaWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIHRoaXMubGVmdCA9ICgtKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLVxyXG4gICAgICAgICAgICAgICAgdGhpcy5teUVsZW1lbnQubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLmlubmVyV2lkdGgpIC8gMikgKyAncHgnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEltYWdlcygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNtYWxsSW1hZ2VzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLnNtYWxsKTtcclxuICAgICAgICB0aGlzLm1lZGl1bUltYWdlcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiBuZXcgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSh7XHJcbiAgICAgICAgICAgIHNyYzogaW1nLm1lZGl1bSxcclxuICAgICAgICAgICAgaW5kZXg6IGlcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5iaWdJbWFnZXMgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcuYmlnKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9ucyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgdGhpcy5saW5rcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy51cmwpO1xyXG4gICAgICAgIHRoaXMubGFiZWxzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLmxhYmVsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEJyZWFrcG9pbnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wcmV2QnJlYWtwb2ludCA9IHRoaXMuYnJlYWtwb2ludDtcclxuICAgICAgICBsZXQgYnJlYWtwb2ludHM7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBicmVha3BvaW50cyA9IHRoaXMub3B0aW9ucy5maWx0ZXIoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQgPj0gd2luZG93LmlubmVyV2lkdGgpXHJcbiAgICAgICAgICAgICAgICAubWFwKChvcHQpID0+IG9wdC5icmVha3BvaW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChicmVha3BvaW50cyAmJiBicmVha3BvaW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5icmVha3BvaW50ID0gYnJlYWtwb2ludHMucG9wKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5icmVha3BvaW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNvcnRPcHRpb25zKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IFtcclxuICAgICAgICAgICAgLi4udGhpcy5vcHRpb25zLmZpbHRlcigoYSkgPT4gYS5icmVha3BvaW50ID09PSB1bmRlZmluZWQpLFxyXG4gICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGEpID0+IGEuYnJlYWtwb2ludCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIuYnJlYWtwb2ludCAtIGEuYnJlYWtwb2ludClcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0T3B0aW9ucygpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gbmV3IE5neEdhbGxlcnlPcHRpb25zKHt9KTtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQgPT09IHVuZGVmaW5lZCB8fCBvcHQuYnJlYWtwb2ludCA+PSB0aGlzLmJyZWFrcG9pbnQpXHJcbiAgICAgICAgICAgIC5tYXAoKG9wdCkgPT4gdGhpcy5jb21iaW5lT3B0aW9ucyh0aGlzLmN1cnJlbnRPcHRpb25zLCBvcHQpKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDxzdHJpbmc+dGhpcy5jdXJyZW50T3B0aW9ucy53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDxzdHJpbmc+dGhpcy5jdXJyZW50T3B0aW9ucy5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb21iaW5lT3B0aW9ucyhmaXJzdDogTmd4R2FsbGVyeU9wdGlvbnMsIHNlY29uZDogTmd4R2FsbGVyeU9wdGlvbnMpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhzZWNvbmQpLm1hcCgodmFsKSA9PiBmaXJzdFt2YWxdID0gc2Vjb25kW3ZhbF0gIT09IHVuZGVmaW5lZCA/IHNlY29uZFt2YWxdIDogZmlyc3RbdmFsXSk7XHJcbiAgICB9XHJcbn1cclxuIl19