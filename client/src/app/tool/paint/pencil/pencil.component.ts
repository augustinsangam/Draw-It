import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlider } from '@angular/material/slider';

import { ToolComponent } from '../../tool.component';
import { PencilService } from './pencil.service';

@Component({
  selector: 'app-pencil',
  styleUrls: [
    './pencil.component.css',
  ],
  templateUrl: './pencil.component.html',
})
export class PencilComponent extends ToolComponent {
  pencilForm: FormGroup;

  @ViewChild('thicknessSlider', {
    static: false,
  }) private thicknessSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: PencilService,
              private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.pencilForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
    });
  }

  onThicknessChange(): void {
    this.pencilForm.patchValue
              ({ thicknessFormField: this.thicknessSlider.value });
    this.service.thickness = this.thicknessSlider.value as number;
  }
}
