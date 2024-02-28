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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.3", type: NgxGalleryComponent, selector: "ngx-gallery", inputs: { options: "options", images: "images" }, outputs: { imagesReady: "imagesReady", change: "change", previewOpen: "previewOpen", previewClose: "previewClose", previewChange: "previewChange" }, host: { listeners: { "window:resize": "onResize()" }, properties: { "style.width": "this.width", "style.height": "this.height", "style.left": "this.left" } }, providers: [NgxGalleryHelperService], viewQueries: [{ propertyName: "preview", first: true, predicate: NgxGalleryPreviewComponent, descendants: true }, { propertyName: "image", first: true, predicate: NgxGalleryImageComponent, descendants: true }, { propertyName: "thubmnails", first: true, predicate: NgxGalleryThumbnailsComponent, descendants: true }], ngImport: i0, template: `
    <div class="ngx-gallery-layout {{currentOptions?.layout}}">
      <ngx-gallery-image *ngIf="currentOptions?.image" [style.height]="getImageHeight()" [images]="mediumImages" [clickable]="currentOptions?.preview" [selectedIndex]="selectedIndex" [arrows]="currentOptions?.imageArrows" [arrowsAutoHide]="currentOptions?.imageArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [swipe]="currentOptions?.imageSwipe" [animation]="currentOptions?.imageAnimation" [size]="currentOptions?.imageSize" [autoPlay]="currentOptions?.imageAutoPlay" [autoPlayInterval]="currentOptions?.imageAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.imageAutoPlayPauseOnHover" [infinityMove]="currentOptions?.imageInfinityMove"  [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.imageActions" [descriptions]="descriptions" [showDescription]="currentOptions?.imageDescription" [bullets]="currentOptions?.imageBullets" (onClick)="openPreview($event)" (onActiveChange)="selectFromImage($event)"></ngx-gallery-image>

      <ngx-gallery-thumbnails *ngIf="currentOptions?.thumbnails" [style.marginTop]="getThumbnailsMarginTop()" [style.marginBottom]="getThumbnailsMarginBottom()" [style.height]="getThumbnailsHeight()" [images]="smallImages" [links]="currentOptions?.thumbnailsAsLinks ? links : []" [labels]="labels" [linkTarget]="currentOptions?.linkTarget" [selectedIndex]="selectedIndex" [columns]="currentOptions?.thumbnailsColumns" [rows]="currentOptions?.thumbnailsRows" [margin]="currentOptions?.thumbnailMargin" [arrows]="currentOptions?.thumbnailsArrows" [arrowsAutoHide]="currentOptions?.thumbnailsArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [clickable]="currentOptions?.image || currentOptions?.preview" [swipe]="currentOptions?.thumbnailsSwipe" [size]="currentOptions?.thumbnailSize" [moveSize]="currentOptions?.thumbnailsMoveSize" [order]="currentOptions?.thumbnailsOrder" [remainingCount]="currentOptions?.thumbnailsRemainingCount" [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.thumbnailActions"  (onActiveChange)="selectFromThumbnails($event)"></ngx-gallery-thumbnails>

      <ngx-gallery-preview [images]="bigImages" [descriptions]="descriptions" [showDescription]="currentOptions?.previewDescription" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [closeIcon]="currentOptions?.closeIcon" [fullscreenIcon]="currentOptions?.fullscreenIcon" [spinnerIcon]="currentOptions?.spinnerIcon" [arrows]="currentOptions?.previewArrows" [arrowsAutoHide]="currentOptions?.previewArrowsAutoHide" [swipe]="currentOptions?.previewSwipe" [fullscreen]="currentOptions?.previewFullscreen" [forceFullscreen]="currentOptions?.previewForceFullscreen" [closeOnClick]="currentOptions?.previewCloseOnClick" [closeOnEsc]="currentOptions?.previewCloseOnEsc" [keyboardNavigation]="currentOptions?.previewKeyboardNavigation" [animation]="currentOptions?.previewAnimation" [autoPlay]="currentOptions?.previewAutoPlay" [autoPlayInterval]="currentOptions?.previewAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.previewAutoPlayPauseOnHover" [infinityMove]="currentOptions?.previewInfinityMove" [zoom]="currentOptions?.previewZoom" [zoomStep]="currentOptions?.previewZoomStep" [zoomMax]="currentOptions?.previewZoomMax" [zoomMin]="currentOptions?.previewZoomMin" [zoomInIcon]="currentOptions?.zoomInIcon" [zoomOutIcon]="currentOptions?.zoomOutIcon" [actions]="currentOptions?.actions" [rotate]="currentOptions?.previewRotate" [rotateLeftIcon]="currentOptions?.rotateLeftIcon" [rotateRightIcon]="currentOptions?.rotateRightIcon" [download]="currentOptions?.previewDownload" [downloadIcon]="currentOptions?.downloadIcon" [bullets]="currentOptions?.previewBullets" (onClose)="onPreviewClose()" (onOpen)="onPreviewOpen()" (onActiveChange)="previewSelect($event)" [class.ngx-gallery-active]="previewEnabled"></ngx-gallery-preview>
    </div>
  `, isInline: true, styles: [":host{display:inline-block}:host>*{float:left}:host ::ng-deep *{box-sizing:border-box}:host ::ng-deep .ngx-gallery-icon{color:#fff;font-size:25px;position:absolute;z-index:2000;display:inline-block}:host ::ng-deep .ngx-gallery-icon .ngx-gallery-icon-content{display:block}:host ::ng-deep .ngx-gallery-clickable{cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper .ngx-gallery-icon{position:relative;margin-right:5px;margin-top:5px;font-size:20px;cursor:pointer}:host ::ng-deep .ngx-gallery-icons-wrapper{float:right}:host .ngx-gallery-layout{width:100%;height:100%;display:flex;flex-direction:column}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-image{order:2}:host .ngx-gallery-layout.thumbnails-top ngx-gallery-thumbnails{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-image{order:1}:host .ngx-gallery-layout.thumbnails-bottom ngx-gallery-thumbnails{order:2}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.NgxGalleryPreviewComponent, selector: "ngx-gallery-preview", inputs: ["images", "descriptions", "showDescription", "arrows", "arrowsAutoHide", "swipe", "fullscreen", "forceFullscreen", "closeOnClick", "closeOnEsc", "keyboardNavigation", "arrowPrevIcon", "arrowNextIcon", "closeIcon", "fullscreenIcon", "spinnerIcon", "autoPlay", "autoPlayInterval", "autoPlayPauseOnHover", "infinityMove", "zoom", "zoomStep", "zoomMax", "zoomMin", "zoomInIcon", "zoomOutIcon", "animation", "actions", "rotate", "rotateLeftIcon", "rotateRightIcon", "download", "downloadIcon", "bullets"], outputs: ["onOpen", "onClose", "onActiveChange"] }, { kind: "component", type: i3.NgxGalleryImageComponent, selector: "ngx-gallery-image", inputs: ["images", "clickable", "selectedIndex", "arrows", "arrowsAutoHide", "swipe", "animation", "size", "arrowPrevIcon", "arrowNextIcon", "autoPlay", "autoPlayInterval", "autoPlayPauseOnHover", "infinityMove", "lazyLoading", "actions", "descriptions", "showDescription", "bullets"], outputs: ["onClick", "onActiveChange"] }, { kind: "component", type: i4.NgxGalleryThumbnailsComponent, selector: "ngx-gallery-thumbnails", inputs: ["images", "links", "labels", "linkTarget", "columns", "rows", "arrows", "arrowsAutoHide", "margin", "selectedIndex", "clickable", "swipe", "size", "arrowPrevIcon", "arrowNextIcon", "moveSize", "order", "remainingCount", "lazyLoading", "actions"], outputs: ["onActiveChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery', template: `
    <div class="ngx-gallery-layout {{currentOptions?.layout}}">
      <ngx-gallery-image *ngIf="currentOptions?.image" [style.height]="getImageHeight()" [images]="mediumImages" [clickable]="currentOptions?.preview" [selectedIndex]="selectedIndex" [arrows]="currentOptions?.imageArrows" [arrowsAutoHide]="currentOptions?.imageArrowsAutoHide" [arrowPrevIcon]="currentOptions?.arrowPrevIcon" [arrowNextIcon]="currentOptions?.arrowNextIcon" [swipe]="currentOptions?.imageSwipe" [animation]="currentOptions?.imageAnimation" [size]="currentOptions?.imageSize" [autoPlay]="currentOptions?.imageAutoPlay" [autoPlayInterval]="currentOptions?.imageAutoPlayInterval" [autoPlayPauseOnHover]="currentOptions?.imageAutoPlayPauseOnHover" [infinityMove]="currentOptions?.imageInfinityMove"  [lazyLoading]="currentOptions?.lazyLoading" [actions]="currentOptions?.imageActions" [descriptions]="descriptions" [showDescription]="currentOptions?.imageDescription" [bullets]="currentOptions?.imageBullets" (onClick)="openPreview($event)" (onActiveChange)="selectFromImage($event)"></ngx-gallery-image>

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvamVjdHMvbmd4LWdhbGxlcnkvc3JjL2xpYi9uZ3gtZ2FsbGVyeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBa0MsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFjLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekosT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFHMUQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDM0UsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDakcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDM0YsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sMkRBQTJELENBQUM7QUFDMUcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7Ozs7OztBQWdCOUQsTUFBTSxPQUFPLG1CQUFtQjtJQXFDOUIsWUFBb0IsU0FBcUI7UUFBckIsY0FBUyxHQUFULFNBQVMsQ0FBWTtRQWpDL0IsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2pDLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBOEMsQ0FBQztRQUN4RSxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakMsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQThDLENBQUM7UUFVekYsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFFcEIsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFLVixl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QWE7Z0JBQ0csTUFBTTtzQkFBbEMsV0FBVzt1QkFBQyxjQUFjO2dCQUNBLElBQUk7c0JBQTlCLFdBQVc7dUJBQUMsWUFBWTtnQkE2Q00sUUFBUTtzQkFBdEMsWUFBWTt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQsIEV2ZW50RW1pdHRlciwgT3V0cHV0LCBWaWV3Q2hpbGQsIEhvc3RCaW5kaW5nLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNhZmVSZXNvdXJjZVVybCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5T3B0aW9ucyB9IGZyb20gJy4vbmd4LWdhbGxlcnktb3B0aW9ucyc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlJbWFnZVNpemUgfSBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlLXNpemUubW9kZWwnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5SW1hZ2UgfSBmcm9tICcuL25neC1nYWxsZXJ5LWltYWdlLm1vZGVsJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSB9IGZyb20gJy4vbmd4LWdhbGxlcnktb3JkZXJlZC1pbWFnZS5tb2RlbCc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3L25neC1nYWxsZXJ5LXByZXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUltYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9uZ3gtZ2FsbGVyeS1pbWFnZS9uZ3gtZ2FsbGVyeS1pbWFnZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudCB9IGZyb20gJy4vbmd4LWdhbGxlcnktdGh1bWJuYWlscy9uZ3gtZ2FsbGVyeS10aHVtYm5haWxzLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE5neEdhbGxlcnlMYXlvdXQgfSBmcm9tICcuL25neC1nYWxsZXJ5LWxheW91dC5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5JyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LWxheW91dCB7e2N1cnJlbnRPcHRpb25zPy5sYXlvdXR9fVwiPlxyXG4gICAgICA8bmd4LWdhbGxlcnktaW1hZ2UgKm5nSWY9XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VcIiBbc3R5bGUuaGVpZ2h0XT1cImdldEltYWdlSGVpZ2h0KClcIiBbaW1hZ2VzXT1cIm1lZGl1bUltYWdlc1wiIFtjbGlja2FibGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdcIiBbc2VsZWN0ZWRJbmRleF09XCJzZWxlY3RlZEluZGV4XCIgW2Fycm93c109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBcnJvd3NcIiBbYXJyb3dzQXV0b0hpZGVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXJyb3dzQXV0b0hpZGVcIiBbYXJyb3dQcmV2SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd05leHRJY29uXCIgW3N3aXBlXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZVN3aXBlXCIgW2FuaW1hdGlvbl09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBbmltYXRpb25cIiBbc2l6ZV09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VTaXplXCIgW2F1dG9QbGF5XT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZUF1dG9QbGF5XCIgW2F1dG9QbGF5SW50ZXJ2YWxdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQXV0b1BsYXlJbnRlcnZhbFwiIFthdXRvUGxheVBhdXNlT25Ib3Zlcl09XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBdXRvUGxheVBhdXNlT25Ib3ZlclwiIFtpbmZpbml0eU1vdmVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlSW5maW5pdHlNb3ZlXCIgIFtsYXp5TG9hZGluZ109XCJjdXJyZW50T3B0aW9ucz8ubGF6eUxvYWRpbmdcIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8uaW1hZ2VBY3Rpb25zXCIgW2Rlc2NyaXB0aW9uc109XCJkZXNjcmlwdGlvbnNcIiBbc2hvd0Rlc2NyaXB0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5pbWFnZURlc2NyaXB0aW9uXCIgW2J1bGxldHNdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlQnVsbGV0c1wiIChvbkNsaWNrKT1cIm9wZW5QcmV2aWV3KCRldmVudClcIiAob25BY3RpdmVDaGFuZ2UpPVwic2VsZWN0RnJvbUltYWdlKCRldmVudClcIj48L25neC1nYWxsZXJ5LWltYWdlPlxyXG5cclxuICAgICAgPG5neC1nYWxsZXJ5LXRodW1ibmFpbHMgKm5nSWY9XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc1wiIFtzdHlsZS5tYXJnaW5Ub3BdPVwiZ2V0VGh1bWJuYWlsc01hcmdpblRvcCgpXCIgW3N0eWxlLm1hcmdpbkJvdHRvbV09XCJnZXRUaHVtYm5haWxzTWFyZ2luQm90dG9tKClcIiBbc3R5bGUuaGVpZ2h0XT1cImdldFRodW1ibmFpbHNIZWlnaHQoKVwiIFtpbWFnZXNdPVwic21hbGxJbWFnZXNcIiBbbGlua3NdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNBc0xpbmtzID8gbGlua3MgOiBbXVwiIFtsYWJlbHNdPVwibGFiZWxzXCIgW2xpbmtUYXJnZXRdPVwiY3VycmVudE9wdGlvbnM/LmxpbmtUYXJnZXRcIiBbc2VsZWN0ZWRJbmRleF09XCJzZWxlY3RlZEluZGV4XCIgW2NvbHVtbnNdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNDb2x1bW5zXCIgW3Jvd3NdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNSb3dzXCIgW21hcmdpbl09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsTWFyZ2luXCIgW2Fycm93c109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc0Fycm93c1wiIFthcnJvd3NBdXRvSGlkZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc0Fycm93c0F1dG9IaWRlXCIgW2Fycm93UHJldkljb25dPVwiY3VycmVudE9wdGlvbnM/LmFycm93UHJldkljb25cIiBbYXJyb3dOZXh0SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dOZXh0SWNvblwiIFtjbGlja2FibGVdPVwiY3VycmVudE9wdGlvbnM/LmltYWdlIHx8IGN1cnJlbnRPcHRpb25zPy5wcmV2aWV3XCIgW3N3aXBlXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzU3dpcGVcIiBbc2l6ZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsU2l6ZVwiIFttb3ZlU2l6ZV09XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsc01vdmVTaXplXCIgW29yZGVyXT1cImN1cnJlbnRPcHRpb25zPy50aHVtYm5haWxzT3JkZXJcIiBbcmVtYWluaW5nQ291bnRdPVwiY3VycmVudE9wdGlvbnM/LnRodW1ibmFpbHNSZW1haW5pbmdDb3VudFwiIFtsYXp5TG9hZGluZ109XCJjdXJyZW50T3B0aW9ucz8ubGF6eUxvYWRpbmdcIiBbYWN0aW9uc109XCJjdXJyZW50T3B0aW9ucz8udGh1bWJuYWlsQWN0aW9uc1wiICAob25BY3RpdmVDaGFuZ2UpPVwic2VsZWN0RnJvbVRodW1ibmFpbHMoJGV2ZW50KVwiPjwvbmd4LWdhbGxlcnktdGh1bWJuYWlscz5cclxuXHJcbiAgICAgIDxuZ3gtZ2FsbGVyeS1wcmV2aWV3IFtpbWFnZXNdPVwiYmlnSW1hZ2VzXCIgW2Rlc2NyaXB0aW9uc109XCJkZXNjcmlwdGlvbnNcIiBbc2hvd0Rlc2NyaXB0aW9uXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3RGVzY3JpcHRpb25cIiBbYXJyb3dQcmV2SWNvbl09XCJjdXJyZW50T3B0aW9ucz8uYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5hcnJvd05leHRJY29uXCIgW2Nsb3NlSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uY2xvc2VJY29uXCIgW2Z1bGxzY3JlZW5JY29uXT1cImN1cnJlbnRPcHRpb25zPy5mdWxsc2NyZWVuSWNvblwiIFtzcGlubmVySWNvbl09XCJjdXJyZW50T3B0aW9ucz8uc3Bpbm5lckljb25cIiBbYXJyb3dzXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXJyb3dzXCIgW2Fycm93c0F1dG9IaWRlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXJyb3dzQXV0b0hpZGVcIiBbc3dpcGVdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdTd2lwZVwiIFtmdWxsc2NyZWVuXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3RnVsbHNjcmVlblwiIFtmb3JjZUZ1bGxzY3JlZW5dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdGb3JjZUZ1bGxzY3JlZW5cIiBbY2xvc2VPbkNsaWNrXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Q2xvc2VPbkNsaWNrXCIgW2Nsb3NlT25Fc2NdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdDbG9zZU9uRXNjXCIgW2tleWJvYXJkTmF2aWdhdGlvbl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0tleWJvYXJkTmF2aWdhdGlvblwiIFthbmltYXRpb25dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBbmltYXRpb25cIiBbYXV0b1BsYXldPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdBdXRvUGxheVwiIFthdXRvUGxheUludGVydmFsXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3QXV0b1BsYXlJbnRlcnZhbFwiIFthdXRvUGxheVBhdXNlT25Ib3Zlcl09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0F1dG9QbGF5UGF1c2VPbkhvdmVyXCIgW2luZmluaXR5TW92ZV09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0luZmluaXR5TW92ZVwiIFt6b29tXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Wm9vbVwiIFt6b29tU3RlcF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld1pvb21TdGVwXCIgW3pvb21NYXhdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tTWF4XCIgW3pvb21NaW5dPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdab29tTWluXCIgW3pvb21Jbkljb25dPVwiY3VycmVudE9wdGlvbnM/Lnpvb21Jbkljb25cIiBbem9vbU91dEljb25dPVwiY3VycmVudE9wdGlvbnM/Lnpvb21PdXRJY29uXCIgW2FjdGlvbnNdPVwiY3VycmVudE9wdGlvbnM/LmFjdGlvbnNcIiBbcm90YXRlXT1cImN1cnJlbnRPcHRpb25zPy5wcmV2aWV3Um90YXRlXCIgW3JvdGF0ZUxlZnRJY29uXT1cImN1cnJlbnRPcHRpb25zPy5yb3RhdGVMZWZ0SWNvblwiIFtyb3RhdGVSaWdodEljb25dPVwiY3VycmVudE9wdGlvbnM/LnJvdGF0ZVJpZ2h0SWNvblwiIFtkb3dubG9hZF09XCJjdXJyZW50T3B0aW9ucz8ucHJldmlld0Rvd25sb2FkXCIgW2Rvd25sb2FkSWNvbl09XCJjdXJyZW50T3B0aW9ucz8uZG93bmxvYWRJY29uXCIgW2J1bGxldHNdPVwiY3VycmVudE9wdGlvbnM/LnByZXZpZXdCdWxsZXRzXCIgKG9uQ2xvc2UpPVwib25QcmV2aWV3Q2xvc2UoKVwiIChvbk9wZW4pPVwib25QcmV2aWV3T3BlbigpXCIgKG9uQWN0aXZlQ2hhbmdlKT1cInByZXZpZXdTZWxlY3QoJGV2ZW50KVwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1hY3RpdmVdPVwicHJldmlld0VuYWJsZWRcIj48L25neC1nYWxsZXJ5LXByZXZpZXc+XHJcbiAgICA8L2Rpdj5cclxuICBgLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1nYWxsZXJ5LmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgcHJvdmlkZXJzOiBbTmd4R2FsbGVyeUhlbHBlclNlcnZpY2VdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hHYWxsZXJ5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBvcHRpb25zOiBOZ3hHYWxsZXJ5T3B0aW9uc1tdO1xyXG4gIEBJbnB1dCgpIGltYWdlczogTmd4R2FsbGVyeUltYWdlW107XHJcblxyXG4gIEBPdXRwdXQoKSBpbWFnZXNSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgY2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjx7IGluZGV4OiBudW1iZXI7IGltYWdlOiBOZ3hHYWxsZXJ5SW1hZ2U7IH0+KCk7XHJcbiAgQE91dHB1dCgpIHByZXZpZXdPcGVuID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBwcmV2aWV3Q2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIHByZXZpZXdDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgaW5kZXg6IG51bWJlcjsgaW1hZ2U6IE5neEdhbGxlcnlJbWFnZTsgfT4oKTtcclxuXHJcbiAgc21hbGxJbWFnZXM6IHN0cmluZ1tdIHwgU2FmZVJlc291cmNlVXJsW107XHJcbiAgbWVkaXVtSW1hZ2VzOiBOZ3hHYWxsZXJ5T3JkZXJlZEltYWdlW107XHJcbiAgYmlnSW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xyXG4gIGRlc2NyaXB0aW9uczogc3RyaW5nW107XHJcbiAgbGlua3M6IHN0cmluZ1tdO1xyXG4gIGxhYmVsczogc3RyaW5nW107XHJcblxyXG4gIG9sZEltYWdlczogTmd4R2FsbGVyeUltYWdlW107XHJcbiAgb2xkSW1hZ2VzTGVuZ3RoID0gMDtcclxuXHJcbiAgc2VsZWN0ZWRJbmRleCA9IDA7XHJcbiAgcHJldmlld0VuYWJsZWQ6IGJvb2xlYW47XHJcblxyXG4gIGN1cnJlbnRPcHRpb25zOiBOZ3hHYWxsZXJ5T3B0aW9ucztcclxuXHJcbiAgcHJpdmF0ZSBicmVha3BvaW50OiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcbiAgcHJpdmF0ZSBwcmV2QnJlYWtwb2ludDogbnVtYmVyIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG4gIHByaXZhdGUgZnVsbFdpZHRoVGltZW91dDogYW55O1xyXG5cclxuICBAVmlld0NoaWxkKE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50KSBwcmV2aWV3OiBOZ3hHYWxsZXJ5UHJldmlld0NvbXBvbmVudDtcclxuICBAVmlld0NoaWxkKE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudCkgaW1hZ2U6IE5neEdhbGxlcnlJbWFnZUNvbXBvbmVudDtcclxuICBAVmlld0NoaWxkKE5neEdhbGxlcnlUaHVtYm5haWxzQ29tcG9uZW50KSB0aHVibW5haWxzOiBOZ3hHYWxsZXJ5VGh1bWJuYWlsc0NvbXBvbmVudDtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpIHdpZHRoOiBzdHJpbmc7XHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKSBoZWlnaHQ6IHN0cmluZztcclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmxlZnQnKSBsZWZ0OiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbXlFbGVtZW50OiBFbGVtZW50UmVmKSB7fVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zLm1hcCgob3B0KSA9PiBuZXcgTmd4R2FsbGVyeU9wdGlvbnMob3B0KSk7XHJcbiAgICAgIHRoaXMuc29ydE9wdGlvbnMoKTtcclxuICAgICAgdGhpcy5zZXRCcmVha3BvaW50KCk7XHJcbiAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xyXG4gICAgICB0aGlzLmNoZWNrRnVsbFdpZHRoKCk7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zKSB7XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSA8bnVtYmVyPnRoaXMuY3VycmVudE9wdGlvbnMuc3RhcnRJbmRleDtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbWFnZXMgIT09IHVuZGVmaW5lZCAmJiAodGhpcy5pbWFnZXMubGVuZ3RoICE9PSB0aGlzLm9sZEltYWdlc0xlbmd0aClcclxuICAgICAgICAgIHx8ICh0aGlzLmltYWdlcyAhPT0gdGhpcy5vbGRJbWFnZXMpKSB7XHJcbiAgICAgICAgICB0aGlzLm9sZEltYWdlc0xlbmd0aCA9IHRoaXMuaW1hZ2VzLmxlbmd0aDtcclxuICAgICAgICAgIHRoaXMub2xkSW1hZ2VzID0gdGhpcy5pbWFnZXM7XHJcbiAgICAgICAgICB0aGlzLnNldE9wdGlvbnMoKTtcclxuICAgICAgICAgIHRoaXMuc2V0SW1hZ2VzKCk7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW1hZ2VzICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaW1hZ2VzUmVhZHkuZW1pdCgpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmltYWdlKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5pbWFnZS5yZXNldCg8bnVtYmVyPnRoaXMuY3VycmVudE9wdGlvbnMuc3RhcnRJbmRleCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc0F1dG9IaWRlICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc1xyXG4gICAgICAgICAgICAgICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZUFycm93cyA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMucmVzZXRUaHVtYm5haWxzKCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jaGVja0Z1bGxXaWR0aCgpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpIG9uUmVzaXplKCkge1xyXG4gICAgICB0aGlzLnNldEJyZWFrcG9pbnQoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnByZXZCcmVha3BvaW50ICE9PSB0aGlzLmJyZWFrcG9pbnQpIHtcclxuICAgICAgICAgIHRoaXMuc2V0T3B0aW9ucygpO1xyXG4gICAgICAgICAgdGhpcy5yZXNldFRodW1ibmFpbHMoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5mdWxsV2lkdGgpIHtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5mdWxsV2lkdGhUaW1lb3V0KSB7XHJcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZnVsbFdpZHRoVGltZW91dCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5mdWxsV2lkdGhUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jaGVja0Z1bGxXaWR0aCgpO1xyXG4gICAgICAgICAgfSwgMjAwKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0SW1hZ2VIZWlnaHQoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlscykgP1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZVBlcmNlbnQgKyAnJScgOiAnMTAwJSc7XHJcbiAgfVxyXG5cclxuICBnZXRUaHVtYm5haWxzSGVpZ2h0KCk6IHN0cmluZyB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2UpIHtcclxuICAgICAgICAgIHJldHVybiAnY2FsYygnICsgdGhpcy5jdXJyZW50T3B0aW9ucy50aHVtYm5haWxzUGVyY2VudCArICclIC0gJ1xyXG4gICAgICAgICAgKyB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNNYXJnaW4gKyAncHgpJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiAnMTAwJSc7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGdldFRodW1ibmFpbHNNYXJnaW5Ub3AoKTogc3RyaW5nIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5sYXlvdXQgPT09IE5neEdhbGxlcnlMYXlvdXQuVGh1bWJuYWlsc0JvdHRvbSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc01hcmdpbiArICdweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gJzBweCc7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGdldFRodW1ibmFpbHNNYXJnaW5Cb3R0b20oKTogc3RyaW5nIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5sYXlvdXQgPT09IE5neEdhbGxlcnlMYXlvdXQuVGh1bWJuYWlsc1RvcCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlsc01hcmdpbiArICdweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gJzBweCc7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIG9wZW5QcmV2aWV3KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMucHJldmlld0N1c3RvbSkge1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5wcmV2aWV3Q3VzdG9tKGluZGV4KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucHJldmlld0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5wcmV2aWV3Lm9wZW4oaW5kZXgpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBvblByZXZpZXdPcGVuKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnByZXZpZXdPcGVuLmVtaXQoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmltYWdlICYmIHRoaXMuaW1hZ2UuYXV0b1BsYXkpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2Uuc3RvcEF1dG9QbGF5KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIG9uUHJldmlld0Nsb3NlKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnByZXZpZXdFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgIHRoaXMucHJldmlld0Nsb3NlLmVtaXQoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmltYWdlICYmIHRoaXMuaW1hZ2UuYXV0b1BsYXkpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2Uuc3RhcnRBdXRvUGxheSgpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBzZWxlY3RGcm9tSW1hZ2UoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICB0aGlzLnNlbGVjdChpbmRleCk7XHJcbiAgfVxyXG5cclxuICBzZWxlY3RGcm9tVGh1bWJuYWlscyhpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0KGluZGV4KTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRPcHRpb25zICYmIHRoaXMuY3VycmVudE9wdGlvbnMudGh1bWJuYWlscyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zLnByZXZpZXdcclxuICAgICAgICAgICYmICghdGhpcy5jdXJyZW50T3B0aW9ucy5pbWFnZSB8fCB0aGlzLmN1cnJlbnRPcHRpb25zLnRodW1ibmFpbHNSZW1haW5pbmdDb3VudCkpIHtcclxuICAgICAgICAgIHRoaXMub3BlblByZXZpZXcodGhpcy5zZWxlY3RlZEluZGV4KTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgc2hvdyhpbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2VsZWN0KGluZGV4KTtcclxuICB9XHJcblxyXG4gIHNob3dOZXh0KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmltYWdlLnNob3dOZXh0KCk7XHJcbiAgfVxyXG5cclxuICBzaG93UHJldigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbWFnZS5zaG93UHJldigpO1xyXG4gIH1cclxuXHJcbiAgY2FuU2hvd05leHQoKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICh0aGlzLmltYWdlcyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zKSB7XHJcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2VJbmZpbml0eU1vdmUgfHwgdGhpcy5zZWxlY3RlZEluZGV4IDwgdGhpcy5pbWFnZXMubGVuZ3RoIC0gMSlcclxuICAgICAgICAgICAgICA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgY2FuU2hvd1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICh0aGlzLmltYWdlcyAmJiB0aGlzLmN1cnJlbnRPcHRpb25zKSB7XHJcbiAgICAgICAgICByZXR1cm4gKHRoaXMuY3VycmVudE9wdGlvbnMuaW1hZ2VJbmZpbml0eU1vdmUgfHwgdGhpcy5zZWxlY3RlZEluZGV4ID4gMCkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHByZXZpZXdTZWxlY3QoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICB0aGlzLnByZXZpZXdDaGFuZ2UuZW1pdCh7aW5kZXgsIGltYWdlOiB0aGlzLmltYWdlc1tpbmRleF19KTtcclxuICB9XHJcblxyXG4gIG1vdmVUaHVtYm5haWxzUmlnaHQoKSB7XHJcbiAgICAgIHRoaXMudGh1Ym1uYWlscy5tb3ZlUmlnaHQoKTtcclxuICB9XHJcblxyXG4gIG1vdmVUaHVtYm5haWxzTGVmdCgpIHtcclxuICAgICAgdGhpcy50aHVibW5haWxzLm1vdmVMZWZ0KCk7XHJcbiAgfVxyXG5cclxuICBjYW5Nb3ZlVGh1bWJuYWlsc1JpZ2h0KCkge1xyXG4gICAgICByZXR1cm4gdGhpcy50aHVibW5haWxzLmNhbk1vdmVSaWdodCgpO1xyXG4gIH1cclxuXHJcbiAgY2FuTW92ZVRodW1ibmFpbHNMZWZ0KCkge1xyXG4gICAgICByZXR1cm4gdGhpcy50aHVibW5haWxzLmNhbk1vdmVMZWZ0KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlc2V0VGh1bWJuYWlscygpIHtcclxuICAgICAgaWYgKHRoaXMudGh1Ym1uYWlscykge1xyXG4gICAgICAgICAgdGhpcy50aHVibW5haWxzLnJlc2V0KDxudW1iZXI+dGhpcy5jdXJyZW50T3B0aW9ucy5zdGFydEluZGV4KTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZWxlY3QoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSBpbmRleDtcclxuXHJcbiAgICAgIHRoaXMuY2hhbmdlLmVtaXQoe1xyXG4gICAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgICBpbWFnZTogdGhpcy5pbWFnZXNbaW5kZXhdXHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0Z1bGxXaWR0aCgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudE9wdGlvbnMgJiYgdGhpcy5jdXJyZW50T3B0aW9ucy5mdWxsV2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMud2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoICsgJ3B4JztcclxuICAgICAgICAgIHRoaXMubGVmdCA9ICgtKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLVxyXG4gICAgICAgICAgICAgIHRoaXMubXlFbGVtZW50Lm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5pbm5lcldpZHRoKSAvIDIpICsgJ3B4JztcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRJbWFnZXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc21hbGxJbWFnZXMgPSB0aGlzLmltYWdlcy5tYXAoKGltZykgPT4gPHN0cmluZz5pbWcuc21hbGwpO1xyXG4gICAgICB0aGlzLm1lZGl1bUltYWdlcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nLCBpKSA9PiBuZXcgTmd4R2FsbGVyeU9yZGVyZWRJbWFnZSh7XHJcbiAgICAgICAgICBzcmM6IGltZy5tZWRpdW0sXHJcbiAgICAgICAgICBpbmRleDogaVxyXG4gICAgICB9KSk7XHJcbiAgICAgIHRoaXMuYmlnSW1hZ2VzID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLmJpZyk7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25zID0gdGhpcy5pbWFnZXMubWFwKChpbWcpID0+IDxzdHJpbmc+aW1nLmRlc2NyaXB0aW9uKTtcclxuICAgICAgdGhpcy5saW5rcyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy51cmwpO1xyXG4gICAgICB0aGlzLmxhYmVscyA9IHRoaXMuaW1hZ2VzLm1hcCgoaW1nKSA9PiA8c3RyaW5nPmltZy5sYWJlbCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEJyZWFrcG9pbnQoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucHJldkJyZWFrcG9pbnQgPSB0aGlzLmJyZWFrcG9pbnQ7XHJcbiAgICAgIGxldCBicmVha3BvaW50cztcclxuXHJcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgYnJlYWtwb2ludHMgPSB0aGlzLm9wdGlvbnMuZmlsdGVyKChvcHQpID0+IG9wdC5icmVha3BvaW50ID49IHdpbmRvdy5pbm5lcldpZHRoKVxyXG4gICAgICAgICAgICAgIC5tYXAoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYnJlYWtwb2ludHMgJiYgYnJlYWtwb2ludHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICB0aGlzLmJyZWFrcG9pbnQgPSBicmVha3BvaW50cy5wb3AoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYnJlYWtwb2ludCA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzb3J0T3B0aW9ucygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5vcHRpb25zID0gW1xyXG4gICAgICAgICAgLi4udGhpcy5vcHRpb25zLmZpbHRlcigoYSkgPT4gYS5icmVha3BvaW50ID09PSB1bmRlZmluZWQpLFxyXG4gICAgICAgICAgLi4udGhpcy5vcHRpb25zXHJcbiAgICAgICAgICAgICAgLmZpbHRlcigoYSkgPT4gYS5icmVha3BvaW50ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIuYnJlYWtwb2ludCAtIGEuYnJlYWtwb2ludClcclxuICAgICAgXTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0T3B0aW9ucygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IG5ldyBOZ3hHYWxsZXJ5T3B0aW9ucyh7fSk7XHJcblxyXG4gICAgICB0aGlzLm9wdGlvbnNcclxuICAgICAgICAgIC5maWx0ZXIoKG9wdCkgPT4gb3B0LmJyZWFrcG9pbnQgPT09IHVuZGVmaW5lZCB8fCBvcHQuYnJlYWtwb2ludCA+PSB0aGlzLmJyZWFrcG9pbnQpXHJcbiAgICAgICAgICAubWFwKChvcHQpID0+IHRoaXMuY29tYmluZU9wdGlvbnModGhpcy5jdXJyZW50T3B0aW9ucywgb3B0KSk7XHJcblxyXG4gICAgICB0aGlzLndpZHRoID0gPHN0cmluZz50aGlzLmN1cnJlbnRPcHRpb25zLndpZHRoO1xyXG4gICAgICB0aGlzLmhlaWdodCA9IDxzdHJpbmc+dGhpcy5jdXJyZW50T3B0aW9ucy5oZWlnaHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbWJpbmVPcHRpb25zKGZpcnN0OiBOZ3hHYWxsZXJ5T3B0aW9ucywgc2Vjb25kOiBOZ3hHYWxsZXJ5T3B0aW9ucykge1xyXG4gICAgICBPYmplY3Qua2V5cyhzZWNvbmQpLm1hcCgodmFsKSA9PiBmaXJzdFt2YWxdID0gc2Vjb25kW3ZhbF0gIT09IHVuZGVmaW5lZCA/IHNlY29uZFt2YWxdIDogZmlyc3RbdmFsXSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==