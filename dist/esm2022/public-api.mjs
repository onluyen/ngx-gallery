/*
 * Public API Surface of ngx-gallery
 */
export * from './lib/ngx-gallery.component';
export * from './lib/ngx-gallery.module';
export * from './lib/ngx-gallery-action/ngx-gallery-action.component';
export * from './lib/ngx-gallery-image/ngx-gallery-image.component';
export * from './lib/ngx-gallery-thumbnails/ngx-gallery-thumbnails.component';
export * from './lib/ngx-gallery-preview/ngx-gallery-preview.component';
export * from './lib/ngx-gallery-arrows/ngx-gallery-arrows.component';
export * from './lib/ngx-gallery-bullets/ngx-gallery-bullets.component';
export * from './lib/ngx-gallery-options';
export * from './lib/ngx-gallery-image.model';
export * from './lib/ngx-gallery-animation.model';
export * from './lib/ngx-gallery-helper.service';
export * from './lib/ngx-gallery-image-size.model';
export * from './lib/ngx-gallery-layout.model';
export * from './lib/ngx-gallery-order.model';
export * from './lib/ngx-gallery-ordered-image.model';
export * from './lib/ngx-gallery-action.model';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Byb2plY3RzL25neC1nYWxsZXJ5L3NyYy9wdWJsaWMtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBQ0gsY0FBYyw2QkFBNkIsQ0FBQztBQUM1QyxjQUFjLDBCQUEwQixDQUFDO0FBQ3pDLGNBQWMsdURBQXVELENBQUM7QUFDdEUsY0FBYyxxREFBcUQsQ0FBQztBQUNwRSxjQUFjLCtEQUErRCxDQUFDO0FBQzlFLGNBQWMseURBQXlELENBQUM7QUFDeEUsY0FBYyx1REFBdUQsQ0FBQztBQUN0RSxjQUFjLHlEQUF5RCxDQUFDO0FBQ3hFLGNBQWMsMkJBQTJCLENBQUM7QUFDMUMsY0FBYywrQkFBK0IsQ0FBQztBQUM5QyxjQUFjLG1DQUFtQyxDQUFDO0FBQ2xELGNBQWMsa0NBQWtDLENBQUM7QUFDakQsY0FBYyxvQ0FBb0MsQ0FBQztBQUNuRCxjQUFjLGdDQUFnQyxDQUFDO0FBQy9DLGNBQWMsK0JBQStCLENBQUM7QUFDOUMsY0FBYyx1Q0FBdUMsQ0FBQztBQUN0RCxjQUFjLGdDQUFnQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogUHVibGljIEFQSSBTdXJmYWNlIG9mIG5neC1nYWxsZXJ5XHJcbiAqL1xyXG5leHBvcnQgKiBmcm9tICcuL2xpYi9uZ3gtZ2FsbGVyeS5jb21wb25lbnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL2xpYi9uZ3gtZ2FsbGVyeS5tb2R1bGUnO1xyXG5leHBvcnQgKiBmcm9tICcuL2xpYi9uZ3gtZ2FsbGVyeS1hY3Rpb24vbmd4LWdhbGxlcnktYWN0aW9uLmNvbXBvbmVudCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vbGliL25neC1nYWxsZXJ5LWltYWdlL25neC1nYWxsZXJ5LWltYWdlLmNvbXBvbmVudCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vbGliL25neC1nYWxsZXJ5LXRodW1ibmFpbHMvbmd4LWdhbGxlcnktdGh1bWJuYWlscy5jb21wb25lbnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL2xpYi9uZ3gtZ2FsbGVyeS1wcmV2aWV3L25neC1nYWxsZXJ5LXByZXZpZXcuY29tcG9uZW50JztcclxuZXhwb3J0ICogZnJvbSAnLi9saWIvbmd4LWdhbGxlcnktYXJyb3dzL25neC1nYWxsZXJ5LWFycm93cy5jb21wb25lbnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL2xpYi9uZ3gtZ2FsbGVyeS1idWxsZXRzL25neC1nYWxsZXJ5LWJ1bGxldHMuY29tcG9uZW50JztcclxuZXhwb3J0ICogZnJvbSAnLi9saWIvbmd4LWdhbGxlcnktb3B0aW9ucyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vbGliL25neC1nYWxsZXJ5LWltYWdlLm1vZGVsJztcclxuZXhwb3J0ICogZnJvbSAnLi9saWIvbmd4LWdhbGxlcnktYW5pbWF0aW9uLm1vZGVsJztcclxuZXhwb3J0ICogZnJvbSAnLi9saWIvbmd4LWdhbGxlcnktaGVscGVyLnNlcnZpY2UnO1xyXG5leHBvcnQgKiBmcm9tICcuL2xpYi9uZ3gtZ2FsbGVyeS1pbWFnZS1zaXplLm1vZGVsJztcclxuZXhwb3J0ICogZnJvbSAnLi9saWIvbmd4LWdhbGxlcnktbGF5b3V0Lm1vZGVsJztcclxuZXhwb3J0ICogZnJvbSAnLi9saWIvbmd4LWdhbGxlcnktb3JkZXIubW9kZWwnO1xyXG5leHBvcnQgKiBmcm9tICcuL2xpYi9uZ3gtZ2FsbGVyeS1vcmRlcmVkLWltYWdlLm1vZGVsJztcclxuZXhwb3J0ICogZnJvbSAnLi9saWIvbmd4LWdhbGxlcnktYWN0aW9uLm1vZGVsJzsiXX0=