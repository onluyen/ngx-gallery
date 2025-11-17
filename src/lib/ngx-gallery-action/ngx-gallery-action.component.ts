import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ngx-gallery-action',
    templateUrl: './ngx-gallery-action.component.html',
    styleUrls: ['./ngx-gallery-action.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class NgxGalleryActionComponent {
  @Input() icon: string;
  @Input() disabled = false;
  @Input() titleText = '';

  @Output() onClick: EventEmitter<Event> = new EventEmitter();

  handleClick(event: Event) {
      if (!this.disabled) {
          this.onClick.emit(event);
      }

      event.stopPropagation();
      event.preventDefault();
  }
}