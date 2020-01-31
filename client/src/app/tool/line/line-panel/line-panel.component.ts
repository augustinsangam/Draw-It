import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { LineService } from '../line.service';

@Component({
  selector: 'app-line-panel',
  templateUrl: './line-panel.component.html',
  styleUrls: ['./line-panel.component.scss']
})
export class LinePanelComponent extends ToolPanelComponent {

  jonctionOption = this.service.jonctionOption;
  jonctionOptions = this.service.jonctionOptions;

  lineForm: FormGroup;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: LineService,
              private formBuilder: FormBuilder) {
    super(elementRef);
    this.lineForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      radiusFormField: [this.service.radius, [Validators.required]],
      jonctionOption: [this.service.jonctionOption, []],
      thicknessSlider: [this.service.thickness, []],
      radiusSlider: [this.service.radius, []],
    });
  }

  onChangeJonctionOption($event: MatRadioChange) {
    this.jonctionOption = $event.value;
    this.service.jonctionOption = ($event.value);
  }

  onThicknessChange($event: Event) {
    this.lineForm.patchValue({ thicknessFormField: this.lineForm.value.thicknessSlider });
    this.service.thickness = this.lineForm.value.thicknessSlider;
  }

  onRadiusChange($event: Event) {
    this.lineForm.patchValue({ radiusFormField: this.lineForm.value.radiusSlider });
    this.service.radius = this.lineForm.value.radiusSlider;
  }

}
