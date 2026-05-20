import {
  Component,
  OnInit,
  AfterViewInit,
  EventEmitter,
  Output,
  ViewChild,
  HostBinding,
  ElementRef,
  HostListener,
  input,
  signal,
  computed,
} from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import { NgxGalleryOptions } from "../models/ngx-gallery-options";
import { NgxGalleryImage } from "../models/ngx-gallery-image.model";
import { NgxGalleryOrderedImage } from "../models/ngx-gallery-ordered-image.model";
import { NgxGalleryPreviewComponent } from "../ngx-gallery-preview/ngx-gallery-preview.component";
import { NgxGalleryImageComponent } from "../ngx-gallery-image/ngx-gallery-image.component";
import { NgxGalleryThumbnailsComponent } from "../ngx-gallery-thumbnails/ngx-gallery-thumbnails.component";
import { NgxGalleryLayout } from "../models/ngx-gallery-layout.model";

@Component({
  selector: "ngx-gallery",
  template: `
    <div class="ngx-gallery-layout {{ currentOptions()?.layout }}">
      @if (currentOptions()?.image) {
      <ngx-gallery-image
        [style.height]="getImageHeight()"
        [images]="mediumImages()"
        [clickable]="currentOptions()?.preview"
        [selectedIndex]="selectedIndex()"
        [arrows]="currentOptions()?.imageArrows"
        [arrowsAutoHide]="currentOptions()?.imageArrowsAutoHide"
        [arrowPrevIcon]="currentOptions()?.arrowPrevIcon"
        [arrowNextIcon]="currentOptions()?.arrowNextIcon"
        [swipe]="currentOptions()?.imageSwipe"
        [animation]="currentOptions()?.imageAnimation"
        [size]="currentOptions()?.imageSize"
        [autoPlay]="currentOptions()?.imageAutoPlay"
        [autoPlayInterval]="currentOptions()?.imageAutoPlayInterval"
        [autoPlayPauseOnHover]="currentOptions()?.imageAutoPlayPauseOnHover"
        [infinityMove]="currentOptions()?.imageInfinityMove"
        [lazyLoading]="currentOptions()?.lazyLoading"
        [actions]="currentOptions()?.imageActions"
        [descriptions]="descriptions()"
        [showDescription]="currentOptions()?.imageDescription"
        [bullets]="currentOptions()?.imageBullets"
        (onClick)="openPreview($event)"
        (onActiveChange)="selectFromImage($event)"
      ></ngx-gallery-image>
      } @if (currentOptions()?.thumbnails) {
      <ngx-gallery-thumbnails
        [style.marginTop]="getThumbnailsMarginTop()"
        [style.marginBottom]="getThumbnailsMarginBottom()"
        [style.height]="getThumbnailsHeight()"
        [images]="smallImages()"
        [links]="currentOptions()?.thumbnailsAsLinks ? links() : []"
        [labels]="labels()"
        [linkTarget]="currentOptions()?.linkTarget"
        [selectedIndex]="selectedIndex()"
        [columns]="currentOptions()?.thumbnailsColumns"
        [rows]="currentOptions()?.thumbnailsRows"
        [margin]="currentOptions()?.thumbnailMargin"
        [arrows]="currentOptions()?.thumbnailsArrows"
        [arrowsAutoHide]="currentOptions()?.thumbnailsArrowsAutoHide"
        [arrowPrevIcon]="currentOptions()?.arrowPrevIcon"
        [arrowNextIcon]="currentOptions()?.arrowNextIcon"
        [clickable]="currentOptions()?.image || currentOptions()?.preview"
        [swipe]="currentOptions()?.thumbnailsSwipe"
        [size]="currentOptions()?.thumbnailSize"
        [moveSize]="currentOptions()?.thumbnailsMoveSize"
        [order]="currentOptions()?.thumbnailsOrder"
        [remainingCount]="currentOptions()?.thumbnailsRemainingCount"
        [lazyLoading]="currentOptions()?.lazyLoading"
        [actions]="currentOptions()?.thumbnailActions"
        (onActiveChange)="selectFromThumbnails($event)"
      ></ngx-gallery-thumbnails>
      }

      <ngx-gallery-preview
        [images]="bigImages()"
        [descriptions]="descriptions()"
        [showDescription]="currentOptions()?.previewDescription"
        [arrowPrevIcon]="currentOptions()?.arrowPrevIcon"
        [arrowNextIcon]="currentOptions()?.arrowNextIcon"
        [closeIcon]="currentOptions()?.closeIcon"
        [fullscreenIcon]="currentOptions()?.fullscreenIcon"
        [spinnerIcon]="currentOptions()?.spinnerIcon"
        [arrows]="currentOptions()?.previewArrows"
        [arrowsAutoHide]="currentOptions()?.previewArrowsAutoHide"
        [swipe]="currentOptions()?.previewSwipe"
        [fullscreen]="currentOptions()?.previewFullscreen"
        [forceFullscreen]="currentOptions()?.previewForceFullscreen"
        [closeOnClick]="currentOptions()?.previewCloseOnClick"
        [closeOnEsc]="currentOptions()?.previewCloseOnEsc"
        [keyboardNavigation]="currentOptions()?.previewKeyboardNavigation"
        [animation]="currentOptions()?.previewAnimation"
        [autoPlay]="currentOptions()?.previewAutoPlay"
        [autoPlayInterval]="currentOptions()?.previewAutoPlayInterval"
        [autoPlayPauseOnHover]="currentOptions()?.previewAutoPlayPauseOnHover"
        [infinityMove]="currentOptions()?.previewInfinityMove"
        [zoom]="currentOptions()?.previewZoom"
        [zoomStep]="currentOptions()?.previewZoomStep"
        [zoomMax]="currentOptions()?.previewZoomMax"
        [zoomMin]="currentOptions()?.previewZoomMin"
        [zoomInIcon]="currentOptions()?.zoomInIcon"
        [zoomOutIcon]="currentOptions()?.zoomOutIcon"
        [actions]="currentOptions()?.actions"
        [rotate]="currentOptions()?.previewRotate"
        [rotateLeftIcon]="currentOptions()?.rotateLeftIcon"
        [rotateRightIcon]="currentOptions()?.rotateRightIcon"
        [download]="currentOptions()?.previewDownload"
        [downloadIcon]="currentOptions()?.downloadIcon"
        [bullets]="currentOptions()?.previewBullets"
        (onClose)="onPreviewClose()"
        (onOpen)="onPreviewOpen()"
        (onActiveChange)="previewSelect($event)"
        [class.ngx-gallery-active]="previewEnabled()"
      ></ngx-gallery-preview>
    </div>
  `,
  styleUrls: ["./ngx-gallery.component.scss"],
  standalone: true,
  imports: [
    NgxGalleryImageComponent,
    NgxGalleryThumbnailsComponent,
    NgxGalleryPreviewComponent,
  ],
})
export class NgxGalleryComponent implements OnInit, AfterViewInit {
  options = input<NgxGalleryOptions[]>();
  images = input<Array<NgxGalleryImage | string>>();

