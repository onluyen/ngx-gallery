import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class NgxGalleryActionComponent {
    icon: string;
    disabled: boolean;
    titleText: string;
    onClick: EventEmitter<Event>;
    handleClick(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxGalleryActionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxGalleryActionComponent, "ngx-gallery-action", never, { "icon": { "alias": "icon"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "titleText": { "alias": "titleText"; "required": false; }; }, { "onClick": "onClick"; }, never, never, false, never>;
}
