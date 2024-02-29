import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxGalleryHelperService {
    renderer;
    swipeHandlers = new Map();
    constructor(renderer) {
        this.renderer = renderer;
    }
    manageSwipe(status, element, id, nextHandler, prevHandler) {
        const handlers = this.getSwipeHandlers(id);
        // swipeleft and swiperight are available only if hammerjs is included
        try {
            if (status && !handlers) {
                this.swipeHandlers.set(id, [
                    this.renderer.listen(element.nativeElement, 'swipeleft', () => nextHandler()),
                    this.renderer.listen(element.nativeElement, 'swiperight', () => prevHandler())
                ]);
            }
            else if (!status && handlers) {
                handlers.map((handler) => handler());
                this.removeSwipeHandlers(id);
            }
        }
        catch (e) { }
    }
    validateUrl(url) {
        if (url.replace) {
            return url.replace(new RegExp(' ', 'g'), '%20')
                .replace(new RegExp('\'', 'g'), '%27');
        }
        else {
            return url;
        }
    }
    getBackgroundUrl(image) {
        return 'url(\'' + this.validateUrl(image) + '\')';
    }
    getSwipeHandlers(id) {
        return this.swipeHandlers.get(id);
    }
    removeSwipeHandlers(id) {
        this.swipeHandlers.delete(id);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryHelperService, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryHelperService });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.3", ngImport: i0, type: NgxGalleryHelperService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.Renderer2 }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQXlCLE1BQU0sZUFBZSxDQUFDOztBQUdsRSxNQUFNLE9BQU8sdUJBQXVCO0lBR2Q7SUFGWixhQUFhLEdBQTRCLElBQUksR0FBRyxFQUFzQixDQUFDO0lBRS9FLFlBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7SUFBRyxDQUFDO0lBRTNDLFdBQVcsQ0FBQyxNQUFlLEVBQUUsT0FBbUIsRUFBRSxFQUFVLEVBQUUsV0FBcUIsRUFBRSxXQUFxQjtRQUV0RyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFM0Msc0VBQXNFO1FBQ3RFLElBQUksQ0FBQztZQUNELElBQUksTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzdFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUNqRixDQUFDLENBQUM7WUFDUCxDQUFDO2lCQUFNLElBQUksQ0FBQyxNQUFNLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQzdCLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqQyxDQUFDO1FBQ0wsQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxXQUFXLENBQUMsR0FBVztRQUNuQixJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNkLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDO2lCQUMxQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLENBQUM7YUFBTSxDQUFDO1lBQ0osT0FBTyxHQUFHLENBQUM7UUFDZixDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQWE7UUFDMUIsT0FBTyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDdEQsQ0FBQztJQUVPLGdCQUFnQixDQUFDLEVBQVU7UUFDL0IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU8sbUJBQW1CLENBQUMsRUFBVTtRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxDQUFDO3VHQTFDVSx1QkFBdUI7MkdBQXZCLHVCQUF1Qjs7MkZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTmd4R2FsbGVyeUhlbHBlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgc3dpcGVIYW5kbGVyczogTWFwPHN0cmluZywgRnVuY3Rpb25bXT4gPSBuZXcgTWFwPHN0cmluZywgRnVuY3Rpb25bXT4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxyXG5cclxuICBtYW5hZ2VTd2lwZShzdGF0dXM6IGJvb2xlYW4sIGVsZW1lbnQ6IEVsZW1lbnRSZWYsIGlkOiBzdHJpbmcsIG5leHRIYW5kbGVyOiBGdW5jdGlvbiwgcHJldkhhbmRsZXI6IEZ1bmN0aW9uKTogdm9pZCB7XHJcblxyXG4gICAgICBjb25zdCBoYW5kbGVycyA9IHRoaXMuZ2V0U3dpcGVIYW5kbGVycyhpZCk7XHJcblxyXG4gICAgICAvLyBzd2lwZWxlZnQgYW5kIHN3aXBlcmlnaHQgYXJlIGF2YWlsYWJsZSBvbmx5IGlmIGhhbW1lcmpzIGlzIGluY2x1ZGVkXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgICBpZiAoc3RhdHVzICYmICFoYW5kbGVycykge1xyXG4gICAgICAgICAgICAgIHRoaXMuc3dpcGVIYW5kbGVycy5zZXQoaWQsIFtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnc3dpcGVsZWZ0JywgKCkgPT4gbmV4dEhhbmRsZXIoKSksXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3N3aXBlcmlnaHQnLCAoKSA9PiBwcmV2SGFuZGxlcigpKVxyXG4gICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICghc3RhdHVzICYmIGhhbmRsZXJzKSB7XHJcbiAgICAgICAgICAgICAgaGFuZGxlcnMubWFwKChoYW5kbGVyKSA9PiBoYW5kbGVyKCkpO1xyXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlU3dpcGVIYW5kbGVycyhpZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHt9XHJcbiAgfVxyXG5cclxuICB2YWxpZGF0ZVVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgIGlmICh1cmwucmVwbGFjZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHVybC5yZXBsYWNlKG5ldyBSZWdFeHAoJyAnLCAnZycpLCAnJTIwJylcclxuICAgICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdcXCcnLCAnZycpLCAnJTI3Jyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCYWNrZ3JvdW5kVXJsKGltYWdlOiBzdHJpbmcpIHtcclxuICAgICAgcmV0dXJuICd1cmwoXFwnJyArIHRoaXMudmFsaWRhdGVVcmwoaW1hZ2UpICsgJ1xcJyknO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRTd2lwZUhhbmRsZXJzKGlkOiBzdHJpbmcpOiBGdW5jdGlvbltdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgcmV0dXJuIHRoaXMuc3dpcGVIYW5kbGVycy5nZXQoaWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVTd2lwZUhhbmRsZXJzKGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zd2lwZUhhbmRsZXJzLmRlbGV0ZShpZCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==