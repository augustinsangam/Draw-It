import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-panel',
  templateUrl: './pencil-panel.component.html',
  styleUrls: ['./pencil-panel.component.scss']
})
export class PencilPanelComponent extends ToolPanelComponent {

  jonctionOption  = this.service.jonctionOption;
  jonctionOptions = this.service.jonctionOptions;

  pencilForm: FormGroup;

  constructor(private readonly service: PencilService,
              private formBuilder: FormBuilder) {
    super();
    console.log(this.service);
    this.pencilForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      diameterFormField: [this.service.diameter, [Validators.required]],
      jonctionOption: [this.service.jonctionOption, []],
      thicknessSlider: [this.service.thickness, []],
      diameterSlider: [this.service.diameter, []],
    });
  }

  onChangeJonctionOption($event: MatRadioChange) {
    this.jonctionOption = $event.value;
    this.service.jonctionOption = ($event.value);
  }

  onThicknessChange($event: Event) {
    this.pencilForm.patchValue({thicknessFormField : this.pencilForm.value.thicknessSlider});
    this.service.thickness = this.pencilForm.value.thicknessSlider;
  }

  onDiameterChange($event: Event) {
    this.pencilForm.patchValue({diameterFormField : this.pencilForm.value.diameterSlider});
    this.service.diameter = this.pencilForm.value.diameterSlider;
  }

}