  @Output() imagesReady = new EventEmitter<void>();
  @Output() change = new EventEmitter<{
    index: number;
    image: NgxGalleryImage | string;
  }>();
  @Output() previewOpen = new EventEmitter<void>();
  @Output() previewClose = new EventEmitter<void>();
  @Output() previewChange = new EventEmitter<{
    index: number;
    image: NgxGalleryImage | string;
  }>();

  smallImages = computed<(string | SafeResourceUrl)[]>(() =>
    (this.images() || []).map((img) =>
      typeof img === "string"
        ? img
        : <string>(img.small ?? img.medium ?? img.big)
    )
  );
  mediumImages = computed<NgxGalleryOrderedImage[]>(() =>
    (this.images() || []).map(
      (img, i) =>
        new NgxGalleryOrderedImage({
          src:
            typeof img === "string"
              ? img
              : <string>(img.medium ?? img.small ?? img.big),
          index: i,
        })
    )
  );
  bigImages = computed<(string | SafeResourceUrl)[]>(() =>
    (this.images() || []).map((img) =>
      typeof img === "string"
        ? img
        : <string>(img.big ?? img.medium ?? img.small)
    )
  );
  descriptions = computed<string[]>(() =>
    (this.images() || []).map((img) =>
      typeof img === "string" ? "" : <string>img.description
    )
  );
  links = computed<string[]>(() =>
    (this.images() || []).map((img) =>
      typeof img === "string" ? "" : <string>img.url
    )
  );
  labels = computed<string[]>(() =>
    (this.images() || []).map((img) =>
      typeof img === "string" ? "" : <string>img.label
    )
  );

