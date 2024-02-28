import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class NgxGalleryHelperService {
    constructor(renderer) {
        this.renderer = renderer;
        this.swipeHandlers = new Map();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryHelperService, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryHelperService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.3", ngImport: i0, type: NgxGalleryHelperService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.Renderer2 }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9wcm9qZWN0cy9uZ3gtZ2FsbGVyeS9zcmMvbGliL25neC1nYWxsZXJ5LWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQXlCLE1BQU0sZUFBZSxDQUFDOztBQUdsRSxNQUFNLE9BQU8sdUJBQXVCO0lBR2xDLFlBQW9CLFFBQW1CO1FBQW5CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFGL0Isa0JBQWEsR0FBNEIsSUFBSSxHQUFHLEVBQXNCLENBQUM7SUFFckMsQ0FBQztJQUUzQyxXQUFXLENBQUMsTUFBZSxFQUFFLE9BQW1CLEVBQUUsRUFBVSxFQUFFLFdBQXFCLEVBQUUsV0FBcUI7UUFFdEcsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLHNFQUFzRTtRQUN0RSxJQUFJLENBQUM7WUFDRCxJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUM3RSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztpQkFDakYsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztpQkFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUM3QixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakMsQ0FBQztRQUNMLENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQztJQUNsQixDQUFDO0lBRUQsV0FBVyxDQUFDLEdBQVc7UUFDbkIsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDZCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQztpQkFDMUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvQyxDQUFDO2FBQU0sQ0FBQztZQUNKLE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztJQUNMLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFhO1FBQzFCLE9BQU8sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3RELENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxFQUFVO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVPLG1CQUFtQixDQUFDLEVBQVU7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs4R0ExQ1UsdUJBQXVCO2tIQUF2Qix1QkFBdUI7OzJGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIE5neEdhbGxlcnlIZWxwZXJTZXJ2aWNlIHtcclxuICBwcml2YXRlIHN3aXBlSGFuZGxlcnM6IE1hcDxzdHJpbmcsIEZ1bmN0aW9uW10+ID0gbmV3IE1hcDxzdHJpbmcsIEZ1bmN0aW9uW10+KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cclxuXHJcbiAgbWFuYWdlU3dpcGUoc3RhdHVzOiBib29sZWFuLCBlbGVtZW50OiBFbGVtZW50UmVmLCBpZDogc3RyaW5nLCBuZXh0SGFuZGxlcjogRnVuY3Rpb24sIHByZXZIYW5kbGVyOiBGdW5jdGlvbik6IHZvaWQge1xyXG5cclxuICAgICAgY29uc3QgaGFuZGxlcnMgPSB0aGlzLmdldFN3aXBlSGFuZGxlcnMoaWQpO1xyXG5cclxuICAgICAgLy8gc3dpcGVsZWZ0IGFuZCBzd2lwZXJpZ2h0IGFyZSBhdmFpbGFibGUgb25seSBpZiBoYW1tZXJqcyBpcyBpbmNsdWRlZFxyXG4gICAgICB0cnkge1xyXG4gICAgICAgICAgaWYgKHN0YXR1cyAmJiAhaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgICB0aGlzLnN3aXBlSGFuZGxlcnMuc2V0KGlkLCBbXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3N3aXBlbGVmdCcsICgpID0+IG5leHRIYW5kbGVyKCkpLFxyXG4gICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmxpc3RlbihlbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzd2lwZXJpZ2h0JywgKCkgPT4gcHJldkhhbmRsZXIoKSlcclxuICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoIXN0YXR1cyAmJiBoYW5kbGVycykge1xyXG4gICAgICAgICAgICAgIGhhbmRsZXJzLm1hcCgoaGFuZGxlcikgPT4gaGFuZGxlcigpKTtcclxuICAgICAgICAgICAgICB0aGlzLnJlbW92ZVN3aXBlSGFuZGxlcnMoaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlKSB7fVxyXG4gIH1cclxuXHJcbiAgdmFsaWRhdGVVcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICBpZiAodXJsLnJlcGxhY2UpIHtcclxuICAgICAgICAgIHJldHVybiB1cmwucmVwbGFjZShuZXcgUmVnRXhwKCcgJywgJ2cnKSwgJyUyMCcpXHJcbiAgICAgICAgICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFwnJywgJ2cnKSwgJyUyNycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0QmFja2dyb3VuZFVybChpbWFnZTogc3RyaW5nKSB7XHJcbiAgICAgIHJldHVybiAndXJsKFxcJycgKyB0aGlzLnZhbGlkYXRlVXJsKGltYWdlKSArICdcXCcpJztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0U3dpcGVIYW5kbGVycyhpZDogc3RyaW5nKTogRnVuY3Rpb25bXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgIHJldHVybiB0aGlzLnN3aXBlSGFuZGxlcnMuZ2V0KGlkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlU3dpcGVIYW5kbGVycyhpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc3dpcGVIYW5kbGVycy5kZWxldGUoaWQpO1xyXG4gIH1cclxufVxyXG4iXX0=