import { Component, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';

import { ToolComponent } from '../../tool.component';
import { RectangleService } from './rectangle.service';

@Component({
  selector: 'app-rectangle',
  styleUrls: [
    './rectangle.component.css',
  ],
  templateUrl: './rectangle.component.html',
})
export class RectangleComponent extends ToolComponent {

  constructor(
    elementRef: ElementRef<HTMLElement>,
    formBuilder: FormBuilder,
    // Must be public
    readonly service: RectangleService,
  ) {
    super(elementRef);
  }

  // Must be public
  onFillToggle(checked: boolean) {
      this.service.fillOption = checked;
      if (!checked && !this.service.borderOption) {
        this.onBorderToggle(true);
      }
  }

  // Must be public
  onBorderToggle(checked: boolean): void {
    this.service.borderOption = checked;
    if (!checked && !this.service.fillOption) {
      this.onFillToggle(true);
    }
  }

  // Must be pulic
  onThicknessChange({value}: MatSliderChange): void {
    if (!!value) {
      this.service.thickness = value;
    }
  }
}
