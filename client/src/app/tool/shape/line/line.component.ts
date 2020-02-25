import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { MatSlider } from '@angular/material/slider';

import { ToolComponent } from '../../tool.component';
import { LineService } from './line.service';

@Component({
  selector: 'app-line',
  styleUrls: [
    './line.component.css',
  ],
  templateUrl: './line.component.html',
})
export class LineComponent extends ToolComponent {
  @ViewChild('thicknessSlider', {
    read: MatSlider,
    static: false,
  })
  private thicknessSlider: MatSlider;

  @ViewChild ('slideToggle', {
    static: false,
  })
  protected slideToggle: MatSlideToggle;

  @ViewChild('radiusSlider', {
    read: MatSlider,
    static: false,
  })
  private radiusSlider: MatSlider;

  // Must be public
  lineForm: FormGroup;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    formBuilder: FormBuilder,
    // Must be public
    readonly service: LineService,
  ) {
    super(elementRef);
    this.lineForm = formBuilder.group({
      jonctionOption: [this.service.withJonction, []],
      radiusSlider: [this.service.radius, []],
      thicknessSlider: [this.service.thickness, []],
    });
  }

  // Must be public
  onChangeJonctionOption({checked}: MatSlideToggleChange): void {
    this.service.withJonction = checked;
  }

  // Must be public
  onThicknessChange(): void {
    if (!!this.thicknessSlider.value) {
      this.service.thickness = this.thicknessSlider.value;
    }
  }

  // Must be public
  onRadiusChange(): void {
    if (!!this.radiusSlider.value) {
      this.service.radius = this.radiusSlider.value;
    }
  }
}
