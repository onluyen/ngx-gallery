import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class NgxGalleryArrowsComponent {
    prevDisabled: boolean;
    nextDisabled: boolean;
    arrowPrevIcon: string;
    arrowNextIcon: string;
    onPrevClick: EventEmitter<any>;
    onNextClick: EventEmitter<any>;
    handlePrevClick(): void;
    handleNextClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGalleryArrowsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGalleryArrowsComponent, "ngx-gallery-arrows", never, { "prevDisabled": "prevDisabled"; "nextDisabled": "nextDisabled"; "arrowPrevIcon": "arrowPrevIcon"; "arrowNextIcon": "arrowNextIcon"; }, { "onPrevClick": "onPrevClick"; "onNextClick": "onNextClick"; }, never, never, false, never>;
}
