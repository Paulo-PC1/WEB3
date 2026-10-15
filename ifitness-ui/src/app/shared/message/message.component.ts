import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-message',
  imports: [CommonModule],
   template: `
    <div *ngIf="hasError()" class="text-danger small mt-1">
      {{ text }}
    </div>
  `,
  styles: ``
})
export class MessageComponent {
  @Input() error!: string;
  @Input() control!: FormControl;
  @Input() text!: string;

  hasError(): boolean {
    return this.control.hasError(this.error) && this.control.dirty;
  }

}
