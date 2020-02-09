import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlider, MatSlideToggle, MatSlideToggleChange } from '@angular/material';

import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { RectangleService } from '../rectangle.service';

@Component({
  selector: 'app-rectangle-panel',
  templateUrl: './rectangle-panel.component.html',
  styleUrls: ['./rectangle-panel.component.scss']
})
export class RectanglePanelComponent extends ToolPanelDirective implements AfterViewChecked {

  private rectangleForm: FormGroup;

  @ViewChild('fillOptionRef', {
    static: false,
    read : MatSlideToggle
  }) protected fillOptionRef: MatSlideToggle;

  @ViewChild('borderOptionRef', {
    static: false,
    read : MatSlideToggle
  }) protected borderOptionRef: MatSlideToggle;

  @ViewChild('thicknessSlider', {
    static: false,
    read: MatSlider
  }) private thicknessSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: RectangleService,
              private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.rectangleForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, []],
      borderOption: [this.service.borderOption, []],
      thicknessSlider: [this.service.thickness, []],
      fillOption: [this.service.fillOption, []],
    });
  }

  ngAfterViewChecked() {
    this.fillOptionRef.change.subscribe(($event: MatSlideToggleChange) => {
      this.service.fillOption = ($event.checked);
      if (!$event.checked) {
        this.borderOptionRef.disabled = true;
        this.rectangleForm.controls.borderOption.disable();
      } else {
        this.borderOptionRef.disabled = false;
        this.rectangleForm.controls.borderOption.enable();
      }
    });

    this.borderOptionRef.change.subscribe(($event: MatSlideToggleChange) => {
      this.service.borderOption = $event.checked;
      if (!$event.checked) {
        this.fillOptionRef.disabled = true;
        this.rectangleForm.controls.fillOption.disable();
      } else {
        this.fillOptionRef.disabled = false;
        this.rectangleForm.controls.fillOption.enable();
      }
    });
  }

  protected onThicknessChange(): void {
    this.rectangleForm.patchValue({ thicknessFormField: this.thicknessSlider.value });
    this.service.thickness = this.thicknessSlider.value as number;
  }
}
