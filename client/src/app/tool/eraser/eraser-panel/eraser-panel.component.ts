import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlider } from '@angular/material';

import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { EraserService } from '../eraser.service';

@Component({
  selector: 'app-eraser-panel',
  templateUrl: './eraser-panel.component.html',
  styleUrls: ['./eraser-panel.component.scss']
})
export class EraserPanelComponent extends ToolPanelDirective {

  private eraserForm: FormGroup;

  @ViewChild('sizeSlider', {
    static: false,
  }) private sizeSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: EraserService,
              private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.eraserForm = this.formBuilder.group({
      sizeFormField: [this.service.size, [Validators.required]],
      sizeSlider: [this.service.size, []],
    });
  }

  protected onThicknessChange(): void {
    this.eraserForm.patchValue
              ({ sizeFormField: this.sizeSlider.value });
    this.service.size = this.sizeSlider.value as number;
  }
}
