import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSlider} from '@angular/material/slider';
import {ToolPanelDirective} from '../../../tool-panel/tool-panel.directive';
import {AerosolService} from '../aerosol.service';

@Component({
  selector: 'app-aerosol-panel',
  templateUrl: './aerosol-panel.component.html',
  styleUrls: ['./aerosol-panel.component.scss']
})
export class AerosolPanelComponent extends ToolPanelDirective {

  private aerosolForm: FormGroup;

  @ViewChild('thicknessSlider', {
    static: false,
  }) private thicknessSlider: MatSlider;

  @ViewChild('frequencySlider', {
    static: false,
  }) private frequencySlider: MatSlider;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly service: AerosolService,
    private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.aerosolForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      frequencyFormField: [this.service.frequency, [Validators.required]],
      frequencySlider: [this.service.frequency, []],
    });
  }

  protected onThicknessChange(): void {
    this.aerosolForm.patchValue({
      thicknessFormField: this.thicknessSlider.value
    });
    this.service.thickness = this.thicknessSlider.value as number;
  }

  protected onFrequencyChange(): void {
    this.aerosolForm.patchValue({
      frequencyFormField: this.frequencySlider.value
    });
    this.service.thickness = this.frequencySlider.value as number;
  }

}
