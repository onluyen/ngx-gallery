import { Component, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/platform-browser";
import * as i2 from "../ngx-gallery-helper.service";
import * as i3 from "@angular/common";
import * as i4 from "../ngx-gallery-action/ngx-gallery-action.component";
import * as i5 from "../ngx-gallery-arrows/ngx-gallery-arrows.component";
import * as i6 from "../ngx-gallery-bullets/ngx-gallery-bullets.component";
export class NgxGalleryPreviewComponent {
    sanitization;
    elementRef;
    helperService;
    renderer;
    changeDetectorRef;
    src;
    srcIndex;
    description;
    showSpinner = false;
    positionLeft = 0;
    positionTop = 0;
    zoomValue = 1;
    loading = false;
    rotateValue = 0;
    index = 0;
    images;
    descriptions;
    showDescription;
    arrows;
    arrowsAutoHide;
    swipe;
    fullscreen;
    forceFullscreen;
    closeOnClick;
    closeOnEsc;
    keyboardNavigation;
    arrowPrevIcon;
    arrowNextIcon;
    closeIcon;
    fullscreenIcon;
    spinnerIcon;
    autoPlay;
    autoPlayInterval;
    autoPlayPauseOnHover;
    infinityMove;
    zoom;
    zoomStep;
    zoomMax;
    zoomMin;
    zoomInIcon;
    zoomOutIcon;
    animation;
    actions;
    rotate;
    rotateLeftIcon;
    rotateRightIcon;
    download;
    downloadIcon;
    bullets;
    onOpen = new EventEmitter();
    onClose = new EventEmitter();
    onActiveChange = new EventEmitter();
    previewImage;
    isOpen = false;
    timer;
    initialX = 0;
    initialY = 0;
    initialLeft = 0;
    initialTop = 0;
    isMove = false;
    keyDownListener;
    constructor(sanitization, elementRef, helperService, renderer, changeDetectorRef) {
        this.sanitization = sanitization;
        this.elementRef = elementRef;
        this.helperService = helperService;
        this.renderer = renderer;
        this.changeDetectorRef = changeDetectorRef;
    }
    ngOnInit() {
        if (this.arrows && this.arrowsAutoHide) {
            this.arrows = false;
        }
    }
    ngOnChanges(changes) {
        if (changes['swipe']) {
            this.helperService.manageSwipe(this.swipe, this.elementRef, 'preview', () => this.showNext(), () => this.showPrev());
        }
    }
    ngOnDestroy() {
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }
    onMouseEnter() {
        if (this.arrowsAutoHide && !this.arrows) {
            this.arrows = true;
        }
    }
    onMouseLeave() {
        if (this.arrowsAutoHide && this.arrows) {
            this.arrows = false;
        }
    }
    onKeyDown(e) {
        if (this.isOpen) {
            if (this.keyboardNavigation) {
                if (this.isKeyboardPrev(e)) {
                    this.showPrev();
                }
                else if (this.isKeyboardNext(e)) {
                    this.showNext();
                }
            }
            if (this.closeOnEsc && this.isKeyboardEsc(e)) {
                this.close();
            }
        }
    }
    open(index) {
        this.onOpen.emit();
        this.index = index;
        this.isOpen = true;
        this.show(true);
        if (this.forceFullscreen) {
            this.manageFullscreen();
        }
        this.keyDownListener = this.renderer.listen("window", "keydown", (e) => this.onKeyDown(e));
    }
    close() {
        this.isOpen = false;
        this.closeFullscreen();
        this.onClose.emit();
        this.stopAutoPlay();
        if (this.keyDownListener) {
            this.keyDownListener();
        }
    }
    imageMouseEnter() {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.stopAutoPlay();
        }
    }
    imageMouseLeave() {
        if (this.autoPlay && this.autoPlayPauseOnHover) {
            this.startAutoPlay();
        }
    }
    startAutoPlay() {
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.timer = setTimeout(() => {
                if (!this.showNext()) {
                    this.index = -1;
                    this.showNext();
                }
            }, this.autoPlayInterval);
        }
    }
    stopAutoPlay() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }
    showAtIndex(index) {
        this.index = index;
        this.show();
    }
    showNext() {
        if (this.canShowNext()) {
            this.index++;
            if (this.index === this.images.length) {
                this.index = 0;
            }
            this.show();
            return true;
        }
        else {
            return false;
        }
    }
    showPrev() {
        if (this.canShowPrev()) {
            this.index--;
            if (this.index < 0) {
                this.index = this.images.length - 1;
            }
            this.show();
        }
    }
    canShowNext() {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index < this.images.length - 1 ? true : false;
        }
        else {
            return false;
        }
    }
    canShowPrev() {
        if (this.loading) {
            return false;
        }
        else if (this.images) {
            return this.infinityMove || this.index > 0 ? true : false;
        }
        else {
            return false;
        }
    }
    manageFullscreen() {
        if (this.fullscreen || this.forceFullscreen) {
            const doc = document;
            if (!doc.fullscreenElement && !doc.mozFullScreenElement
                && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                this.openFullscreen();
            }
            else {
                this.closeFullscreen();
            }
        }
    }
    getSafeUrl(image) {
        return image.substr(0, 10) === 'data:image' ?
            image : this.sanitization.bypassSecurityTrustUrl(image);
    }
    zoomIn() {
        if (this.canZoomIn()) {
            this.zoomValue += this.zoomStep;
            if (this.zoomValue > this.zoomMax) {
                this.zoomValue = this.zoomMax;
            }
        }
    }
    zoomOut() {
        if (this.canZoomOut()) {
            this.zoomValue -= this.zoomStep;
            if (this.zoomValue < this.zoomMin) {
                this.zoomValue = this.zoomMin;
            }
            if (this.zoomValue <= 1) {
                this.resetPosition();
            }
        }
    }
    rotateLeft() {
        this.rotateValue -= 90;
    }
    rotateRight() {
        this.rotateValue += 90;
    }
    getTransform() {
        return this.sanitization.bypassSecurityTrustStyle('scale(' + this.zoomValue + ') rotate(' + this.rotateValue + 'deg)');
    }
    canZoomIn() {
        return this.zoomValue < this.zoomMax ? true : false;
    }
    canZoomOut() {
        return this.zoomValue > this.zoomMin ? true : false;
    }
    canDragOnZoom() {
        return this.zoom && this.zoomValue > 1;
    }
    mouseDownHandler(e) {
        if (this.canDragOnZoom()) {
            this.initialX = this.getClientX(e);
            this.initialY = this.getClientY(e);
            this.initialLeft = this.positionLeft;
            this.initialTop = this.positionTop;
            this.isMove = true;
            e.preventDefault();
        }
    }
    mouseUpHandler(e) {
        this.isMove = false;
    }
    mouseMoveHandler(e) {
        if (this.isMove) {
            this.positionLeft = this.initialLeft + (this.getClientX(e) - this.initialX);
            this.positionTop = this.initialTop + (this.getClientY(e) - this.initialY);
        }
    }
    getClientX(e) {
        return e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;
    }
    getClientY(e) {
        return e.touches && e.touches.length ? e.touches[0].clientY : e.clientY;
    }
    resetPosition() {
        if (this.zoom) {
            this.positionLeft = 0;
            this.positionTop = 0;
        }
    }
    isKeyboardNext(e) {
        return e.keyCode === 39 ? true : false;
    }
    isKeyboardPrev(e) {
        return e.keyCode === 37 ? true : false;
    }
    isKeyboardEsc(e) {
        return e.keyCode === 27 ? true : false;
    }
    openFullscreen() {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
    }
    closeFullscreen() {
        if (this.isFullscreen()) {
            const doc = document;
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            }
            else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
            else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            }
            else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            }
        }
    }
    isFullscreen() {
        const doc = document;
        return doc.fullscreenElement || doc.webkitFullscreenElement
            || doc.mozFullScreenElement || doc.msFullscreenElement;
    }
    show(first = false) {
        this.loading = true;
        this.stopAutoPlay();
        this.onActiveChange.emit(this.index);
        if (first || !this.animation) {
            this._show();
        }
        else {
            setTimeout(() => this._show(), 600);
        }
    }
    _show() {
        this.zoomValue = 1;
        this.rotateValue = 0;
        this.resetPosition();
        this.src = this.getSafeUrl(this.images[this.index]);
        this.srcIndex = this.index;
        this.description = this.descriptions[this.index];
        this.changeDetectorRef.markForCheck();
        setTimeout(() => {
            if (this.isLoaded(this.previewImage.nativeElement)) {
                this.loading = false;
                this.startAutoPlay();
                this.changeDetectorRef.markForCheck();
            }
            else {
                setTimeout(() => {
                    if (this.loading) {
                        this.showSpinner = true;
                        this.changeDetectorRef.markForCheck();
                    }
                });
                this.previewImage.nativeElement.onload = () => {
                    this.loading = false;
                    this.showSpinner = false;
                    this.previewImage.nativeElement.onload = null;
                    this.startAutoPlay();
                    this.changeDetectorRef.markForCheck();
                };
            }
        });
    }
    isLoaded(img) {
        if (!img.complete) {
            return false;
        }
        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
            return false;
        }
        return true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryPreviewComponent, deps: [{ token: i1.DomSanitizer }, { token: i0.ElementRef }, { token: i2.NgxGalleryHelperService }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.1.3", type: NgxGalleryPreviewComponent, selector: "ngx-gallery-preview", inputs: { images: "images", descriptions: "descriptions", showDescription: "showDescription", arrows: "arrows", arrowsAutoHide: "arrowsAutoHide", swipe: "swipe", fullscreen: "fullscreen", forceFullscreen: "forceFullscreen", closeOnClick: "closeOnClick", closeOnEsc: "closeOnEsc", keyboardNavigation: "keyboardNavigation", arrowPrevIcon: "arrowPrevIcon", arrowNextIcon: "arrowNextIcon", closeIcon: "closeIcon", fullscreenIcon: "fullscreenIcon", spinnerIcon: "spinnerIcon", autoPlay: "autoPlay", autoPlayInterval: "autoPlayInterval", autoPlayPauseOnHover: "autoPlayPauseOnHover", infinityMove: "infinityMove", zoom: "zoom", zoomStep: "zoomStep", zoomMax: "zoomMax", zoomMin: "zoomMin", zoomInIcon: "zoomInIcon", zoomOutIcon: "zoomOutIcon", animation: "animation", actions: "actions", rotate: "rotate", rotateLeftIcon: "rotateLeftIcon", rotateRightIcon: "rotateRightIcon", download: "download", downloadIcon: "downloadIcon", bullets: "bullets" }, outputs: { onOpen: "onOpen", onClose: "onClose", onActiveChange: "onActiveChange" }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" } }, viewQueries: [{ propertyName: "previewImage", first: true, predicate: ["previewImage"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<ngx-gallery-arrows *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\r\n<div class=\"ngx-gallery-preview-top\">\r\n    <div class=\"ngx-gallery-preview-icons\">\r\n        <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, index)\"></ngx-gallery-action>\r\n        <a *ngIf=\"download && src\" [href]=\"src\" class=\"ngx-gallery-icon\" aria-hidden=\"true\" download>\r\n            <i class=\"ngx-gallery-icon-content {{ downloadIcon }}\"></i>\r\n        </a>\r\n        <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomOutIcon\" [disabled]=\"!canZoomOut()\" (onClick)=\"zoomOut()\"></ngx-gallery-action>\r\n        <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomInIcon\" [disabled]=\"!canZoomIn()\" (onClick)=\"zoomIn()\"></ngx-gallery-action>\r\n        <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateLeftIcon\" (onClick)=\"rotateLeft()\"></ngx-gallery-action>\r\n        <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateRightIcon\" (onClick)=\"rotateRight()\"></ngx-gallery-action>\r\n        <ngx-gallery-action *ngIf=\"fullscreen\" [icon]=\"'ngx-gallery-fullscreen ' + fullscreenIcon\" (onClick)=\"manageFullscreen()\"></ngx-gallery-action>\r\n        <ngx-gallery-action [icon]=\"'ngx-gallery-close ' + closeIcon\" (onClick)=\"close()\"></ngx-gallery-action>\r\n    </div>\r\n</div>\r\n<div class=\"ngx-spinner-wrapper ngx-gallery-center\" [class.ngx-gallery-active]=\"showSpinner\">\r\n    <i class=\"ngx-gallery-icon ngx-gallery-spinner {{spinnerIcon}}\" aria-hidden=\"true\"></i>\r\n</div>\r\n<div class=\"ngx-gallery-preview-wrapper\" (click)=\"closeOnClick && close()\" (mouseup)=\"mouseUpHandler($event)\" (mousemove)=\"mouseMoveHandler($event)\" (touchend)=\"mouseUpHandler($event)\" (touchmove)=\"mouseMoveHandler($event)\">\r\n    <div class=\"ngx-gallery-preview-img-wrapper\">\r\n        <img *ngIf=\"src\" #previewImage class=\"ngx-gallery-preview-img ngx-gallery-center\" [src]=\"src\" (click)=\"$event.stopPropagation()\" (mouseenter)=\"imageMouseEnter()\" (mouseleave)=\"imageMouseLeave()\" (mousedown)=\"mouseDownHandler($event)\" (touchstart)=\"mouseDownHandler($event)\" [class.ngx-gallery-active]=\"!loading\" [class.animation]=\"animation\" [class.ngx-gallery-grab]=\"canDragOnZoom()\" [style.transform]=\"getTransform()\" [style.left]=\"positionLeft + 'px'\" [style.top]=\"positionTop + 'px'\"/>\r\n        <ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"index\" (onChange)=\"showAtIndex($event)\"></ngx-gallery-bullets>\r\n    </div>\r\n    <div class=\"ngx-gallery-preview-text\" *ngIf=\"showDescription && description\" [innerHTML]=\"description\" (click)=\"$event.stopPropagation()\"></div>\r\n</div>", styles: [":host(.ngx-gallery-active){width:100%;height:100%;position:fixed;left:0;top:0;background:#000000b3;z-index:10000;display:inline-block}:host{display:none}:host ::ng-deep .ngx-gallery-arrow{font-size:50px}:host ::ng-deep ngx-gallery-bullets{height:5%;align-items:center;padding:0}.ngx-gallery-preview-img{opacity:0;max-width:90%;max-height:90%;-webkit-user-select:none;user-select:none;transition:transform .5s}.ngx-gallery-preview-img.animation{transition:opacity .5s linear,transform .5s}.ngx-gallery-preview-img.ngx-gallery-active{opacity:1}.ngx-gallery-preview-img.ngx-gallery-grab{cursor:grab;cursor:-webkit-grab}.ngx-gallery-icon.ngx-gallery-spinner{font-size:50px;left:0;display:inline-block}:host ::ng-deep .ngx-gallery-preview-top{position:absolute;width:100%;-webkit-user-select:none;user-select:none}:host ::ng-deep .ngx-gallery-preview-icons{float:right}:host ::ng-deep .ngx-gallery-preview-icons .ngx-gallery-icon{position:relative;margin-right:10px;margin-top:10px;font-size:25px;cursor:pointer;text-decoration:none}:host ::ng-deep .ngx-gallery-preview-icons .ngx-gallery-icon.ngx-gallery-icon-disabled{cursor:default;opacity:.4}.ngx-spinner-wrapper{width:50px;height:50px;display:none}.ngx-spinner-wrapper.ngx-gallery-active{display:inline-block}.ngx-gallery-center{position:absolute;inset:0;margin:auto}.ngx-gallery-preview-text{width:100%;background:#000000b3;padding:10px;text-align:center;color:#fff;font-size:16px;flex:0 1 auto;z-index:10}.ngx-gallery-preview-wrapper{width:100%;height:100%;display:flex;flex-flow:column}.ngx-gallery-preview-img-wrapper{flex:1 1 auto;position:relative}\n"], dependencies: [{ kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.NgxGalleryActionComponent, selector: "ngx-gallery-action", inputs: ["icon", "disabled", "titleText"], outputs: ["onClick"] }, { kind: "component", type: i5.NgxGalleryArrowsComponent, selector: "ngx-gallery-arrows", inputs: ["prevDisabled", "nextDisabled", "arrowPrevIcon", "arrowNextIcon"], outputs: ["onPrevClick", "onNextClick"] }, { kind: "component", type: i6.NgxGalleryBulletsComponent, selector: "ngx-gallery-bullets", inputs: ["count", "active"], outputs: ["onChange"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryPreviewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gallery-preview', template: "<ngx-gallery-arrows *ngIf=\"arrows\" (onPrevClick)=\"showPrev()\" (onNextClick)=\"showNext()\" [prevDisabled]=\"!canShowPrev()\" [nextDisabled]=\"!canShowNext()\" [arrowPrevIcon]=\"arrowPrevIcon\" [arrowNextIcon]=\"arrowNextIcon\"></ngx-gallery-arrows>\r\n<div class=\"ngx-gallery-preview-top\">\r\n    <div class=\"ngx-gallery-preview-icons\">\r\n        <ngx-gallery-action *ngFor=\"let action of actions\" [icon]=\"action.icon\" [disabled]=\"action.disabled\" [titleText]=\"action.titleText\" (onClick)=\"action.onClick($event, index)\"></ngx-gallery-action>\r\n        <a *ngIf=\"download && src\" [href]=\"src\" class=\"ngx-gallery-icon\" aria-hidden=\"true\" download>\r\n            <i class=\"ngx-gallery-icon-content {{ downloadIcon }}\"></i>\r\n        </a>\r\n        <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomOutIcon\" [disabled]=\"!canZoomOut()\" (onClick)=\"zoomOut()\"></ngx-gallery-action>\r\n        <ngx-gallery-action *ngIf=\"zoom\" [icon]=\"zoomInIcon\" [disabled]=\"!canZoomIn()\" (onClick)=\"zoomIn()\"></ngx-gallery-action>\r\n        <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateLeftIcon\" (onClick)=\"rotateLeft()\"></ngx-gallery-action>\r\n        <ngx-gallery-action *ngIf=\"rotate\" [icon]=\"rotateRightIcon\" (onClick)=\"rotateRight()\"></ngx-gallery-action>\r\n        <ngx-gallery-action *ngIf=\"fullscreen\" [icon]=\"'ngx-gallery-fullscreen ' + fullscreenIcon\" (onClick)=\"manageFullscreen()\"></ngx-gallery-action>\r\n        <ngx-gallery-action [icon]=\"'ngx-gallery-close ' + closeIcon\" (onClick)=\"close()\"></ngx-gallery-action>\r\n    </div>\r\n</div>\r\n<div class=\"ngx-spinner-wrapper ngx-gallery-center\" [class.ngx-gallery-active]=\"showSpinner\">\r\n    <i class=\"ngx-gallery-icon ngx-gallery-spinner {{spinnerIcon}}\" aria-hidden=\"true\"></i>\r\n</div>\r\n<div class=\"ngx-gallery-preview-wrapper\" (click)=\"closeOnClick && close()\" (mouseup)=\"mouseUpHandler($event)\" (mousemove)=\"mouseMoveHandler($event)\" (touchend)=\"mouseUpHandler($event)\" (touchmove)=\"mouseMoveHandler($event)\">\r\n    <div class=\"ngx-gallery-preview-img-wrapper\">\r\n        <img *ngIf=\"src\" #previewImage class=\"ngx-gallery-preview-img ngx-gallery-center\" [src]=\"src\" (click)=\"$event.stopPropagation()\" (mouseenter)=\"imageMouseEnter()\" (mouseleave)=\"imageMouseLeave()\" (mousedown)=\"mouseDownHandler($event)\" (touchstart)=\"mouseDownHandler($event)\" [class.ngx-gallery-active]=\"!loading\" [class.animation]=\"animation\" [class.ngx-gallery-grab]=\"canDragOnZoom()\" [style.transform]=\"getTransform()\" [style.left]=\"positionLeft + 'px'\" [style.top]=\"positionTop + 'px'\"/>\r\n        <ngx-gallery-bullets *ngIf=\"bullets\" [count]=\"images.length\" [active]=\"index\" (onChange)=\"showAtIndex($event)\"></ngx-gallery-bullets>\r\n    </div>\r\n    <div class=\"ngx-gallery-preview-text\" *ngIf=\"showDescription && description\" [innerHTML]=\"description\" (click)=\"$event.stopPropagation()\"></div>\r\n</div>", styles: [":host(.ngx-gallery-active){width:100%;height:100%;position:fixed;left:0;top:0;background:#000000b3;z-index:10000;display:inline-block}:host{display:none}:host ::ng-deep .ngx-gallery-arrow{font-size:50px}:host ::ng-deep ngx-gallery-bullets{height:5%;align-items:center;padding:0}.ngx-gallery-preview-img{opacity:0;max-width:90%;max-height:90%;-webkit-user-select:none;user-select:none;transition:transform .5s}.ngx-gallery-preview-img.animation{transition:opacity .5s linear,transform .5s}.ngx-gallery-preview-img.ngx-gallery-active{opacity:1}.ngx-gallery-preview-img.ngx-gallery-grab{cursor:grab;cursor:-webkit-grab}.ngx-gallery-icon.ngx-gallery-spinner{font-size:50px;left:0;display:inline-block}:host ::ng-deep .ngx-gallery-preview-top{position:absolute;width:100%;-webkit-user-select:none;user-select:none}:host ::ng-deep .ngx-gallery-preview-icons{float:right}:host ::ng-deep .ngx-gallery-preview-icons .ngx-gallery-icon{position:relative;margin-right:10px;margin-top:10px;font-size:25px;cursor:pointer;text-decoration:none}:host ::ng-deep .ngx-gallery-preview-icons .ngx-gallery-icon.ngx-gallery-icon-disabled{cursor:default;opacity:.4}.ngx-spinner-wrapper{width:50px;height:50px;display:none}.ngx-spinner-wrapper.ngx-gallery-active{display:inline-block}.ngx-gallery-center{position:absolute;inset:0;margin:auto}.ngx-gallery-preview-text{width:100%;background:#000000b3;padding:10px;text-align:center;color:#fff;font-size:16px;flex:0 1 auto;z-index:10}.ngx-gallery-preview-wrapper{width:100%;height:100%;display:flex;flex-flow:column}.ngx-gallery-preview-img-wrapper{flex:1 1 auto;position:relative}\n"] }]
        }], ctorParameters: () => [{ type: i1.DomSanitizer }, { type: i0.ElementRef }, { type: i2.NgxGalleryHelperService }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }], propDecorators: { images: [{
                type: Input
            }], descriptions: [{
                type: Input
            }], showDescription: [{
                type: Input
            }], arrows: [{
                type: Input
            }], arrowsAutoHide: [{
                type: Input
            }], swipe: [{
                type: Input
            }], fullscreen: [{
                type: Input
            }], forceFullscreen: [{
                type: Input
            }], closeOnClick: [{
                type: Input
            }], closeOnEsc: [{
                type: Input
            }], keyboardNavigation: [{
                type: Input
            }], arrowPrevIcon: [{
                type: Input
            }], arrowNextIcon: [{
                type: Input
            }], closeIcon: [{
                type: Input
            }], fullscreenIcon: [{
                type: Input
            }], spinnerIcon: [{
                type: Input
            }], autoPlay: [{
                type: Input
            }], autoPlayInterval: [{
                type: Input
            }], autoPlayPauseOnHover: [{
                type: Input
            }], infinityMove: [{
                type: Input
            }], zoom: [{
                type: Input
            }], zoomStep: [{
                type: Input
            }], zoomMax: [{
                type: Input
            }], zoomMin: [{
                type: Input
            }], zoomInIcon: [{
                type: Input
            }], zoomOutIcon: [{
                type: Input
            }], animation: [{
                type: Input
            }], actions: [{
                type: Input
            }], rotate: [{
                type: Input
            }], rotateLeftIcon: [{
                type: Input
            }], rotateRightIcon: [{
                type: Input
            }], download: [{
                type: Input
            }], downloadIcon: [{
                type: Input
            }], bullets: [{
                type: Input
            }], onOpen: [{
                type: Output
            }], onClose: [{
                type: Output
            }], onActiveChange: [{
                type: Output
            }], previewImage: [{
                type: ViewChild,
                args: ['previewImage']
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LXByZXZpZXcvbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LXByZXZpZXcvbmd4LWdhbGxlcnktcHJldmlldy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBYSxNQUFNLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBZ0QsWUFBWSxFQUFhLE1BQU0sZUFBZSxDQUFDOzs7Ozs7OztBQVU1SyxNQUFNLE9BQU8sMEJBQTBCO0lBZ0VqQjtJQUFvQztJQUM1QztJQUFnRDtJQUNoRDtJQWhFWixHQUFHLENBQVU7SUFDYixRQUFRLENBQVM7SUFDakIsV0FBVyxDQUFTO0lBQ3BCLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDcEIsWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNqQixXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDZCxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ2hCLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDaEIsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUVELE1BQU0sQ0FBK0I7SUFDckMsWUFBWSxDQUFXO0lBQ3ZCLGVBQWUsQ0FBVTtJQUN6QixNQUFNLENBQVU7SUFDaEIsY0FBYyxDQUFVO0lBQ3hCLEtBQUssQ0FBVTtJQUNmLFVBQVUsQ0FBVTtJQUNwQixlQUFlLENBQVU7SUFDekIsWUFBWSxDQUFVO0lBQ3RCLFVBQVUsQ0FBVTtJQUNwQixrQkFBa0IsQ0FBVTtJQUM1QixhQUFhLENBQVM7SUFDdEIsYUFBYSxDQUFTO0lBQ3RCLFNBQVMs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QVc7c0JBQW5CLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csb0JBQW9CO3NCQUE1QixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ0csSUFBSTtzQkFBWixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUVJLE1BQU07c0JBQWYsTUFBTTtnQkFDRyxPQUFPO3NCQUFoQixNQUFNO2dCQUNHLGNBQWM7c0JBQXZCLE1BQU07Z0JBRW9CLFlBQVk7c0JBQXRDLFNBQVM7dUJBQUMsY0FBYztnQkFtQ0csWUFBWTtzQkFBdkMsWUFBWTt1QkFBQyxZQUFZO2dCQU1FLFlBQVk7c0JBQXZDLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBJbnB1dCwgT25DaGFuZ2VzLCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBDaGFuZ2VEZXRlY3RvclJlZiwgU2ltcGxlQ2hhbmdlcywgSG9zdExpc3RlbmVyLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsLCBTYWZlVXJsLCBEb21TYW5pdGl6ZXIsIFNhZmVTdHlsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5pbXBvcnQgeyBOZ3hHYWxsZXJ5QWN0aW9uIH0gZnJvbSAnLi4vbmd4LWdhbGxlcnktYWN0aW9uLm1vZGVsJztcclxuaW1wb3J0IHsgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2UgfSBmcm9tICcuLi9uZ3gtZ2FsbGVyeS1oZWxwZXIuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1nYWxsZXJ5LXByZXZpZXcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZ2FsbGVyeS1wcmV2aWV3LmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlQcmV2aWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG5cclxuICBzcmM6IFNhZmVVcmw7XHJcbiAgc3JjSW5kZXg6IG51bWJlcjtcclxuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xyXG4gIHNob3dTcGlubmVyID0gZmFsc2U7XHJcbiAgcG9zaXRpb25MZWZ0ID0gMDtcclxuICBwb3NpdGlvblRvcCA9IDA7XHJcbiAgem9vbVZhbHVlID0gMTtcclxuICBsb2FkaW5nID0gZmFsc2U7XHJcbiAgcm90YXRlVmFsdWUgPSAwO1xyXG4gIGluZGV4ID0gMDtcclxuXHJcbiAgQElucHV0KCkgaW1hZ2VzOiBzdHJpbmdbXSB8IFNhZmVSZXNvdXJjZVVybFtdO1xyXG4gIEBJbnB1dCgpIGRlc2NyaXB0aW9uczogc3RyaW5nW107XHJcbiAgQElucHV0KCkgc2hvd0Rlc2NyaXB0aW9uOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGFycm93czogYm9vbGVhbjtcclxuICBASW5wdXQoKSBhcnJvd3NBdXRvSGlkZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSBzd2lwZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSBmdWxsc2NyZWVuOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGZvcmNlRnVsbHNjcmVlbjogYm9vbGVhbjtcclxuICBASW5wdXQoKSBjbG9zZU9uQ2xpY2s6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgY2xvc2VPbkVzYzogYm9vbGVhbjtcclxuICBASW5wdXQoKSBrZXlib2FyZE5hdmlnYXRpb246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXJyb3dQcmV2SWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGFycm93TmV4dEljb246IHN0cmluZztcclxuICBASW5wdXQoKSBjbG9zZUljb246IHN0cmluZztcclxuICBASW5wdXQoKSBmdWxsc2NyZWVuSWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHNwaW5uZXJJY29uOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgYXV0b1BsYXk6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYXV0b1BsYXlJbnRlcnZhbDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIGF1dG9QbGF5UGF1c2VPbkhvdmVyOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGluZmluaXR5TW92ZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSB6b29tOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHpvb21TdGVwOiBudW1iZXI7XHJcbiAgQElucHV0KCkgem9vbU1heDogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHpvb21NaW46IG51bWJlcjtcclxuICBASW5wdXQoKSB6b29tSW5JY29uOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgem9vbU91dEljb246IHN0cmluZztcclxuICBASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XHJcbiAgQElucHV0KCkgYWN0aW9uczogTmd4R2FsbGVyeUFjdGlvbltdO1xyXG4gIEBJbnB1dCgpIHJvdGF0ZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSByb3RhdGVMZWZ0SWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHJvdGF0ZVJpZ2h0SWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGRvd25sb2FkOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIGRvd25sb2FkSWNvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGJ1bGxldHM6IHN0cmluZyB8IGFueTtcclxuXHJcbiAgQE91dHB1dCgpIG9uT3BlbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgb25DbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgb25BY3RpdmVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcclxuXHJcbiAgQFZpZXdDaGlsZCgncHJldmlld0ltYWdlJykgcHJldmlld0ltYWdlOiBFbGVtZW50UmVmO1xyXG5cclxuICBwcml2YXRlIGlzT3BlbiA9IGZhbHNlO1xyXG4gIHByaXZhdGUgdGltZXI7XHJcbiAgcHJpdmF0ZSBpbml0aWFsWCA9IDA7XHJcbiAgcHJpdmF0ZSBpbml0aWFsWSA9IDA7XHJcbiAgcHJpdmF0ZSBpbml0aWFsTGVmdCA9IDA7XHJcbiAgcHJpdmF0ZSBpbml0aWFsVG9wID0gMDtcclxuICBwcml2YXRlIGlzTW92ZSA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIGtleURvd25MaXN0ZW5lcjogRnVuY3Rpb247XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemF0aW9uOiBEb21TYW5pdGl6ZXIsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcclxuICAgICAgcHJpdmF0ZSBoZWxwZXJTZXJ2aWNlOiBOZ3hHYWxsZXJ5SGVscGVyU2VydmljZSwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxyXG4gICAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge31cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmFycm93cyAmJiB0aGlzLmFycm93c0F1dG9IaWRlKSB7XHJcbiAgICAgICAgICB0aGlzLmFycm93cyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICAgIGlmIChjaGFuZ2VzWydzd2lwZSddKSB7XHJcbiAgICAgICAgICB0aGlzLmhlbHBlclNlcnZpY2UubWFuYWdlU3dpcGUodGhpcy5zd2lwZSwgdGhpcy5lbGVtZW50UmVmLFxyXG4gICAgICAgICAgJ3ByZXZpZXcnLCAoKSA9PiB0aGlzLnNob3dOZXh0KCksICgpID0+IHRoaXMuc2hvd1ByZXYoKSk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCkge1xyXG4gICAgICBpZiAodGhpcy5rZXlEb3duTGlzdGVuZXIpIHtcclxuICAgICAgICAgIHRoaXMua2V5RG93bkxpc3RlbmVyKCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKSBvbk1vdXNlRW50ZXIoKSB7XHJcbiAgICAgIGlmICh0aGlzLmFycm93c0F1dG9IaWRlICYmICF0aGlzLmFycm93cykge1xyXG4gICAgICAgICAgdGhpcy5hcnJvd3MgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJykgb25Nb3VzZUxlYXZlKCkge1xyXG4gICAgICBpZiAodGhpcy5hcnJvd3NBdXRvSGlkZSAmJiB0aGlzLmFycm93cykge1xyXG4gICAgICAgICAgdGhpcy5hcnJvd3MgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgb25LZXlEb3duKGUpIHtcclxuICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5rZXlib2FyZE5hdmlnYXRpb24pIHtcclxuICAgICAgICAgICAgICBpZiAodGhpcy5pc0tleWJvYXJkUHJldihlKSkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnNob3dQcmV2KCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzS2V5Ym9hcmROZXh0KGUpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodGhpcy5jbG9zZU9uRXNjICYmIHRoaXMuaXNLZXlib2FyZEVzYyhlKSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgb3BlbihpbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMub25PcGVuLmVtaXQoKTtcclxuXHJcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xyXG4gICAgICB0aGlzLnNob3codHJ1ZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy5mb3JjZUZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgIHRoaXMubWFuYWdlRnVsbHNjcmVlbigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmtleURvd25MaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFwid2luZG93XCIsIFwia2V5ZG93blwiLCAoZSkgPT4gdGhpcy5vbktleURvd24oZSkpO1xyXG4gIH1cclxuXHJcbiAgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuY2xvc2VGdWxsc2NyZWVuKCk7XHJcbiAgICAgIHRoaXMub25DbG9zZS5lbWl0KCk7XHJcblxyXG4gICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xyXG5cclxuICAgICAgaWYgKHRoaXMua2V5RG93bkxpc3RlbmVyKSB7XHJcbiAgICAgICAgICB0aGlzLmtleURvd25MaXN0ZW5lcigpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBpbWFnZU1vdXNlRW50ZXIoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmF1dG9QbGF5ICYmIHRoaXMuYXV0b1BsYXlQYXVzZU9uSG92ZXIpIHtcclxuICAgICAgICAgIHRoaXMuc3RvcEF1dG9QbGF5KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGltYWdlTW91c2VMZWF2ZSgpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuYXV0b1BsYXkgJiYgdGhpcy5hdXRvUGxheVBhdXNlT25Ib3Zlcikge1xyXG4gICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXJ0QXV0b1BsYXkoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmF1dG9QbGF5KSB7XHJcbiAgICAgICAgICB0aGlzLnN0b3BBdXRvUGxheSgpO1xyXG5cclxuICAgICAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoIXRoaXMuc2hvd05leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd05leHQoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCB0aGlzLmF1dG9QbGF5SW50ZXJ2YWwpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBzdG9wQXV0b1BsYXkoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVyKSB7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dBdEluZGV4KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICB0aGlzLnNob3coKTtcclxuICB9XHJcblxyXG4gIHNob3dOZXh0KCk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAodGhpcy5jYW5TaG93TmV4dCgpKSB7XHJcbiAgICAgICAgICB0aGlzLmluZGV4Kys7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW5kZXggPT09IHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaW5kZXggPSAwO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHNob3dQcmV2KCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5jYW5TaG93UHJldigpKSB7XHJcbiAgICAgICAgICB0aGlzLmluZGV4LS07XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGNhblNob3dOZXh0KCk6IGJvb2xlYW4ge1xyXG4gICAgICBpZiAodGhpcy5sb2FkaW5nKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pbWFnZXMpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmluZmluaXR5TW92ZSB8fCB0aGlzLmluZGV4IDwgdGhpcy5pbWFnZXMubGVuZ3RoIC0gMSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgY2FuU2hvd1ByZXYoKTogYm9vbGVhbiB7XHJcbiAgICAgIGlmICh0aGlzLmxvYWRpbmcpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmltYWdlcykge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaW5maW5pdHlNb3ZlIHx8IHRoaXMuaW5kZXggPiAwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBtYW5hZ2VGdWxsc2NyZWVuKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5mdWxsc2NyZWVuIHx8IHRoaXMuZm9yY2VGdWxsc2NyZWVuKSB7XHJcbiAgICAgICAgICBjb25zdCBkb2MgPSA8YW55PmRvY3VtZW50O1xyXG5cclxuICAgICAgICAgIGlmICghZG9jLmZ1bGxzY3JlZW5FbGVtZW50ICYmICFkb2MubW96RnVsbFNjcmVlbkVsZW1lbnRcclxuICAgICAgICAgICAgICAmJiAhZG9jLndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50ICYmICFkb2MubXNGdWxsc2NyZWVuRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgIHRoaXMub3BlbkZ1bGxzY3JlZW4oKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jbG9zZUZ1bGxzY3JlZW4oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0U2FmZVVybChpbWFnZTogc3RyaW5nKTogU2FmZVVybCB7XHJcbiAgICAgIHJldHVybiBpbWFnZS5zdWJzdHIoMCwgMTApID09PSAnZGF0YTppbWFnZScgP1xyXG4gICAgICAgICAgaW1hZ2UgOiB0aGlzLnNhbml0aXphdGlvbi5ieXBhc3NTZWN1cml0eVRydXN0VXJsKGltYWdlKTtcclxuICB9XHJcblxyXG4gIHpvb21JbigpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuY2FuWm9vbUluKCkpIHtcclxuICAgICAgICAgIHRoaXMuem9vbVZhbHVlICs9IHRoaXMuem9vbVN0ZXA7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuem9vbVZhbHVlID4gdGhpcy56b29tTWF4KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy56b29tVmFsdWUgPSB0aGlzLnpvb21NYXg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHpvb21PdXQoKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmNhblpvb21PdXQoKSkge1xyXG4gICAgICAgICAgdGhpcy56b29tVmFsdWUgLT0gdGhpcy56b29tU3RlcDtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy56b29tVmFsdWUgPCB0aGlzLnpvb21NaW4pIHtcclxuICAgICAgICAgICAgICB0aGlzLnpvb21WYWx1ZSA9IHRoaXMuem9vbU1pbjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAodGhpcy56b29tVmFsdWUgPD0gMSkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVzZXRQb3NpdGlvbigpXHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHJvdGF0ZUxlZnQoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucm90YXRlVmFsdWUgLT0gOTA7XHJcbiAgfVxyXG5cclxuICByb3RhdGVSaWdodCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5yb3RhdGVWYWx1ZSArPSA5MDtcclxuICB9XHJcblxyXG4gIGdldFRyYW5zZm9ybSgpOiBTYWZlU3R5bGUge1xyXG4gICAgICByZXR1cm4gdGhpcy5zYW5pdGl6YXRpb24uYnlwYXNzU2VjdXJpdHlUcnVzdFN0eWxlKCdzY2FsZSgnICsgdGhpcy56b29tVmFsdWUgKyAnKSByb3RhdGUoJyArIHRoaXMucm90YXRlVmFsdWUgKyAnZGVnKScpO1xyXG4gIH1cclxuXHJcbiAgY2FuWm9vbUluKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy56b29tVmFsdWUgPCB0aGlzLnpvb21NYXggPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjYW5ab29tT3V0KCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy56b29tVmFsdWUgPiB0aGlzLnpvb21NaW4gPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICBjYW5EcmFnT25ab29tKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy56b29tICYmIHRoaXMuem9vbVZhbHVlID4gMTtcclxuICB9XHJcblxyXG4gIG1vdXNlRG93bkhhbmRsZXIoZSk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5jYW5EcmFnT25ab29tKCkpIHtcclxuICAgICAgICAgIHRoaXMuaW5pdGlhbFggPSB0aGlzLmdldENsaWVudFgoZSk7XHJcbiAgICAgICAgICB0aGlzLmluaXRpYWxZID0gdGhpcy5nZXRDbGllbnRZKGUpO1xyXG4gICAgICAgICAgdGhpcy5pbml0aWFsTGVmdCA9IHRoaXMucG9zaXRpb25MZWZ0O1xyXG4gICAgICAgICAgdGhpcy5pbml0aWFsVG9wID0gdGhpcy5wb3NpdGlvblRvcDtcclxuICAgICAgICAgIHRoaXMuaXNNb3ZlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIG1vdXNlVXBIYW5kbGVyKGUpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pc01vdmUgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIG1vdXNlTW92ZUhhbmRsZXIoZSkge1xyXG4gICAgICBpZiAodGhpcy5pc01vdmUpIHtcclxuICAgICAgICAgIHRoaXMucG9zaXRpb25MZWZ0ID0gdGhpcy5pbml0aWFsTGVmdCArICh0aGlzLmdldENsaWVudFgoZSkgLSB0aGlzLmluaXRpYWxYKTtcclxuICAgICAgICAgIHRoaXMucG9zaXRpb25Ub3AgPSB0aGlzLmluaXRpYWxUb3AgKyAodGhpcy5nZXRDbGllbnRZKGUpIC0gdGhpcy5pbml0aWFsWSk7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Q2xpZW50WChlKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIGUudG91Y2hlcyAmJiBlLnRvdWNoZXMubGVuZ3RoID8gZS50b3VjaGVzWzBdLmNsaWVudFggOiBlLmNsaWVudFg7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldENsaWVudFkoZSk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA/IGUudG91Y2hlc1swXS5jbGllbnRZIDogZS5jbGllbnRZO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZXNldFBvc2l0aW9uKCkge1xyXG4gICAgICBpZiAodGhpcy56b29tKSB7XHJcbiAgICAgICAgICB0aGlzLnBvc2l0aW9uTGVmdCA9IDA7XHJcbiAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9wID0gMDtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0tleWJvYXJkTmV4dChlKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM5ID8gdHJ1ZSA6IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0tleWJvYXJkUHJldihlKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBlLmtleUNvZGUgPT09IDM3ID8gdHJ1ZSA6IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0tleWJvYXJkRXNjKGUpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIGUua2V5Q29kZSA9PT0gMjcgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9wZW5GdWxsc2NyZWVuKCk6IHZvaWQge1xyXG4gICAgICBjb25zdCBlbGVtZW50ID0gPGFueT5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblxyXG4gICAgICBpZiAoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xyXG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgIGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjbG9zZUZ1bGxzY3JlZW4oKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmlzRnVsbHNjcmVlbigpKSB7XHJcbiAgICAgICAgICBjb25zdCBkb2MgPSA8YW55PmRvY3VtZW50O1xyXG5cclxuICAgICAgICAgIGlmIChkb2MuZXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgICBkb2MuZXhpdEZ1bGxzY3JlZW4oKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZG9jLm1zRXhpdEZ1bGxzY3JlZW4pIHtcclxuICAgICAgICAgICAgICBkb2MubXNFeGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChkb2MubW96Q2FuY2VsRnVsbFNjcmVlbikge1xyXG4gICAgICAgICAgICAgIGRvYy5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGRvYy53ZWJraXRFeGl0RnVsbHNjcmVlbikge1xyXG4gICAgICAgICAgICAgIGRvYy53ZWJraXRFeGl0RnVsbHNjcmVlbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzRnVsbHNjcmVlbigpIHtcclxuICAgICAgY29uc3QgZG9jID0gPGFueT5kb2N1bWVudDtcclxuXHJcbiAgICAgIHJldHVybiBkb2MuZnVsbHNjcmVlbkVsZW1lbnQgfHwgZG9jLndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50XHJcbiAgICAgICAgICB8fCBkb2MubW96RnVsbFNjcmVlbkVsZW1lbnQgfHwgZG9jLm1zRnVsbHNjcmVlbkVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIHByaXZhdGUgc2hvdyhmaXJzdCA9IGZhbHNlKSB7XHJcbiAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMuc3RvcEF1dG9QbGF5KCk7XHJcblxyXG4gICAgICB0aGlzLm9uQWN0aXZlQ2hhbmdlLmVtaXQodGhpcy5pbmRleCk7XHJcblxyXG4gICAgICBpZiAoZmlyc3QgfHwgIXRoaXMuYW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICB0aGlzLl9zaG93KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX3Nob3coKSwgNjAwKTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfc2hvdygpIHtcclxuICAgICAgdGhpcy56b29tVmFsdWUgPSAxO1xyXG4gICAgICB0aGlzLnJvdGF0ZVZhbHVlID0gMDtcclxuICAgICAgdGhpcy5yZXNldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICB0aGlzLnNyYyA9IHRoaXMuZ2V0U2FmZVVybCg8c3RyaW5nPnRoaXMuaW1hZ2VzW3RoaXMuaW5kZXhdKTtcclxuICAgICAgdGhpcy5zcmNJbmRleCA9IHRoaXMuaW5kZXg7XHJcbiAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaXB0aW9uc1t0aGlzLmluZGV4XTtcclxuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQodGhpcy5wcmV2aWV3SW1hZ2UubmF0aXZlRWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICB0aGlzLnN0YXJ0QXV0b1BsYXkoKTtcclxuICAgICAgICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubG9hZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93U3Bpbm5lciA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5wcmV2aWV3SW1hZ2UubmF0aXZlRWxlbWVudC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLnNob3dTcGlubmVyID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJldmlld0ltYWdlLm5hdGl2ZUVsZW1lbnQub25sb2FkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydEF1dG9QbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0xvYWRlZChpbWcpOiBib29sZWFuIHtcclxuICAgICAgaWYgKCFpbWcuY29tcGxldGUpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiBpbWcubmF0dXJhbFdpZHRoICE9PSAndW5kZWZpbmVkJyAmJiBpbWcubmF0dXJhbFdpZHRoID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbn0iLCI8bmd4LWdhbGxlcnktYXJyb3dzICpuZ0lmPVwiYXJyb3dzXCIgKG9uUHJldkNsaWNrKT1cInNob3dQcmV2KClcIiAob25OZXh0Q2xpY2spPVwic2hvd05leHQoKVwiIFtwcmV2RGlzYWJsZWRdPVwiIWNhblNob3dQcmV2KClcIiBbbmV4dERpc2FibGVkXT1cIiFjYW5TaG93TmV4dCgpXCIgW2Fycm93UHJldkljb25dPVwiYXJyb3dQcmV2SWNvblwiIFthcnJvd05leHRJY29uXT1cImFycm93TmV4dEljb25cIj48L25neC1nYWxsZXJ5LWFycm93cz5cclxuPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXByZXZpZXctdG9wXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktcHJldmlldy1pY29uc1wiPlxyXG4gICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nRm9yPVwibGV0IGFjdGlvbiBvZiBhY3Rpb25zXCIgW2ljb25dPVwiYWN0aW9uLmljb25cIiBbZGlzYWJsZWRdPVwiYWN0aW9uLmRpc2FibGVkXCIgW3RpdGxlVGV4dF09XCJhY3Rpb24udGl0bGVUZXh0XCIgKG9uQ2xpY2spPVwiYWN0aW9uLm9uQ2xpY2soJGV2ZW50LCBpbmRleClcIj48L25neC1nYWxsZXJ5LWFjdGlvbj5cclxuICAgICAgICA8YSAqbmdJZj1cImRvd25sb2FkICYmIHNyY1wiIFtocmVmXT1cInNyY1wiIGNsYXNzPVwibmd4LWdhbGxlcnktaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGRvd25sb2FkPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb24tY29udGVudCB7eyBkb3dubG9hZEljb24gfX1cIj48L2k+XHJcbiAgICAgICAgPC9hPlxyXG4gICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nSWY9XCJ6b29tXCIgW2ljb25dPVwiem9vbU91dEljb25cIiBbZGlzYWJsZWRdPVwiIWNhblpvb21PdXQoKVwiIChvbkNsaWNrKT1cInpvb21PdXQoKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxyXG4gICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nSWY9XCJ6b29tXCIgW2ljb25dPVwiem9vbUluSWNvblwiIFtkaXNhYmxlZF09XCIhY2FuWm9vbUluKClcIiAob25DbGljayk9XCJ6b29tSW4oKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxyXG4gICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nSWY9XCJyb3RhdGVcIiBbaWNvbl09XCJyb3RhdGVMZWZ0SWNvblwiIChvbkNsaWNrKT1cInJvdGF0ZUxlZnQoKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxyXG4gICAgICAgIDxuZ3gtZ2FsbGVyeS1hY3Rpb24gKm5nSWY9XCJyb3RhdGVcIiBbaWNvbl09XCJyb3RhdGVSaWdodEljb25cIiAob25DbGljayk9XCJyb3RhdGVSaWdodCgpXCI+PC9uZ3gtZ2FsbGVyeS1hY3Rpb24+XHJcbiAgICAgICAgPG5neC1nYWxsZXJ5LWFjdGlvbiAqbmdJZj1cImZ1bGxzY3JlZW5cIiBbaWNvbl09XCInbmd4LWdhbGxlcnktZnVsbHNjcmVlbiAnICsgZnVsbHNjcmVlbkljb25cIiAob25DbGljayk9XCJtYW5hZ2VGdWxsc2NyZWVuKClcIj48L25neC1nYWxsZXJ5LWFjdGlvbj5cclxuICAgICAgICA8bmd4LWdhbGxlcnktYWN0aW9uIFtpY29uXT1cIiduZ3gtZ2FsbGVyeS1jbG9zZSAnICsgY2xvc2VJY29uXCIgKG9uQ2xpY2spPVwiY2xvc2UoKVwiPjwvbmd4LWdhbGxlcnktYWN0aW9uPlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG48ZGl2IGNsYXNzPVwibmd4LXNwaW5uZXItd3JhcHBlciBuZ3gtZ2FsbGVyeS1jZW50ZXJcIiBbY2xhc3Mubmd4LWdhbGxlcnktYWN0aXZlXT1cInNob3dTcGlubmVyXCI+XHJcbiAgICA8aSBjbGFzcz1cIm5neC1nYWxsZXJ5LWljb24gbmd4LWdhbGxlcnktc3Bpbm5lciB7e3NwaW5uZXJJY29ufX1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbjwvZGl2PlxyXG48ZGl2IGNsYXNzPVwibmd4LWdhbGxlcnktcHJldmlldy13cmFwcGVyXCIgKGNsaWNrKT1cImNsb3NlT25DbGljayAmJiBjbG9zZSgpXCIgKG1vdXNldXApPVwibW91c2VVcEhhbmRsZXIoJGV2ZW50KVwiIChtb3VzZW1vdmUpPVwibW91c2VNb3ZlSGFuZGxlcigkZXZlbnQpXCIgKHRvdWNoZW5kKT1cIm1vdXNlVXBIYW5kbGVyKCRldmVudClcIiAodG91Y2htb3ZlKT1cIm1vdXNlTW92ZUhhbmRsZXIoJGV2ZW50KVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cIm5neC1nYWxsZXJ5LXByZXZpZXctaW1nLXdyYXBwZXJcIj5cclxuICAgICAgICA8aW1nICpuZ0lmPVwic3JjXCIgI3ByZXZpZXdJbWFnZSBjbGFzcz1cIm5neC1nYWxsZXJ5LXByZXZpZXctaW1nIG5neC1nYWxsZXJ5LWNlbnRlclwiIFtzcmNdPVwic3JjXCIgKGNsaWNrKT1cIiRldmVudC5zdG9wUHJvcGFnYXRpb24oKVwiIChtb3VzZWVudGVyKT1cImltYWdlTW91c2VFbnRlcigpXCIgKG1vdXNlbGVhdmUpPVwiaW1hZ2VNb3VzZUxlYXZlKClcIiAobW91c2Vkb3duKT1cIm1vdXNlRG93bkhhbmRsZXIoJGV2ZW50KVwiICh0b3VjaHN0YXJ0KT1cIm1vdXNlRG93bkhhbmRsZXIoJGV2ZW50KVwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1hY3RpdmVdPVwiIWxvYWRpbmdcIiBbY2xhc3MuYW5pbWF0aW9uXT1cImFuaW1hdGlvblwiIFtjbGFzcy5uZ3gtZ2FsbGVyeS1ncmFiXT1cImNhbkRyYWdPblpvb20oKVwiIFtzdHlsZS50cmFuc2Zvcm1dPVwiZ2V0VHJhbnNmb3JtKClcIiBbc3R5bGUubGVmdF09XCJwb3NpdGlvbkxlZnQgKyAncHgnXCIgW3N0eWxlLnRvcF09XCJwb3NpdGlvblRvcCArICdweCdcIi8+XHJcbiAgICAgICAgPG5neC1nYWxsZXJ5LWJ1bGxldHMgKm5nSWY9XCJidWxsZXRzXCIgW2NvdW50XT1cImltYWdlcy5sZW5ndGhcIiBbYWN0aXZlXT1cImluZGV4XCIgKG9uQ2hhbmdlKT1cInNob3dBdEluZGV4KCRldmVudClcIj48L25neC1nYWxsZXJ5LWJ1bGxldHM+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJuZ3gtZ2FsbGVyeS1wcmV2aWV3LXRleHRcIiAqbmdJZj1cInNob3dEZXNjcmlwdGlvbiAmJiBkZXNjcmlwdGlvblwiIFtpbm5lckhUTUxdPVwiZGVzY3JpcHRpb25cIiAoY2xpY2spPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCI+PC9kaXY+XHJcbjwvZGl2PiJdfQ==