  selectedIndex = signal(0);
  previewEnabled = signal(false);

  currentOptions = signal<NgxGalleryOptions | undefined>(undefined);

  private breakpoint: number | undefined = undefined;
  private prevBreakpoint: number | undefined = undefined;
  private fullWidthTimeout: any;

  @ViewChild(NgxGalleryPreviewComponent) preview: NgxGalleryPreviewComponent;
  @ViewChild(NgxGalleryImageComponent) image: NgxGalleryImageComponent;
  @ViewChild(NgxGalleryThumbnailsComponent)
  thubmnails: NgxGalleryThumbnailsComponent;

  @HostBinding("style.width") width: string;
  @HostBinding("style.height") height: string;
  @HostBinding("style.left") left: string;

  constructor(private myElement: ElementRef) {}

  ngOnInit() {
    const opts = (this.options() || []).map(
      (opt) => new NgxGalleryOptions(opt)
    );
    (this as any)._optsArray = opts;
    this.sortOptions();
    this.setBreakpoint();
    this.setOptions();
    this.checkFullWidth();
    const curr = this.currentOptions();
    if (curr && curr.startIndex !== undefined) {
      this.selectedIndex.set(<number>curr.startIndex);
    }
  }

  private _imagesEffect = computed(() => {
    const imgs = this.images();
    if (imgs && imgs.length) {
      this.setOptions();
      this.imagesReady.emit();
      if (this.image) {
        const start = <number>(this.currentOptions()?.startIndex ?? 0);
        this.image.reset(start);
      }
      const curr = this.currentOptions();
      if (
        curr &&
        curr.thumbnailsAutoHide &&
        curr.thumbnails &&
        imgs.length <= 1
      ) {
        curr.thumbnails = false;
      }
      this.resetThumbnails();
    }
    return imgs?.length || 0;
  });

  ngAfterViewInit(): void {
    this.checkFullWidth();
  }

  @HostListener("window:resize") onResize() {
    this.setBreakpoint();

    if (this.prevBreakpoint !== this.breakpoint) {
      this.setOptions();
      this.resetThumbnails();
    }

    const curr = this.currentOptions();
    if (curr && curr.fullWidth) {
      if (this.fullWidthTimeout) {
        clearTimeout(this.fullWidthTimeout);
      }

      this.fullWidthTimeout = setTimeout(() => {
        this.checkFullWidth();
      }, 200);
    }
  }

  getImageHeight(): string {
    const curr = this.currentOptions();
    return curr && curr.thumbnails ? curr.imagePercent + "%" : "100%";
  }

  getThumbnailsHeight(): string {
    const curr = this.currentOptions();
    if (curr && curr.image) {
      return (
        "calc(" +
        curr.thumbnailsPercent +
        "% - " +
        curr.thumbnailsMargin +
        "px)"
      );
    } else {
      return "100%";
    }
  }

  getThumbnailsMarginTop(): string {
    const curr = this.currentOptions();
    if (curr && curr.layout === NgxGalleryLayout.ThumbnailsBottom) {
      return curr.thumbnailsMargin + "px";
    } else {
      return "0px";
    }
  }

  getThumbnailsMarginBottom(): string {
    const curr = this.currentOptions();
    if (curr && curr.layout === NgxGalleryLayout.ThumbnailsTop) {
      return curr.thumbnailsMargin + "px";
    } else {
      return "0px";
    }
  }

