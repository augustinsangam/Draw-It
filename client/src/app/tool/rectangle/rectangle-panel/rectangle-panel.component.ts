import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { FillOption, RectangleService } from '../rectangle.service';

@Component({
  selector: 'app-rectangle-panel',
  templateUrl: './rectangle-panel.component.html',
  styleUrls: ['./rectangle-panel.component.scss']
})
export class RectanglePanelComponent extends ToolPanelComponent {

  fillOptions = this.service.fillOptions;
  disableWithoutFill = false;

  rectangleForm: FormGroup;

  constructor(private readonly service: RectangleService,
              private formBuilder: FormBuilder) {
    super();
    console.log(this.service);
    this.rectangleForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      fillOption: [this.service.fillOption, []],
    });
  }

  onChangeFillOption($event: MatRadioChange) {
    this.service.fillOption = ($event.value);
  }

  onThicknessChange($event: Event) {
    if (this.rectangleForm.value.thicknessSlider === 0
      && this.rectangleForm.value.fillOption !== FillOption.Without) {
        this.disableWithoutFill = true;

    } else if (this.rectangleForm.value.thicknessSlider === 0
      && this.rectangleForm.value.fillOption === FillOption.Without) {
        this.rectangleForm.patchValue({ thicknessFormField: 1 });
        this.rectangleForm.patchValue({ thicknessSlider: 1 });
        this.service.thickness = 1;
        return ;
    } else if (this.rectangleForm.value.thicknessSlider !== 0) {
      this.disableWithoutFill = false;
    }
    this.rectangleForm.patchValue({ thicknessFormField: this.rectangleForm.value.thicknessSlider });
    this.service.thickness = this.rectangleForm.value.thicknessSlider;
  }

}
