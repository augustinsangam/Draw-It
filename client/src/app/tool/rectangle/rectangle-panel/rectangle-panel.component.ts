import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { RectangleService } from '../rectangle.service';

@Component({
  selector: 'app-rectangle-panel',
  templateUrl: './rectangle-panel.component.html',
  styleUrls: ['./rectangle-panel.component.scss']
})
export class RectanglePanelComponent extends ToolPanelComponent implements AfterViewChecked {

  rectangleForm: FormGroup;

  @ViewChild('fillOptionRef', {
    static: false,
    read : MatSlideToggle
  }) fillOptionRef: MatSlideToggle;

  @ViewChild('borderOptionRef', {
    static: false,
    read : MatSlideToggle
  }) borderOptionRef: MatSlideToggle;

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

  onThicknessChange() {
    this.rectangleForm.patchValue({ thicknessFormField: this.rectangleForm.value.thicknessSlider });
    this.service.thickness = this.rectangleForm.value.thicknessSlider;
  }
}
