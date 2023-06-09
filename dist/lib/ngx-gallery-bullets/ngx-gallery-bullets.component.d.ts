import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class NgxGalleryBulletsComponent {
    count: number;
    active: number;
    onChange: EventEmitter<any>;
    getBullets(): number[];
    handleChange(event: Event, index: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGalleryBulletsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGalleryBulletsComponent, "ngx-gallery-bullets", never, { "count": "count"; "active": "active"; }, { "onChange": "onChange"; }, never, never, false, never>;
}
