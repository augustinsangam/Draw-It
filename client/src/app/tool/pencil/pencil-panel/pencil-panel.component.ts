import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSlider } from '@angular/material';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-panel',
  templateUrl: './pencil-panel.component.html',
  styleUrls: ['./pencil-panel.component.scss']
})
export class PencilPanelComponent extends ToolPanelDirective {

  private pencilForm: FormGroup;

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

  protected onThicknessChange(): void {
    this.pencilForm.patchValue
              ({ thicknessFormField: this.thicknessSlider.value });
    this.service.thickness = this.thicknessSlider.value as number;
  }
}