  openPreview(index: number): void {
    const curr = this.currentOptions();
    if (curr?.previewCustom) {
      curr.previewCustom(index);
    } else {
      this.previewEnabled.set(true);
      this.preview.open(index);
    }
  }

  onPreviewOpen(): void {
    this.previewOpen.emit();

    if (this.image && (this as any).image.autoPlay) {
      this.image.stopAutoPlay();
    }
  }

  onPreviewClose(): void {
    this.previewEnabled.set(false);
    this.previewClose.emit();

    if (this.image && (this as any).image.autoPlay) {
      this.image.startAutoPlay();
    }
  }

  selectFromImage(index: number) {
    this.select(index);
  }

  selectFromThumbnails(index: number) {
    this.select(index);

    const curr = this.currentOptions();
    if (
      curr &&
      curr.thumbnails &&
      curr.preview &&
      (!curr.image || curr.thumbnailsRemainingCount)
    ) {
      this.openPreview(this.selectedIndex());
    }
  }

  show(index: number): void {
    this.select(index);
  }

  showNext(): void {
    this.image.showNext();
  }

  showPrev(): void {
    this.image.showPrev();
  }

  canShowNext(): boolean {
    const imgs = this.images() || [];
    const curr = this.currentOptions();
    if (curr) {
      return curr.imageInfinityMove || this.selectedIndex() < imgs.length - 1
        ? true
        : false;
    } else {
      return false;
    }
  }

  canShowPrev(): boolean {
    const curr = this.currentOptions();
    if (curr) {
      return curr.imageInfinityMove || this.selectedIndex() > 0 ? true : false;
    } else {
      return false;
    }
  }

  previewSelect(index: number) {
    const imgs = this.images() || [];
    this.previewChange.emit({ index, image: imgs[index] });
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

  private resetThumbnails() {
    if (this.thubmnails) {
      const start = <number>(this.currentOptions()?.startIndex ?? 0);
      this.thubmnails.reset(start);
    }
  }

  private select(index: number) {
    this.selectedIndex.set(index);
    const imgs = this.images() || [];
    this.change.emit({ index, image: imgs[index] });
  }

  private checkFullWidth(): void {
    const curr = this.currentOptions();
    if (curr && curr.fullWidth) {
      this.width = document.body.clientWidth + "px";
      this.left =
        -(
          document.body.clientWidth -
          this.myElement.nativeElement.parentNode.innerWidth
        ) /
          2 +
        "px";
    }
  }

  private setBreakpoint(): void {
    this.prevBreakpoint = this.breakpoint;
    let breakpoints;

    if (typeof window !== "undefined") {
      const opts = (this as any)._optsArray as NgxGalleryOptions[];
      breakpoints = opts
        .filter((opt) => opt.breakpoint >= window.innerWidth)
        .map((opt) => opt.breakpoint);
    }

    if (breakpoints && breakpoints.length) {
      this.breakpoint = breakpoints.pop();
    } else {
      this.breakpoint = undefined;
    }
  }

  private sortOptions(): void {
    const opts = (this as any)._optsArray as NgxGalleryOptions[];
    (this as any)._optsArray = [
      ...opts.filter((a) => a.breakpoint === undefined),
      ...opts
        .filter((a) => a.breakpoint !== undefined)
        .sort((a, b) => b.breakpoint - a.breakpoint),
    ];
  }

  private setOptions(): void {
    const current = new NgxGalleryOptions({});
    const opts = (this as any)._optsArray as NgxGalleryOptions[];
    opts
      .filter(
        (opt) =>
          opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint
      )
      .map((opt) => this.combineOptions(current, opt));

    this.currentOptions.set(current);
    this.width = <string>current.width;
    this.height = <string>current.height;
  }

  private combineOptions(first: NgxGalleryOptions, second: NgxGalleryOptions) {
    Object.keys(second).map(
      (val) =>
        (first[val] = second[val] !== undefined ? second[val] : first[val])
    );
  }
}
