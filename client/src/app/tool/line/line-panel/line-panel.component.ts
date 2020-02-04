import {Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { LineService } from '../line.service';
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-line-panel',
  templateUrl: './line-panel.component.html',
  styleUrls: ['./line-panel.component.scss']
})
export class LinePanelComponent extends ToolPanelComponent {

  lineForm: FormGroup;

  @ViewChild ('slideToggle', {
    static: false
  }) slideToggle: MatSlideToggle;

  constructor(elementRef: ElementRef<HTMLElement>,
              public readonly service: LineService,
              private formBuilder: FormBuilder) {
    super(elementRef);
    this.lineForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      radiusFormField: [this.service.radius, [Validators.required]],
      jonctionOption: [this.service.withJonction, []],
      thicknessSlider: [this.service.thickness, []],
      radiusSlider: [this.service.radius, []],
    });
  }

  onChangeJonctionOption($event: MatSlideToggleChange) {
    this.service.withJonction = ($event.checked);
  }

  onThicknessChange() {
    this.lineForm.patchValue({ thicknessFormField: this.lineForm.value.thicknessSlider });
    this.service.thickness = this.lineForm.value.thicknessSlider;
  }

  onRadiusChange() {
    this.lineForm.patchValue({ radiusFormField: this.lineForm.value.radiusSlider });
    this.service.radius = this.lineForm.value.radiusSlider;
  }

}
